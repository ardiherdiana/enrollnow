<?php

namespace App\Http\Controllers;

use App\Models\Period;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PeriodController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Period::query();

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('academic_year', 'like', "%{$search}%")
                  ->orWhere('semester', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->get('status'));
        }

        $periods = $query->latest()->paginate(15);

        return Inertia::render('periods/index', [
            'periods' => $periods,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('periods/create');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:255',
            'semester' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:upcoming,active,completed',
        ]);

        Period::create($validated);

        return redirect()->route('periods.index')
            ->with('success', 'Periode berhasil ditambahkan.');
    }

    public function show(Period $period): Response
    {
        $period->load(['enrollments.student', 'enrollments.subject', 'enrollments.grade']);

        return Inertia::render('periods/show', [
            'period' => $period,
        ]);
    }

    public function edit(Period $period): Response
    {
        return Inertia::render('periods/edit', [
            'period' => $period,
        ]);
    }

    public function update(Request $request, Period $period): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'academic_year' => 'required|string|max:255',
            'semester' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:upcoming,active,completed',
        ]);

        $period->update($validated);

        return redirect()->route('periods.index')
            ->with('success', 'Periode berhasil diperbarui.');
    }

    public function destroy(Period $period): RedirectResponse
    {
        $period->delete();

        return redirect()->route('periods.index')
            ->with('success', 'Periode berhasil dihapus.');
    }
}
