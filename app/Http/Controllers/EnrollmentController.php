<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Period;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EnrollmentController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        $query = Enrollment::with(['student', 'subject', 'period', 'grade']);

        // If user is not admin, only show their own enrollments
        if (!$isAdmin) {
            $student = $user->student;
            if ($student) {
                $query->where('student_id', $student->id);
            } else {
                $query->whereRaw('1 = 0'); // Return empty if no student profile
            }
        }

        if ($request->has('student_id') && $isAdmin) {
            $query->where('student_id', $request->get('student_id'));
        }

        if ($request->has('subject_id')) {
            $query->where('subject_id', $request->get('subject_id'));
        }

        if ($request->has('period_id')) {
            $query->where('period_id', $request->get('period_id'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $enrollments = $query->latest()->paginate(15);

        // Use different view for students vs admin
        $view = $isAdmin ? 'enrollments/index' : 'enrollments/index';
        
        return Inertia::render($view, [
            'enrollments' => $enrollments,
            'filters' => $request->only(['student_id', 'subject_id', 'period_id', 'status']),
            'isAdmin' => $isAdmin,
        ]);
    }

    public function create(Request $request): Response
    {
        $isAdmin = $request->user()->isAdmin();
        
        if ($isAdmin) {
            $students = Student::where('status', 'active')->orderBy('name')->get();
        } else {
            // For regular users, only show their own student profile
            $student = $request->user()->student;
            $students = $student ? collect([$student]) : collect();
        }

        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        // Order periods by start_date descending (newest first), then by id descending as fallback
        $periods = Period::where('status', 'active')
            ->orderBy('start_date', 'desc')
            ->orderBy('id', 'desc')
            ->get();

        // Get existing enrollments for the student (if not admin, get for logged in student)
        $existingEnrollments = [];
        if (!$isAdmin && $student) {
            $existingEnrollments = Enrollment::where('student_id', $student->id)
                ->get(['period_id', 'subject_id'])
                ->map(function ($enrollment) {
                    return [
                        'period_id' => $enrollment->period_id,
                        'subject_id' => $enrollment->subject_id,
                    ];
                })
                ->toArray();
        }

        // Use different view for students vs admin
        $view = $isAdmin ? 'enrollments/create' : 'students/enrollments-create';
        
        return Inertia::render($view, [
            'students' => $students,
            'subjects' => $subjects,
            'periods' => $periods,
            'isAdmin' => $isAdmin,
            'existingEnrollments' => $existingEnrollments,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        // Handle both single subject_id (admin) and multiple subject_ids (student)
        $hasSubjectIds = $request->has('subject_ids') && is_array($request->subject_ids);
        
        if ($hasSubjectIds) {
            // Multiple subjects (student enrollment)
            $validated = $request->validate([
                'student_id' => 'required|exists:students,id',
                'subject_ids' => 'required|array|min:1',
                'subject_ids.*' => 'required|exists:subjects,id',
                'period_id' => 'required|exists:periods,id',
                'status' => 'required|in:enrolled,completed,dropped',
            ]);

            // If user is not admin, ensure they can only enroll themselves
            if (!$isAdmin) {
                $student = $user->student;
                if (!$student || $validated['student_id'] != $student->id) {
                    abort(403, 'Unauthorized action.');
                }
                // Force status to 'enrolled' for student self-enrollment
                $validated['status'] = 'enrolled';
            }

            $created = 0;
            $skipped = 0;
            $errors = [];

            foreach ($validated['subject_ids'] as $subjectId) {
                // Check for duplicate enrollment
                $exists = Enrollment::where('student_id', $validated['student_id'])
                    ->where('subject_id', $subjectId)
                    ->where('period_id', $validated['period_id'])
                    ->exists();

                if ($exists) {
                    $skipped++;
                    continue;
                }

                Enrollment::create([
                    'student_id' => $validated['student_id'],
                    'subject_id' => $subjectId,
                    'period_id' => $validated['period_id'],
                    'status' => $validated['status'],
                ]);
                $created++;
            }

            $redirectRoute = $isAdmin ? 'enrollments.index' : 'student.enrollments';
            $message = $created > 0 
                ? "{$created} enrollment berhasil ditambahkan." . ($skipped > 0 ? " {$skipped} enrollment dilewati karena sudah ada." : '')
                : 'Semua mata kuliah yang dipilih sudah terdaftar.';

            return redirect()->route($redirectRoute)
                ->with('success', $message);
        } else {
            // Single subject (admin enrollment - backward compatibility)
            $validated = $request->validate([
                'student_id' => 'required|exists:students,id',
                'subject_id' => 'required|exists:subjects,id',
                'period_id' => 'required|exists:periods,id',
                'status' => 'required|in:enrolled,completed,dropped',
            ]);

            // Check for duplicate enrollment
            $exists = Enrollment::where('student_id', $validated['student_id'])
                ->where('subject_id', $validated['subject_id'])
                ->where('period_id', $validated['period_id'])
                ->exists();

            if ($exists) {
                return back()->withErrors([
                    'enrollment' => 'Anda sudah terdaftar pada mata kuliah ini di periode yang sama.',
                ]);
            }

            Enrollment::create($validated);

            $redirectRoute = $isAdmin ? 'enrollments.index' : 'student.enrollments';
            return redirect()->route($redirectRoute)
                ->with('success', 'Enrollment berhasil ditambahkan.');
        }
    }

    public function show(Enrollment $enrollment): Response
    {
        $enrollment->load(['student', 'subject', 'period', 'grade']);

        return Inertia::render('enrollments/show', [
            'enrollment' => $enrollment,
        ]);
    }

    public function edit(Enrollment $enrollment): Response
    {
        $enrollment->load(['student', 'subject', 'period']);
        $students = Student::where('status', 'active')->orderBy('name')->get();
        $subjects = Subject::where('status', 'active')->orderBy('name')->get();
        $periods = Period::orderBy('name')->get();

        return Inertia::render('enrollments/edit', [
            'enrollment' => $enrollment,
            'students' => $students,
            'subjects' => $subjects,
            'periods' => $periods,
        ]);
    }

    public function update(Request $request, Enrollment $enrollment): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'period_id' => 'required|exists:periods,id',
            'status' => 'required|in:enrolled,completed,dropped',
        ]);

        // Check for duplicate enrollment (excluding current)
        $exists = Enrollment::where('student_id', $validated['student_id'])
            ->where('subject_id', $validated['subject_id'])
            ->where('period_id', $validated['period_id'])
            ->where('id', '!=', $enrollment->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'enrollment' => 'Mahasiswa sudah terdaftar pada mata kuliah ini di periode yang sama.',
            ]);
        }

        $enrollment->update($validated);

        return redirect()->route('enrollments.index')
            ->with('success', 'Enrollment berhasil diperbarui.');
    }

    public function destroy(Enrollment $enrollment): RedirectResponse
    {
        $enrollment->delete();

        return redirect()->route('enrollments.index')
            ->with('success', 'Enrollment berhasil dihapus.');
    }
}
