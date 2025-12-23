<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\GradeController;
use App\Http\Controllers\PeriodController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SubjectController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Home route - redirect to login or dashboard
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect('/login');
})->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
| All routes below require authentication and email verification
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard - accessible by all authenticated users
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Student routes (for regular users)
    Route::prefix('student')->name('student.')->group(function () {
        Route::get('profile', [\App\Http\Controllers\StudentProfileController::class, 'show'])->name('profile');
        Route::get('profile/edit', [\App\Http\Controllers\StudentProfileController::class, 'edit'])->name('profile.edit');
        Route::put('profile', [\App\Http\Controllers\StudentProfileController::class, 'update'])->name('profile.update');
        Route::get('enrollments', [EnrollmentController::class, 'index'])->name('enrollments');
        Route::get('enrollments/create', [EnrollmentController::class, 'create'])->name('enrollments.create');
        Route::post('enrollments', [EnrollmentController::class, 'store'])->name('enrollments.store');
    });

    // Admin-only routes
    Route::middleware(['role:admin'])->group(function () {
        // Students Management
        Route::resource('students', StudentController::class);

        // Subjects Management
        Route::resource('subjects', SubjectController::class);

        // Periods Management
        Route::resource('periods', PeriodController::class);

        // Enrollments Management
        Route::resource('enrollments', EnrollmentController::class);
    });

    // Grades Management - accessible by all, but filtered by role
    Route::resource('grades', GradeController::class);
});

/*
|--------------------------------------------------------------------------
| Settings Routes
|--------------------------------------------------------------------------
| User settings routes (profile, password, etc.)
*/

require __DIR__.'/settings.php';
