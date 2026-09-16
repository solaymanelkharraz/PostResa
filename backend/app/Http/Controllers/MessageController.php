<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $query = Message::with(['sender', 'receiver'])
            ->where(function ($q) use ($userId) {
                $q->where('sender_id', $userId)
                  ->orWhere('receiver_id', $userId);
            });

        if ($request->has('with_user')) {
            $withUserId = $request->with_user;
            $query->where(function ($q) use ($userId, $withUserId) {
                $q->where(function ($sub) use ($userId, $withUserId) {
                    $sub->where('sender_id', $userId)->where('receiver_id', $withUserId);
                })->orWhere(function ($sub) use ($userId, $withUserId) {
                    $sub->where('sender_id', $withUserId)->where('receiver_id', $userId);
                });
            });
        }

        $messages = $query->oldest()->get();
            
        return response()->json($messages);
    }

    public function contacts(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;
        
        // Get all messages involving the user
        $messages = Message::with(['sender', 'receiver'])
            ->where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->latest()
            ->get();

        $contacts = collect();
        $seen = [];

        foreach ($messages as $msg) {
            $otherUser = $msg->sender_id === $userId ? $msg->receiver : $msg->sender;
            if ($otherUser && !in_array($otherUser->id, $seen)) {
                $msgCopy = clone $msg;
                $msgCopy->unsetRelation('sender');
                $msgCopy->unsetRelation('receiver');
                $otherUser->last_message = $msgCopy;
                $contacts->push($otherUser);
                $seen[] = $otherUser->id;
            }
        }



        

        if ($user->role === 'stagiaire' && !empty($user->group)) {
            $contacts->prepend([
                'id' => 'group_' . $user->group,
                'name' => 'Groupe: ' . $user->group,
                'isGroup' => true,
                'groupName' => $user->group,
                'last_message' => null
            ]);
        }

        return response()->json($contacts);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        $message = $request->user()->sentMessages()->create($validated);
        return response()->json($message->load(['sender', 'receiver']), 201);
    }

    public function markAsRead(Message $message)
    {
        $message->update(['read_at' => now()]);
        return response()->json($message);
    }
}
