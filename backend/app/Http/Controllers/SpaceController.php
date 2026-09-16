<?php

namespace App\Http\Controllers;

use App\Models\Space;
use Illuminate\Http\Request;

class SpaceController extends Controller
{
    public function index()
    {
        return response()->json(Space::all());
    }

    public function show(Space $space)
    {
        return response()->json($space);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string',
            'capacity' => 'required|integer',
            'status' => 'nullable|in:available,maintenance,locked',
            'metadata' => 'nullable|array'
        ]);

        $space = Space::create($validated);
        return response()->json($space, 201);
    }

    public function update(Request $request, Space $space)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string',
            'capacity' => 'sometimes|required|integer',
            'status' => 'sometimes|required|in:available,maintenance,locked',
            'metadata' => 'nullable|array'
        ]);

        $space->update($validated);
        return response()->json($space);
    }

    public function destroy(Space $space)
    {
        $space->delete();
        return response()->json(null, 204);
    }
}
