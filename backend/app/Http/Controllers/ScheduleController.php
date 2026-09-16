<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = \App\Models\Schedule::with(['subject', 'teacher', 'space']);

        if ($user->role === 'stagiaire') {
            $query->where('group_name', $user->group);
        } elseif ($user->role === 'prof') {
            $query->where('teacher_id', $user->id);
        }
        
        return response()->json($query->get());
    }

    public function upload(Request $request)
    {
        set_time_limit(0);

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
            if (count($row) !== count($header)) continue;
            $data = array_combine($header, $row);

            $teacher = \App\Models\User::where('email', trim($data['Teacher Email']))->first();
            if (!$teacher) continue;

            $subject = \App\Models\Subject::firstOrCreate(['name' => trim($data['Subject'])]);
            $space = \App\Models\Space::firstOrCreate(['name' => trim($data['Space'])], ['type' => 'Salle', 'capacity' => 30]);

            \App\Models\Schedule::updateOrCreate(
                [
                    'group_name' => trim($data['Group']),
                    'day' => trim($data['Day']),
                    'start_time' => trim($data['Start Time']),
                    'end_time' => trim($data['End Time']),
                ],
                [
                    'subject_id' => $subject->id,
                    'teacher_id' => $teacher->id,
                    'space_id' => $space->id,
                    'type' => trim($data['Type']) ?? 'Cours',
                    'modality' => trim($data['Modality']) ?? 'Présentiel',
                ]
            );
            $createdCount++;
        }

        \App\Models\PlanningFile::create([
            'filename' => $file->getClientOriginalName(),
            'status' => 'Actif',
            'slots_count' => $createdCount
        ]);

        return response()->json(['message' => "$createdCount schedules imported successfully."]);
    }

    public function destroy(string $id)
    {
        $schedule = \App\Models\Schedule::findOrFail($id);
        $schedule->delete();
        return response()->json(['message' => 'Deleted successfully']);
    }

    public function purge()
    {
        \App\Models\Schedule::query()->delete();
        return response()->json(['message' => 'All schedules deleted']);
    }
}
