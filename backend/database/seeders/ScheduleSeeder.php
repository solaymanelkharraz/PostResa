<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Removed delete() calls so we don't accidentally wipe production data.

        $subjects = [
            'Développement Front-end' => \App\Models\Subject::firstOrCreate(['name' => 'Développement Front-end']),
            'Atelier UI/UX' => \App\Models\Subject::firstOrCreate(['name' => 'Atelier UI/UX']),
            'Soft Skills' => \App\Models\Subject::firstOrCreate(['name' => 'Soft Skills']),
            'Bases de Données' => \App\Models\Subject::firstOrCreate(['name' => 'Bases de Données']),
            'Projet PFE' => \App\Models\Subject::firstOrCreate(['name' => 'Projet PFE']),
        ];

        $yassine = \App\Models\User::where('name', 'Prof. Yassine')->first();
        $fatima = \App\Models\User::where('name', 'Prof. Fatima')->first();

        // If teachers don't exist, we fall back to any teacher or create one
        if (!$yassine) $yassine = \App\Models\User::factory()->create(['name' => 'Prof. Yassine', 'role' => 'prof']);
        if (!$fatima) $fatima = \App\Models\User::factory()->create(['name' => 'Prof. Fatima', 'role' => 'prof']);

        $salleInfo1 = \App\Models\Space::firstOrCreate(['name' => 'Salle Info 1'], ['type' => 'Lab', 'capacity' => 30]);
        $teams = \App\Models\Space::firstOrCreate(['name' => 'Microsoft Teams'], ['type' => 'Online', 'capacity' => 100]);
        $salleInfo3 = \App\Models\Space::firstOrCreate(['name' => 'Salle Info 3'], ['type' => 'Lab', 'capacity' => 30]);
        $atelier = \App\Models\Space::firstOrCreate(['name' => 'Atelier Réseau'], ['type' => 'Atelier', 'capacity' => 20]);
        $amphi = \App\Models\Space::firstOrCreate(['name' => 'Amphi A'], ['type' => 'Amphi', 'capacity' => 200]);

        $group = 'Dev Digital'; // Matches Ahmed Ali's group

        if (\App\Models\Schedule::where('group_name', $group)->count() === 0) {
            \App\Models\Schedule::insert([
                [
                    'group_name' => $group,
                    'subject_id' => $subjects['Développement Front-end']->id,
                    'teacher_id' => $yassine->id,
                    'space_id' => $salleInfo1->id,
                    'day' => 'Lundi',
                    'start_time' => '08:30:00',
                    'end_time' => '11:00:00',
                    'type' => 'Cours',
                    'modality' => 'Présentiel',
                    'created_at' => now(), 'updated_at' => now()
                ],
                [
                    'group_name' => $group,
                    'subject_id' => $subjects['Atelier UI/UX']->id,
                    'teacher_id' => $yassine->id,
                    'space_id' => $salleInfo1->id,
                    'day' => 'Lundi',
                    'start_time' => '11:30:00',
                    'end_time' => '13:30:00',
                    'type' => 'Atelier',
                    'modality' => 'Présentiel',
                    'created_at' => now(), 'updated_at' => now()
                ],
                [
                    'group_name' => $group,
                    'subject_id' => $subjects['Soft Skills']->id,
                    'teacher_id' => $fatima->id,
                    'space_id' => $teams->id,
                    'day' => 'Mardi',
                    'start_time' => '08:30:00',
                    'end_time' => '11:00:00',
                    'type' => 'Cours',
                    'modality' => 'À distance',
                    'created_at' => now(), 'updated_at' => now()
                ],
                [
                    'group_name' => $group,
                    'subject_id' => $subjects['Bases de Données']->id,
                    'teacher_id' => $yassine->id, // Tazi in hardcoded, but we use Yassine here
                    'space_id' => $salleInfo3->id,
                    'day' => 'Mardi',
                    'start_time' => '14:30:00',
                    'end_time' => '17:00:00',
                    'type' => 'Cours',
                    'modality' => 'Présentiel',
                    'created_at' => now(), 'updated_at' => now()
                ],
                [
                    'group_name' => $group,
                    'subject_id' => $subjects['Projet PFE']->id,
                    'teacher_id' => $fatima->id, // Azeggouar in hardcoded, use Fatima
                    'space_id' => $atelier->id,
                    'day' => 'Mercredi',
                    'start_time' => '08:30:00',
                    'end_time' => '13:30:00',
                    'type' => 'Pratique',
                    'modality' => 'Présentiel',
                    'created_at' => now(), 'updated_at' => now()
                ],
            ]);
        }
    }
}
