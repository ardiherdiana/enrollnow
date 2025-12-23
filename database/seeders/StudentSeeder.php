<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            [
                'student_id' => 'STU001',
                'name' => 'Ahmad Fauzi',
                'email' => 'ahmad.fauzi@horizon.ac.id',
                'phone' => '081234567890',
                'date_of_birth' => '2000-05-15',
                'address' => 'Jl. Merdeka No. 123, Karawang',
                'status' => 'active',
            ],
            [
                'student_id' => 'STU002',
                'name' => 'Siti Nurhaliza',
                'email' => 'siti.nurhaliza@horizon.ac.id',
                'phone' => '081234567891',
                'date_of_birth' => '2001-03-20',
                'address' => 'Jl. Sudirman No. 456, Karawang',
                'status' => 'active',
            ],
            [
                'student_id' => 'STU003',
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@horizon.ac.id',
                'phone' => '081234567892',
                'date_of_birth' => '2000-08-10',
                'address' => 'Jl. Gatot Subroto No. 789, Karawang',
                'status' => 'active',
            ],
            [
                'student_id' => 'STU004',
                'name' => 'Dewi Sartika',
                'email' => 'dewi.sartika@horizon.ac.id',
                'phone' => '081234567893',
                'date_of_birth' => '2001-11-25',
                'address' => 'Jl. Ahmad Yani No. 321, Karawang',
                'status' => 'active',
            ],
            [
                'student_id' => 'STU005',
                'name' => 'Eko Prasetyo',
                'email' => 'eko.prasetyo@horizon.ac.id',
                'phone' => '081234567894',
                'date_of_birth' => '2000-02-14',
                'address' => 'Jl. Diponegoro No. 654, Karawang',
                'status' => 'active',
            ],
            [
                'student_id' => 'STU006',
                'name' => 'Fitri Handayani',
                'email' => 'fitri.handayani@horizon.ac.id',
                'phone' => '081234567895',
                'date_of_birth' => '2001-07-30',
                'address' => 'Jl. Kartini No. 987, Karawang',
                'status' => 'active',
            ],
            [
                'student_id' => 'STU007',
                'name' => 'Gunawan Wijaya',
                'email' => 'gunawan.wijaya@horizon.ac.id',
                'phone' => '081234567896',
                'date_of_birth' => '2000-12-05',
                'address' => 'Jl. Pahlawan No. 147, Karawang',
                'status' => 'active',
            ],
            [
                'student_id' => 'STU008',
                'name' => 'Hani Lestari',
                'email' => 'hani.lestari@horizon.ac.id',
                'phone' => '081234567897',
                'date_of_birth' => '2001-04-18',
                'address' => 'Jl. Raya Karawang No. 258, Karawang',
                'status' => 'active',
            ],
        ];

        foreach ($students as $student) {
            Student::firstOrCreate(
                ['student_id' => $student['student_id']],
                $student
            );
        }
    }
}
