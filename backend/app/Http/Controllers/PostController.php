<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($request->has('admin') && in_array($user->role, ['admin', 'super_admin'])) {
            $query = Post::with('user')->latest();
        } else {
            $query = Post::with('user')->where('status', 'published')->latest();
        }
        
        // Personalized Campus Feed based on group
        if ($user->role === 'stagiaire' && $user->group) {
            $query->where(function($q) use ($user) {
                // Posts with no specific target audience
                $q->whereNull('target_audience')
                  // Or posts where the target_audience JSON array contains the user's group
                  ->orWhereJsonContains('target_audience', $user->group);
            });
        }

        return response()->json($query->get());
    }

    public function show(Post $post)
    {
        return response()->json($post->load('user'));
    }

    public function store(Request $request)
    {
        if ($request->user()->role === 'stagiaire') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:announcement,event,ad',
            'image_url' => 'nullable|url',
            'target_audience' => 'nullable|array'
        ]);

        $post = $request->user()->posts()->create($validated);
        return response()->json($post->load('user'), 201);
    }

    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'status' => 'sometimes|required|in:pending,published,rejected',
        ]);

        $post->update($validated);
        return response()->json($post->load('user'));
    }

    public function destroy(Post $post)
    {
        $post->delete();
        return response()->json(null, 204);
    }
}
