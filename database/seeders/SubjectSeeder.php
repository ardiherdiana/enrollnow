<?php

namespace Database\Seeders;

use App\Models\Subject;
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = [
            [
                'code' => 'CS101',
                'name' => 'Pemrograman Dasar',
                'description' => 'Mata kuliah dasar pemrograman menggunakan bahasa pemrograman modern',
                'credits' => 3,
                'type' => 'non-board',
                'status' => 'active',
            ],
            [
                'code' => 'CS102',
                'name' => 'Struktur Data',
                'description' => 'Mata kuliah tentang struktur data dan algoritma',
                'credits' => 3,
                'type' => 'non-board',
                'status' => 'active',
            ],
            [
                'code' => 'CS201',
                'name' => 'Basis Data',
                'description' => 'Mata kuliah tentang desain dan implementasi basis data',
                'credits' => 3,
                'type' => 'non-board',
                'status' => 'active',
            ],
            [
                'code' => 'CS202',
                'name' => 'Pemrograman Web',
                'description' => 'Mata kuliah tentang pengembangan aplikasi web',
                'credits' => 3,
                'type' => 'non-board',
                'status' => 'active',
            ],
            [
                'code' => 'CS301',
                'name' => 'Jaringan Komputer',
                'description' => 'Mata kuliah tentang konsep dan implementasi jaringan komputer',
                'credits' => 3,
                'type' => 'non-board',
                'status' => 'active',
            ],
            [
                'code' => 'CS302',
                'name' => 'Sistem Operasi',
                'description' => 'Mata kuliah tentang konsep sistem operasi',
                'credits' => 3,
                'type' => 'non-board',
                'status' => 'active',
            ],
            [
                'code' => 'MATH101',
                'name' => 'Matematika Diskrit',
                'description' => 'Mata kuliah matematika untuk ilmu komputer',
                'credits' => 3,
                'type' => 'non-board',
                'status' => 'active',
            ],
            [
                'code' => 'ENG101',
                'name' => 'Bahasa Inggris Teknis',
                'description' => 'Mata kuliah bahasa Inggris untuk keperluan teknis',
                'credits' => 2,
                'type' => 'non-board',
                'status' => 'active',
            ],
        ];

        foreach ($subjects as $subject) {
            Subject::firstOrCreate(
                ['code' => $subject['code']],
                $subject
            );
        }
    }
}
