<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return response()->json(ContactMessage::with('admin')->latest()->get());
    }

    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'message' => 'required|string'
        ]);

        ContactMessage::create([
            'admin_id' => $request->user()->id,
            'message' => $request->message
        ]);

        \App\Models\ActivityLog::create([
            'user_id' => $request->user()->id,
            'action' => 'Ticket de Support',
            'details' => 'Nouveau ticket créé',
            'type' => 'warning',
            'ip_address' => request()->ip()
        ]);

        return response()->json(['message' => 'Nous vous contacterons dans les plus brefs dlais.']);
    }

    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'super_admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $msg = ContactMessage::findOrFail($id);
        $msg->update(['status' => 'resolved']);

        return response()->json(['message' => 'Status updated']);
    }
}
