<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Space;
use App\Models\Post;
use App\Models\Reservation;

class RazziSchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Removed delete() calls so we don't accidentally wipe production data.
        
        // 2. Add School Admin (if not super_admin)
        $admin = User::firstOrCreate(
            ['email' => 'admin@razzi.ma'],
            [
                'name' => 'Admin Razzi',
                'role' => 'admin',
                'password' => bcrypt('adminrazzi'),
                'status' => 'verified',
                'metadata' => [
                    'address' => 'Quartier Administratif, Tanger',
                    'phone' => '+212 600 000 000',
                    'stagiaires_count' => 1200,
                    'profs_count' => 45,
                    'spaces_count' => 30,
                    'document_url' => 'https://example.com/doc.pdf',
                ]
            ]
        );

        // 3. Add 2 Teachers
        $prof1Name = 'Prof. Yassine';
        User::firstOrCreate(
            ['email' => 'yassine@razzi.ma'],
            [
                'name' => $prof1Name,
                'role' => 'prof',
                'password' => bcrypt(str_replace([' ', '.'], '', strtolower($prof1Name))),
                'department' => 'Informatique',
                'status' => 'verified',
            ]
        );
        
        $prof2Name = 'Prof. Fatima';
        User::firstOrCreate(
            ['email' => 'fatima@razzi.ma'],
            [
                'name' => $prof2Name,
                'role' => 'prof',
                'password' => bcrypt(str_replace([' ', '.'], '', strtolower($prof2Name))),
                'department' => 'Mathématiques',
                'status' => 'verified',
            ]
        );

        // 4. Add 4 Students
        $studentsData = [
            ['name' => 'Ahmed Ali', 'email' => 'ahmed@razzi.ma'],
            ['name' => 'Sara B', 'email' => 'sara@razzi.ma'],
            ['name' => 'Omar C', 'email' => 'omar@razzi.ma'],
            ['name' => 'Kenza D', 'email' => 'kenza@razzi.ma'],
        ];

        foreach ($studentsData as $student) {
            User::firstOrCreate(
                ['email' => $student['email']],
                [
                    'name' => $student['name'],
                    'role' => 'stagiaire',
                    'password' => bcrypt(str_replace(' ', '', strtolower($student['name']))),
                    'group' => 'Dev Digital',
                    'status' => 'verified',
                ]
            );
        }

        // 5. Add 3 Salles (Spaces)
        Space::firstOrCreate(
            ['name' => 'Salle Informatique 1'],
            [
                'type' => 'computer_lab',
                'capacity' => 24,
                'status' => 'available',
            ]
        );
        Space::firstOrCreate(
            ['name' => 'Salle de Conférence'],
            [
                'type' => 'meeting_room',
                'capacity' => 50,
                'status' => 'available',
            ]
        );
        Space::firstOrCreate(
            ['name' => 'Salle de Classe A'],
            [
                'type' => 'classroom',
                'capacity' => 30,
                'status' => 'available',
            ]
        );
    }
}
