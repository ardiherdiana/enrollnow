<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StudentProfileController extends Controller
{
    /**
     * Show the student's profile page
     */
    public function show(Request $request): Response
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            // If student doesn't exist, create one from user data
            $student = Student::create([
                'student_id' => 'STU' . str_pad($user->id, 6, '0', STR_PAD_LEFT),
                'name' => $user->name,
                'email' => $user->email,
                'status' => 'active',
            ]);
        }

        $student->load(['enrollments.subject', 'enrollments.period', 'enrollments.grade']);

        return Inertia::render('students/profile', [
            'student' => $student,
        ]);
    }

    /**
     * Show the form for editing the student's profile
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            // If student doesn't exist, create one from user data
            $student = Student::create([
                'student_id' => 'STU' . str_pad($user->id, 6, '0', STR_PAD_LEFT),
                'name' => $user->name,
                'email' => $user->email,
                'status' => 'active',
            ]);
        }

        return Inertia::render('students/profile-edit', [
            'student' => $student,
        ]);
    }

    /**
     * Update the student's profile
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        $student = $user->student;

        if (!$student) {
            return redirect()->route('student.profile')
                ->withErrors(['error' => 'Profil mahasiswa tidak ditemukan.']);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        // Update student profile
        $student->update($validated);

        // Also update user name if changed
        if ($student->name !== $user->name) {
            $user->name = $student->name;
            $user->save();
        }

        return redirect()->route('student.profile')
            ->with('success', 'Profil berhasil diperbarui.');
    }
}
