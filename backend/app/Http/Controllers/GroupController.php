<?php
namespace App\Http\Controllers;
use App\Models\Group;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function index(Request $request) {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json(Group::latest()->get());
    }

    public function store(Request $request) {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $validated = $request->validate([
            'name' => 'required|string|unique:groups'
        ]);
        $group = Group::create($validated);
        return response()->json($group, 201);
    }

    public function destroy(Request $request, Group $group) {
        if (!in_array($request->user()->role, ['admin', 'super_admin'])) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $group->delete();
        return response()->json(['message' => 'Group deleted']);
    }
}