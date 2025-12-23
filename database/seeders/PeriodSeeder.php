<?php

namespace Database\Seeders;

use App\Models\Period;
use Illuminate\Database\Seeder;

class PeriodSeeder extends Seeder
{
    public function run(): void
    {
        $periods = [
            [
                'name' => 'P1',
                'academic_year' => '2024/2025',
                'semester' => 'Ganjil',
                'start_date' => '2024-09-01',
                'end_date' => '2024-12-31',
                'status' => 'completed',
            ],
            [
                'name' => 'P2',
                'academic_year' => '2024/2025',
                'semester' => 'Genap',
                'start_date' => '2025-01-15',
                'end_date' => '2025-05-31',
                'status' => 'active',
            ],
            [
                'name' => 'P1',
                'academic_year' => '2025/2026',
                'semester' => 'Ganjil',
                'start_date' => '2025-09-01',
                'end_date' => '2025-12-31',
                'status' => 'upcoming',
            ],
        ];

        foreach ($periods as $period) {
            Period::firstOrCreate(
                [
                    'name' => $period['name'],
                    'academic_year' => $period['academic_year'],
                ],
                $period
            );
        }
    }
}
