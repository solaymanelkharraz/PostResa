<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\User;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Auto-sync distinct groups from Users table so existing student groups automatically show up
        $userGroups = User::whereNotNull('group')
            ->where('group', '!=', '')
            ->distinct()
            ->pluck('group');

        foreach ($userGroups as $groupName) {
            Group::firstOrCreate(
                ['name' => $groupName],
                ['admin_id' => $user->role === 'admin' ? $user->id : null]
            );
        }

        return response()->json(Group::latest()->get());
    }

    public function store(Request $request)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string'
        ]);

        $group = Group::firstOrCreate(
            ['name' => $validated['name']],
            ['admin_id' => $user->role === 'admin' ? $user->id : null]
        );

        return response()->json($group, 201);
    }

    public function update(Request $request, Group $group)
    {
        $user = $request->user();
        if (!in_array($user->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string'
        ]);

        $oldName = $group->name;
        $group->update(['name' => $validated['name']]);

        // Update students with the old group name
        User::where('group', $oldName)->update(['group' => $validated['name']]);

        return response()->json($group);
    }

    public function destroy(Request $request, Group $group)
    {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $group->delete();
        return response()->json(['message' => 'Group deleted']);
    }
}