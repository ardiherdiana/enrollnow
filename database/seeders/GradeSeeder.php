<?php

namespace Database\Seeders;

use App\Models\Enrollment;
use App\Models\Grade;
use App\Models\Period;
use Illuminate\Database\Seeder;

class GradeSeeder extends Seeder
{
    public function run(): void
    {
        // Get P1 and P2 periods
        $p1 = Period::where('name', 'P1')->where('academic_year', '2024/2025')->first();
        $p2 = Period::where('name', 'P2')->where('academic_year', '2024/2025')->first();

        if (!$p1 && !$p2) {
            $this->command->warn('Please run PeriodSeeder first!');
            return;
        }

        // Sample grade data with realistic values
        $gradeData = [
            // Excellent students
            ['cs' => 95, 'pe' => 92],
            ['cs' => 90, 'pe' => 88],
            ['cs' => 88, 'pe' => 90],
            // Good students
            ['cs' => 85, 'pe' => 82],
            ['cs' => 80, 'pe' => 78],
            ['cs' => 82, 'pe' => 80],
            // Average students
            ['cs' => 75, 'pe' => 70],
            ['cs' => 70, 'pe' => 72],
            ['cs' => 72, 'pe' => 68],
            // Below average
            ['cs' => 65, 'pe' => 60],
            ['cs' => 60, 'pe' => 58],
            ['cs' => 58, 'pe' => 55],
            // Borderline
            ['cs' => 52, 'pe' => 48],
            ['cs' => 50, 'pe' => 50],
            ['cs' => 48, 'pe' => 45],
        ];

        // Create grades for P1
        if ($p1) {
            $p1Enrollments = Enrollment::where('period_id', $p1->id)
                ->where('status', 'completed')
                ->get();

            $index = 0;
            foreach ($p1Enrollments as $enrollment) {
                // Skip if grade already exists for this enrollment and period
                if (Grade::where('enrollment_id', $enrollment->id)
                    ->where('period_id', $p1->id)
                    ->exists()) {
                    continue;
                }

                $grade = $gradeData[$index % count($gradeData)];
                
                Grade::create([
                    'enrollment_id' => $enrollment->id,
                    'period_id' => $p1->id,
                    'class_standing' => $grade['cs'],
                    'periodical_exam' => $grade['pe'],
                    // period_grade will be calculated automatically by the model
                ]);

                $index++;
            }
        }

        // Create grades for P2
        if ($p2) {
            $p2Enrollments = Enrollment::where('period_id', $p2->id)
                ->where('status', 'enrolled')
                ->take(10) // Limit to 10 for demo
                ->get();

            $index = 0;
            foreach ($p2Enrollments as $enrollment) {
                // Skip if grade already exists for this enrollment and period
                if (Grade::where('enrollment_id', $enrollment->id)
                    ->where('period_id', $p2->id)
                    ->exists()) {
                    continue;
                }

                $grade = $gradeData[$index % count($gradeData)];
                
                Grade::create([
                    'enrollment_id' => $enrollment->id,
                    'period_id' => $p2->id,
                    'class_standing' => $grade['cs'],
                    'periodical_exam' => $grade['pe'],
                    // period_grade will be calculated automatically by the model
                ]);

                $index++;
            }
        }
    }
}
