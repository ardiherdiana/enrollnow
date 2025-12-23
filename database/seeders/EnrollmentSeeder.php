<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Period;
use App\Models\Student;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class EnrollmentSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::all();
        $subjects = Subject::all();
        $periods = Period::all();

        if ($students->isEmpty() || $subjects->isEmpty() || $periods->isEmpty()) {
            $this->command->warn('Please run StudentSeeder, SubjectSeeder, and PeriodSeeder first!');
            return;
        }

        // Enroll students in subjects for P1 (completed period)
        $p1 = $periods->where('name', 'P1')->where('academic_year', '2024/2025')->first();
        if ($p1) {
            foreach ($students->take(6) as $student) {
                foreach ($subjects->take(4) as $subject) {
                    Enrollment::firstOrCreate(
                        [
                            'student_id' => $student->id,
                            'subject_id' => $subject->id,
                            'period_id' => $p1->id,
                        ],
                        [
                            'status' => 'completed',
                        ]
                    );
                }
            }
        }

        // Enroll students in subjects for P2 (active period)
        $p2 = $periods->where('name', 'P2')->where('academic_year', '2024/2025')->first();
        if ($p2) {
            foreach ($students->take(8) as $student) {
                foreach ($subjects->take(5) as $subject) {
                    Enrollment::firstOrCreate(
                        [
                            'student_id' => $student->id,
                            'subject_id' => $subject->id,
                            'period_id' => $p2->id,
                        ],
                        [
                            'status' => 'enrolled',
                        ]
                    );
                }
            }
        }
    }
}
