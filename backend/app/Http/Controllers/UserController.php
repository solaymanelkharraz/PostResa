<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Super Admin: Get all users (mostly admins/schools)
    public function index(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json(User::where('role', 'admin')->latest()->get());
    }

    // Super Admin: Verify a pending admin
    public function verify(Request $request, User $user)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $validated = $request->validate([
            'status' => 'required|in:pending,verified,rejected'
        ]);

        $user->update(['status' => $validated['status']]);
        return response()->json($user);
    }

    public function onboarding(Request $request)
    {
        $validated = $request->validate([
            'address' => 'required|string',
            'phone' => 'required|string',
            'stagiaires_count' => 'required|integer',
            'profs_count' => 'required|integer',
            'spaces_count' => 'required|integer',
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB Max
        ]);

        $user = $request->user();
        
        // Handle file upload to local storage (storage/app/public/documents)
        $path = $request->file('document')->store('documents', 'public');
        $documentUrl = asset('storage/' . $path);
        
        $meta = [
            'address' => $validated['address'],
            'phone' => $validated['phone'],
            'stagiaires_count' => $validated['stagiaires_count'],
            'profs_count' => $validated['profs_count'],
            'spaces_count' => $validated['spaces_count'],
            'document_url' => $documentUrl,
        ];

        // Update metadata with onboarding info
        $user->update([
            'metadata' => array_merge($user->metadata ?? [], $meta),
            // Status remains pending until super admin verifies
        ]);

        return response()->json($user);
    }

    // Get users for messaging
    public function searchUsers(Request $request)
    {
        $query = User::query();
        
        if ($request->has('role')) {
            if ($request->role === 'staff') {
                $query->whereIn('role', ['admin', 'prof']);
            } else {
                $query->where('role', $request->role);
            }
        }

        if ($request->has('q')) {
            $query->where(function($q) use ($request) {
                $q->where('name', 'like', '%' . $request->q . '%')
                  ->orWhere('email', 'like', '%' . $request->q . '%');
            });
        }
        if ($request->has('group')) {
            $query->where('group', $request->group);
        }
        
        return response()->json($query->limit(100)->get());
    }

    // School Admin: Get school users (profs, stagiaires)
    public function schoolUsers(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        // In a real multi-tenant app, filter by school_id. Here we just return prof and stagiaire.
        return response()->json(User::whereIn('role', ['prof', 'stagiaire', 'admin'])->latest()->get());
    }

    // School Admin: Create a new user (prof or stagiaire)
    public function storeUser(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'role' => 'required|in:prof,stagiaire',
            'department' => 'nullable|string',
            'group' => 'nullable|string',
        ]);

        $generatedPassword = str_replace(' ', '', strtolower($validated['name']));
        $validated['password'] = bcrypt($generatedPassword); 
        
        $user = User::create($validated);
        
        return response()->json($user, 201);
    }

    // School Admin: Update a user
    public function updateUser(Request $request, $id)
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:users,email,'.$id,
            'role' => 'sometimes|required|in:prof,stagiaire,admin',
            'department' => 'nullable|string',
            'group' => 'nullable|string',
            'status' => 'nullable|string', 
        ]);

        $user->update($validated);

        return response()->json($user);
    }

    // School Admin: Delete a user
    public function destroyUser(Request $request, User $user)
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    public function resetPassword(Request $request, User $user)
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $generatedPassword = str_replace(' ', '', strtolower($user->name));
        $user->update(['password' => bcrypt($generatedPassword)]);
        
        return response()->json([
            'message' => 'Password reset successfully',
            'new_password' => $generatedPassword
        ]);
    }

    // School Admin: Bulk Upload Users
    public function uploadUsers(Request $request)
    {
        set_time_limit(0);
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'file' => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $csvData = file_get_contents($file->getRealPath());
        
        // Remove BOM if present
        $bom = pack('H*','EFBBBF');
        $csvData = preg_replace('/^' . $bom . '/', '', $csvData);

        $rows = array_map('str_getcsv', explode("\n", trim($csvData)));
        $header = array_shift($rows);

        $createdCount = 0;

        foreach ($rows as $row) {
            if (count($row) < 2) continue; // Minimum name and email
            
            // Assume format: name,email,group
            $name = trim($row[0]);
            $email = trim($row[1]);
            $group = isset($row[2]) && trim($row[2]) !== '' ? trim($row[2]) : 'Général';

            if (empty($name) || empty($email)) continue;

            $generatedPassword = str_replace(' ', '', strtolower($name));

            $user = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => bcrypt($generatedPassword),
                    'role' => 'stagiaire',
                    'group' => $group
                ]
            );

            if ($user->wasRecentlyCreated) {
                $createdCount++;
            }
        }

        
        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Importation CSV',
            'details' => "$createdCount utilisateurs importés",
            'type' => 'info',
            'ip_address' => request()->ip()
        ]);
        return response()->json(['message' => "$createdCount stagiaires importés avec succès."]);
    }
}
