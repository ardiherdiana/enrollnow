<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Student::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('student_id', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $students = $query->latest()->paginate(15);

        return Inertia::render('students/index', [
            'students' => $students,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('students/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|string|unique:students,student_id|max:255',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:students,email|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive,graduated',
        ]);

        Student::create($validated);

        return redirect()->route('students.index')
            ->with('success', 'Mahasiswa berhasil ditambahkan.');
    }

    public function show(Student $student): Response
    {
        $student->load(['enrollments.subject', 'enrollments.period', 'enrollments.grade']);

        return Inertia::render('students/show', [
            'student' => $student,
        ]);
    }

    public function edit(Student $student): Response
    {
        return Inertia::render('students/edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student): RedirectResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|string|unique:students,student_id,' . $student->id . '|max:255',
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:students,email,' . $student->id . '|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
            'status' => 'required|in:active,inactive,graduated',
        ]);

        $student->update($validated);

        return redirect()->route('students.index')
            ->with('success', 'Mahasiswa berhasil diperbarui.');
    }

    public function destroy(Student $student): RedirectResponse
    {
        $student->delete();

        return redirect()->route('students.index')
            ->with('success', 'Mahasiswa berhasil dihapus.');
    }
}
