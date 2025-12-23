<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SubjectController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Subject::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }

        $subjects = $query->latest()->paginate(15);

        return Inertia::render('subjects/index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('subjects/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:subjects,code|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:0',
            'type' => 'required|in:board,non-board',
            'status' => 'required|in:active,inactive',
        ]);

        Subject::create($validated);

        return redirect()->route('subjects.index')
            ->with('success', 'Mata kuliah berhasil ditambahkan.');
    }

    public function show(Subject $subject): Response
    {
        $subject->load(['enrollments.student', 'enrollments.period', 'enrollments.grade']);

        return Inertia::render('subjects/show', [
            'subject' => $subject,
        ]);
    }

    public function edit(Subject $subject): Response
    {
        return Inertia::render('subjects/edit', [
            'subject' => $subject,
        ]);
    }

    public function update(Request $request, Subject $subject): RedirectResponse
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:subjects,code,' . $subject->id . '|max:255',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:0',
            'type' => 'required|in:board,non-board',
            'status' => 'required|in:active,inactive',
        ]);

        $subject->update($validated);

        return redirect()->route('subjects.index')
            ->with('success', 'Mata kuliah berhasil diperbarui.');
    }

    public function destroy(Subject $subject): RedirectResponse
    {
        $subject->delete();

        return redirect()->route('subjects.index')
            ->with('success', 'Mata kuliah berhasil dihapus.');
    }
}
