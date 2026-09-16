<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Setting;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $query = Reservation::with(['user', 'space'])->latest();
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'super_admin') {
            $query->where('user_id', $request->user()->id);
        }
        return response()->json($query->get());
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation->load(['user', 'space']));
    }

    public function store(Request $request)
    {
        $settings = Setting::pluck('value', 'key');
        
        $maintenance = isset($settings['maintenance_mode']) && $settings['maintenance_mode'] === '"true"';
        if ($maintenance && $request->user()->role !== 'admin' && $request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Le système est en mode maintenance. Les réservations sont temporairement désactivées.'], 403);
        }

        $maxDays = isset($settings['max_reservation_days']) ? (int)trim($settings['max_reservation_days'], '"') : 7;

        $validated = $request->validate([
            'space_id' => 'required|exists:spaces,id',
            'purpose' => 'required|string',
            'start_time' => 'required|date|after_or_equal:today',
            'end_time' => 'required|date|after:start_time',
        ]);

        $start = Carbon::parse($validated['start_time']);
        if ($start->diffInDays(now()) > $maxDays && $request->user()->role !== 'admin') {
            return response()->json(['message' => "Vous ne pouvez pas réserver plus de $maxDays jours à l'avance."], 422);
        }

        $autoApprove = isset($settings['auto_approve_prof']) && $settings['auto_approve_prof'] === '"true"';
        $status = ($request->user()->role === 'prof' && $autoApprove) ? 'approved' : 'pending';

        $reservation = $request->user()->reservations()->create(array_merge($validated, ['status' => $status]));
        return response()->json($reservation->load(['user', 'space']), 201);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|in:pending,approved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $oldStatus = $reservation->status;
        $reservation->update($validated);
        
        if (isset($validated['status']) && $oldStatus !== $validated['status']) {
            $spaceName = $reservation->space ? $reservation->space->name : 'Unknown Space';
            $userName = $reservation->user ? $reservation->user->name : 'Unknown User';
            
            \App\Models\ActivityLog::create([
                'user_id' => $request->user()->id,
                'action' => 'Réservation ' . ucfirst($validated['status']),
                'details' => $spaceName . ' pour ' . $userName,
                'type' => $validated['status'] === 'approved' ? 'success' : 'danger',
                'ip_address' => $request->ip()
            ]);
        }

        return response()->json($reservation->load(['user', 'space']));
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(null, 204);
    }
}
