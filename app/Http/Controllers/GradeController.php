<?php

namespace App\Http\Controllers;

use App\Models\Grade;
use App\Models\Enrollment;
use App\Models\Period;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class GradeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Grade::with(['enrollment.student', 'enrollment.subject', 'enrollment.period', 'period'])
            ->whereHas('enrollment', function ($q) {
                $q->whereNotNull('student_id')->whereNotNull('subject_id');
            });

        // If user is not admin, only show their own grades
        if (!$request->user()->isAdmin()) {
            $student = $request->user()->student;
            if ($student) {
                $query->whereHas('enrollment', function ($q) use ($student) {
                    $q->where('student_id', $student->id);
                });
            } else {
                // If user doesn't have student profile, return empty
                $query->whereRaw('1 = 0');
            }
        }

        if ($request->has('enrollment_id')) {
            $query->where('enrollment_id', $request->get('enrollment_id'));
        }

        if ($request->has('period_id')) {
            $query->where('period_id', $request->get('period_id'));
        }

        $grades = $query->latest()->paginate(15);

        return Inertia::render('grades/index', [
            'grades' => $grades,
            'filters' => $request->only(['enrollment_id', 'period_id']),
        ]);
    }

    public function create(Request $request): Response
    {
        // Only admin can create grades
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $enrollments = Enrollment::with(['student', 'subject', 'period'])
            ->where('status', 'enrolled')
            ->orderBy('id')
            ->get();

        $periods = Period::whereIn('name', ['P1', 'P2'])
            ->orderBy('academic_year')
            ->orderBy('name')
            ->get();

        return Inertia::render('grades/create', [
            'enrollments' => $enrollments,
            'periods' => $periods,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Only admin can create grades
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'enrollment_id' => 'required|exists:enrollments,id',
            'period_id' => [
                'required',
                'exists:periods,id',
                Rule::unique('grades')->where(function ($query) use ($request) {
                    return $query->where('enrollment_id', $request->enrollment_id)
                                 ->where('period_id', $request->period_id);
                }),
            ],
            'class_standing' => 'required|numeric|min:0|max:100',
            'periodical_exam' => 'required|numeric|min:0|max:100',
        ]);

        // Validate that period_id matches enrollment's period_id
        $enrollment = Enrollment::findOrFail($validated['enrollment_id']);
        if ($enrollment->period_id != $validated['period_id']) {
            return redirect()->back()
                ->withErrors(['period_id' => 'Periode harus sesuai dengan periode enrollment.'])
                ->withInput();
        }

        Grade::create($validated);

        return redirect()->route('grades.index')
            ->with('success', 'Nilai berhasil ditambahkan.');
    }

    public function show(Grade $grade): Response
    {
        // Check if user can view this grade
        if (!$grade->enrollment) {
            abort(404);
        }

        // If user is not admin, only allow viewing their own grades
        if (!request()->user()->isAdmin()) {
            $student = request()->user()->student;
            if (!$student || $grade->enrollment->student_id !== $student->id) {
                abort(403, 'Unauthorized action.');
            }
        }

        $grade->load(['enrollment.student', 'enrollment.subject', 'period']);

        // Calculate final grade if both P1 and P2 exist for the same student and subject
        $finalGrade = null;
        $p1Grade = null;
        $p2Grade = null;

        $enrollment = $grade->enrollment;
        $studentId = $enrollment->student_id;
        $subjectId = $enrollment->subject_id;

        // Get P1 and P2 periods
        if ($grade->period) {
            $p1Period = Period::where('name', 'P1')
                ->where('academic_year', $grade->period->academic_year)
                ->first();
            $p2Period = Period::where('name', 'P2')
                ->where('academic_year', $grade->period->academic_year)
                ->first();

            if ($p1Period && $p2Period) {
                // Find enrollments for P1 and P2 with same student and subject
                $p1Enrollment = Enrollment::where('student_id', $studentId)
                    ->where('subject_id', $subjectId)
                    ->where('period_id', $p1Period->id)
                    ->first();
                $p2Enrollment = Enrollment::where('student_id', $studentId)
                    ->where('subject_id', $subjectId)
                    ->where('period_id', $p2Period->id)
                    ->first();

                if ($p1Enrollment && $p2Enrollment) {
                    $p1GradeModel = Grade::where('enrollment_id', $p1Enrollment->id)
                        ->where('period_id', $p1Period->id)
                        ->first();
                    $p2GradeModel = Grade::where('enrollment_id', $p2Enrollment->id)
                        ->where('period_id', $p2Period->id)
                        ->first();

                if ($p1GradeModel && $p2GradeModel) {
                    $p1Grade = $p1GradeModel->period_grade;
                    $p2Grade = $p2GradeModel->period_grade;
                    $finalGrade = Grade::calculateFinalGrade($p1Grade, $p2Grade);
                }
            }
            }
        }

        return Inertia::render('grades/show', [
            'grade' => $grade,
            'finalGrade' => $finalGrade,
            'p1Grade' => $p1Grade,
            'p2Grade' => $p2Grade,
        ]);
    }

    public function edit(Grade $grade): Response
    {
        // Only admin can edit grades
        if (!request()->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $grade->load(['enrollment.student', 'enrollment.subject', 'enrollment.period', 'period']);

        // If period_id is missing, set it from enrollment's period_id
        if (!$grade->period_id && $grade->enrollment->period_id) {
            $grade->period_id = $grade->enrollment->period_id;
            $grade->save();
        }

        // If period is not loaded, try to load it from period_id
        if (!$grade->period && $grade->period_id) {
            $grade->load('period');
        }

        // If still no period, use enrollment's period as fallback
        if (!$grade->period && $grade->enrollment->period) {
            $grade->period = $grade->enrollment->period;
            if (!$grade->period_id) {
                $grade->period_id = $grade->enrollment->period->id;
                $grade->save();
            }
        }

        $periods = Period::whereIn('name', ['P1', 'P2'])
            ->orderBy('academic_year')
            ->orderBy('name')
            ->get();

        return Inertia::render('grades/edit', [
            'grade' => $grade,
            'periods' => $periods,
        ]);
    }

    public function update(Request $request, Grade $grade): RedirectResponse
    {
        // Only admin can update grades
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'period_id' => [
                'required',
                'exists:periods,id',
                Rule::unique('grades')->where(function ($query) use ($request, $grade) {
                    return $query->where('enrollment_id', $grade->enrollment_id)
                                 ->where('period_id', $request->period_id)
                                 ->where('id', '!=', $grade->id);
                }),
            ],
            'class_standing' => 'required|numeric|min:0|max:100',
            'periodical_exam' => 'required|numeric|min:0|max:100',
        ]);

        $grade->update($validated);

        return redirect()->route('grades.index')
            ->with('success', 'Nilai berhasil diperbarui.');
    }

    public function destroy(Grade $grade): RedirectResponse
    {
        // Only admin can delete grades
        if (!request()->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        $grade->delete();

        return redirect()->route('grades.index')
            ->with('success', 'Nilai berhasil dihapus.');
    }
}
