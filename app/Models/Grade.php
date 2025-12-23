<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    use HasFactory;

    protected $fillable = [
        'enrollment_id',
        'period_id',
        'class_standing',
        'periodical_exam',
        'period_grade',
    ];

    protected $casts = [
        'class_standing' => 'float',
        'periodical_exam' => 'float',
        'period_grade' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($grade) {
            // Calculate period grade: (CS * 0.6) + (PE * 0.4)
            $grade->period_grade = ($grade->class_standing * 0.6) + ($grade->periodical_exam * 0.4);
        });
    }

    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }

    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    public static function getGradePoint(float $score): float
    {
        if ($score >= 90.00) return 4.00; // A
        if ($score >= 85.00) return 3.75; // A-
        if ($score >= 80.00) return 3.50; // B+
        if ($score >= 70.00) return 3.00; // B
        if ($score >= 65.00) return 2.75; // B-
        if ($score >= 60.00) return 2.50; // C+
        if ($score >= 50.00) return 2.00; // C
        return 1.00; // D
    }

    public static function getGradeLetter(float $score): string
    {
        if ($score >= 90.00) return 'A';
        if ($score >= 85.00) return 'A-';
        if ($score >= 80.00) return 'B+';
        if ($score >= 70.00) return 'B';
        if ($score >= 65.00) return 'B-';
        if ($score >= 60.00) return 'C+';
        if ($score >= 50.00) return 'C';
        return 'D';
    }

    public static function calculateFinalGrade(float $p1Grade, float $p2Grade): float
    {
        // FG = (P1 x 50%) + (P2 x 50%)
        return ($p1Grade * 0.5) + ($p2Grade * 0.5);
    }
}
