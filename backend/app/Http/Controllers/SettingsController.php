<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $settings = Setting::pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'auto_approve_prof' => 'nullable|boolean',
            'maintenance_mode' => 'nullable|boolean',
            'email_alerts' => 'nullable|boolean',
            'max_reservation_days' => 'nullable|integer'
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => json_encode($value)]
            );
        }

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Paramètres mis à jour',
            'details' => 'Mise à jour globale des paramètres',
            'type' => 'info',
            'ip_address' => $request->ip()
        ]);

        return response()->json(['message' => 'Settings updated successfully']);
    }
}
