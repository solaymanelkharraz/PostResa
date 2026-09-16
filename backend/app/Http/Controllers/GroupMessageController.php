<?php

namespace App\Http\Controllers;

use App\Models\GroupMessage;
use Illuminate\Http\Request;
use Carbon\Carbon;

class GroupMessageController extends Controller
{
    private function getCurrentAcademicYear()
    {
        $now = Carbon::now();
        if ($now->month >= 8) {
            return $now->year . '-' . ($now->year + 1);
        }
        return ($now->year - 1) . '-' . $now->year;
    }

    public function index(Request $request)
    {
        $request->validate([
            'group_name' => 'required|string',
        ]);

        $groupName = $request->group_name;
        $academicYear = $this->getCurrentAcademicYear();

        $messages = GroupMessage::with('sender')
            ->where('group_name', $groupName)
            ->where('academic_year', $academicYear)
            ->oldest()
            ->get();

        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'group_name' => 'required|string',
            'content' => 'required|string',
        ]);

        $message = GroupMessage::create([
            'group_name' => $request->group_name,
            'sender_id' => $request->user()->id,
            'content' => $request->content,
            'academic_year' => $this->getCurrentAcademicYear(),
        ]);

        return response()->json($message->load('sender'), 201);
    }
}