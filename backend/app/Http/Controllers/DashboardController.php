<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Space;
use App\Models\Reservation;
use App\Models\Post;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $totalUsers = User::whereIn('role', ['prof', 'stagiaire'])->count();
        
        $pendingReservations = Reservation::where('status', 'pending')->count();
        $pendingPosts = Post::where('status', 'pending')->count();
        $totalPending = $pendingReservations + $pendingPosts;

        $totalSpaces = Space::count();
        $activeSpaces = Space::where('status', 'available')->count();

        $recentPendingReservations = Reservation::with(['user', 'space'])
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($res) {
                return [
                    'id' => $res->id,
                    'user' => $res->user ? $res->user->name : 'Unknown',
                    'role' => $res->user ? $res->user->role : 'Unknown',
                    'room' => $res->space ? $res->space->name : 'Unknown',
                    'purpose' => $res->reason ?? 'Réservation',
                    'date' => $res->start_time ? \Carbon\Carbon::parse($res->start_time)->format('M d') : '',
                    'time' => $res->start_time && $res->end_time ? \Carbon\Carbon::parse($res->start_time)->format('H:i') . ' - ' . \Carbon\Carbon::parse($res->end_time)->format('H:i') : ''
                ];
            });

        $recentPendingPosts = Post::with('user')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get()
            ->map(function($post) {
                return [
                    'id' => $post->id,
                    'type' => $post->type ?? 'News',
                    'user' => $post->user ? $post->user->name : 'Unknown',
                    'time' => $post->created_at ? $post->created_at->diffForHumans() : '',
                      'content' => $post->content
                ];
            });

        $activityQuery = ActivityLog::with('user');
        if ($request->user()->role === 'admin') {
            $activityQuery->where(function($q) {
                $q->whereHas('user', function($u) {
                    $u->where('role', '!=', 'super_admin');
                })->orWhereNull('user_id');
            });
        }

        $recentActivity = $activityQuery->latest()
            ->take(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'detail' => $log->details,
                    'time' => $log->created_at->diffForHumans()
                ];
            });

        return response()->json([
            'stats' => [
                'total_users' => $totalUsers,
                'pending_requests' => $totalPending,
                'active_spaces' => $activeSpaces,
                'total_spaces' => $totalSpaces
            ],
            'pending_reservations' => $recentPendingReservations,
            'pending_posts' => $recentPendingPosts,
            'recent_activity' => $recentActivity
        ]);
    }

    public function superAdminStats(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $activeSchools = User::where('role', 'admin')->where('status', 'verified')->count();
        $totalUsers = User::count();

        return response()->json([
            'active_schools' => $activeSchools,
            'total_users' => number_format($totalUsers),
            'server_health' => '99.9%',
            'db_load' => '24%'
        ]);
    }

    public function logs(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $query = ActivityLog::with('user');
        
        if ($request->user()->role === 'admin') {
            $query->where(function($q) {
                $q->whereHas('user', function($u) {
                    $u->where('role', '!=', 'super_admin');
                })->orWhereNull('user_id');
            });
        }

        $logs = $query->latest()->get()->map(function ($log) {
            return [
                'id' => $log->id,
                'timestamp' => $log->created_at->format('d-m-Y H:i:s'),
                'user' => $log->user ? $log->user->name : 'Système',
                'role' => $log->user ? ucfirst($log->user->role) : 'Auto',
                'action' => $log->action,
                'details' => $log->details,
                'type' => $log->type,
                'level' => strtoupper($log->type ?? 'INFO'),
                'ip' => $log->ip_address ?? 'Système'
            ];
        });

        return response()->json($logs);
    }
}