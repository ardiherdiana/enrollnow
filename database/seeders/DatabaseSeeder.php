<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        User::firstOrCreate(
            ['email' => 'admin@horizon.ac.id'],
            [
                'name' => 'Administrator',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'role' => 'admin',
            ]
        );

        // Create test user (regular user)
        User::firstOrCreate(
            ['email' => 'ardi.herdiana@horizon.ac.id'],
            [
                'name' => 'Ardi Herdiana',
                'password' => bcrypt('password'),
                'email_verified_at' => now(),
                'role' => 'user',
            ]
        );

        // Seed all data
        $this->call([
            StudentSeeder::class,
            SubjectSeeder::class,
            PeriodSeeder::class,
            EnrollmentSeeder::class,
            GradeSeeder::class,
        ]);
    }
}
