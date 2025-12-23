<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('grades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('enrollment_id')->constrained()->onDelete('cascade');
            $table->decimal('class_standing', 5, 2)->default(0); // CS: 60%
            $table->decimal('periodical_exam', 5, 2)->default(0); // PE: 40%
            $table->decimal('period_grade', 5, 2)->default(0); // Calculated: (CS * 0.6) + (PE * 0.4)
            $table->timestamps();
            
            $table->unique('enrollment_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('grades');
    }
};
