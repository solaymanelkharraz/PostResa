<?php
namespace App\Http\Controllers;
use App\Models\PlanningFile;
use Illuminate\Http\Request;

class PlanningFileController extends Controller {
    public function index() {
        return response()->json(PlanningFile::latest()->get());
    }

    public function destroy($id) {
        $file = PlanningFile::find($id);
        if ($file) {
            $file->delete();
            \App\Models\Schedule::query()->delete();
        }
        return response()->json(['message' => 'Deleted']);
    }
}