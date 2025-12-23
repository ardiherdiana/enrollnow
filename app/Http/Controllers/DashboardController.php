<?php

namespace App\Http\Controllers;

use App\Models\Student;
use App\Models\Subject;
use App\Models\Period;
use App\Models\Enrollment;
use App\Models\Grade;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        if ($isAdmin) {
            // Admin sees all statistics
            $stats = [
                'total_students' => Student::count(),
                'active_students' => Student::where('status', 'active')->count(),
                'total_subjects' => Subject::count(),
                'active_subjects' => Subject::where('status', 'active')->count(),
                'total_periods' => Period::count(),
                'active_periods' => Period::where('status', 'active')->count(),
                'total_enrollments' => Enrollment::count(),
                'total_grades' => Grade::count(),
            ];

            // Get enrollment statistics for last 6 months
            $enrollmentStats = [];
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $month = $date->format('M Y');
                $count = Enrollment::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();
                $enrollmentStats[] = ['month' => $month, 'count' => $count];
            }

            // Get student registration statistics for last 6 months
            $studentStats = [];
            for ($i = 5; $i >= 0; $i--) {
                $date = now()->subMonths($i);
                $month = $date->format('M Y');
                $count = Student::whereYear('created_at', $date->year)
                    ->whereMonth('created_at', $date->month)
                    ->count();
                $studentStats[] = ['month' => $month, 'count' => $count];
            }

            // Get grade distribution (A, A-, B+, B, B-, C+, C, D)
            $gradeStats = [];
            $grades = Grade::all();
            $distribution = [
                'A' => 0,
                'A-' => 0,
                'B+' => 0,
                'B' => 0,
                'B-' => 0,
                'C+' => 0,
                'C' => 0,
                'D' => 0,
            ];
            
            foreach ($grades as $grade) {
                $letter = Grade::getGradeLetter($grade->period_grade);
                if (isset($distribution[$letter])) {
                    $distribution[$letter]++;
                }
            }
            
            foreach ($distribution as $letter => $count) {
                $gradeStats[] = ['grade' => $letter, 'count' => $count];
            }

            // Get enrollment by period (unique by name and academic_year, sum counts)
            $enrollmentByPeriod = Period::withCount('enrollments')
                ->orderBy('start_date', 'desc')
                ->get()
                ->groupBy(function ($period) {
                    return $period->name . '-' . $period->academic_year;
                })
                ->map(function ($periods) {
                    $firstPeriod = $periods->first();
                    $totalCount = $periods->sum('enrollments_count');
                    return [
                        'name' => $firstPeriod->name . ' (' . $firstPeriod->academic_year . ')',
                        'count' => $totalCount,
                    ];
                })
                ->values()
                ->take(6)
                ->toArray();

            $recent_students = Student::latest()->take(5)->get();
            $recent_subjects = Subject::latest()->take(5)->get();
            $active_periods = Period::where('status', 'active')->get();
        } else {
            // Regular user sees only their own data
            $student = $user->student;
            $myGrades = 0;
            $myEnrollments = 0;

            if ($student) {
                $myGrades = Grade::whereHas('enrollment', function ($q) use ($student) {
                    $q->where('student_id', $student->id);
                })->count();
                $myEnrollments = Enrollment::where('student_id', $student->id)->count();
            }

            $stats = [
                'my_grades' => $myGrades,
                'my_enrollments' => $myEnrollments,
            ];

            // Get user's enrollment statistics for last 6 months
            $enrollmentStats = [];
            if ($student) {
                for ($i = 5; $i >= 0; $i--) {
                    $date = now()->subMonths($i);
                    $month = $date->format('M Y');
                    $count = Enrollment::where('student_id', $student->id)
                        ->whereYear('created_at', $date->year)
                        ->whereMonth('created_at', $date->month)
                        ->count();
                    $enrollmentStats[] = ['month' => $month, 'count' => $count];
                }

                // Get user's grade distribution (A, A-, B+, B, B-, C+, C, D)
                $gradeStats = [];
                $userGrades = Grade::whereHas('enrollment', function ($q) use ($student) {
                    $q->where('student_id', $student->id);
                })->get();
                
                $distribution = [
                    'A' => 0,
                    'A-' => 0,
                    'B+' => 0,
                    'B' => 0,
                    'B-' => 0,
                    'C+' => 0,
                    'C' => 0,
                    'D' => 0,
                ];
                
                foreach ($userGrades as $grade) {
                    $letter = Grade::getGradeLetter($grade->period_grade);
                    if (isset($distribution[$letter])) {
                        $distribution[$letter]++;
                    }
                }
                
                foreach ($distribution as $letter => $count) {
                    $gradeStats[] = ['grade' => $letter, 'count' => $count];
                }

                // Get user's enrollment by period (unique by name and academic_year)
                $enrollmentByPeriod = Enrollment::where('student_id', $student->id)
                    ->with('period')
                    ->get()
                    ->groupBy(function ($enrollment) {
                        $period = $enrollment->period;
                        return $period ? $period->name . '-' . $period->academic_year : 'N/A';
                    })
                    ->map(function ($enrollments, $key) {
                        $period = $enrollments->first()->period;
                        return [
                            'name' => $period ? $period->name . ' (' . $period->academic_year . ')' : 'N/A',
                            'count' => $enrollments->count(),
                        ];
                    })
                    ->values()
                    ->take(6)
                    ->toArray();
            } else {
                $enrollmentStats = [];
                $gradeStats = [];
                $enrollmentByPeriod = [];
            }

            $studentStats = [];
            $recent_students = collect();
            $recent_subjects = collect();
            $active_periods = Period::where('status', 'active')->get();
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_students' => $recent_students,
            'recent_subjects' => $recent_subjects,
            'active_periods' => $active_periods,
            'isAdmin' => $isAdmin,
            'enrollmentStats' => $enrollmentStats ?? [],
            'studentStats' => $studentStats ?? [],
            'gradeStats' => $gradeStats ?? [],
            'enrollmentByPeriod' => $enrollmentByPeriod ?? [],
        ]);
    }
}
