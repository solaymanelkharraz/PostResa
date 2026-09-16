<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|in:admin,prof,stagiaire'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'stagiaire',
            'status' => ($validated['role'] ?? 'stagiaire') === 'admin' ? 'pending' : 'verified'
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        \App\Models\ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'Nouvelle Inscription',
            'details' => "Inscription du compte " . $user->email,
            'type' => 'success',
            'ip_address' => request()->ip()
        ]);

        return response()->json([
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => 'Identifiants invalides'
            ], 401);
        }

        $user = User::where('email', $request->email)->firstOrFail();

        if ($user->status === 'blocked') {
            Auth::logout();
            return response()->json([
                'message' => 'Votre compte a été bloqué.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        \App\Models\ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'Nouvelle Inscription',
            'details' => "Inscription du compte " . $user->email,
            'type' => 'success',
            'ip_address' => request()->ip()
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => $user->id,
            'action' => 'Connexion Réussie',
            'details' => 'Connexion via API',
            'type' => 'info',
            'ip_address' => $request->ip()
        ]);

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $request->user()->update(['is_online' => false]);
        return response()->json(['message' => 'Déconnecté avec succès']);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!\Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect'], 400);
        }

        $user->update([
            'password' => bcrypt($validated['new_password'])
        ]);

        return response()->json(['message' => 'Mot de passe mis à jour avec succès']);
    }
}
