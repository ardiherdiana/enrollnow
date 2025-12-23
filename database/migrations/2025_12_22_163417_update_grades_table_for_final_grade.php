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
        // Check if period_id column exists
        $columns = \DB::select("SHOW COLUMNS FROM grades LIKE 'period_id'");
        $periodIdExists = !empty($columns);

        // Check if unique constraint exists
        $indexes = \DB::select("SHOW INDEX FROM grades WHERE Key_name = 'grades_enrollment_id_unique'");
        $uniqueExists = !empty($indexes);

        if ($uniqueExists) {
            Schema::table('grades', function (Blueprint $table) {
                // Drop foreign key constraint first
                $table->dropForeign(['enrollment_id']);
                
                // Drop the unique constraint on enrollment_id
                $table->dropUnique(['enrollment_id']);
                
                // Recreate foreign key constraint
                $table->foreign('enrollment_id')->references('id')->on('enrollments')->onDelete('cascade');
            });
        }

        if (!$periodIdExists) {
            Schema::table('grades', function (Blueprint $table) {
                // Add period_id column (nullable first, we'll fill it from enrollment.period_id)
                $table->unsignedBigInteger('period_id')->nullable()->after('enrollment_id');
            });
        }

        // Delete grades with invalid period_id (if any)
        \DB::statement('DELETE grades FROM grades 
            LEFT JOIN periods ON grades.period_id = periods.id 
            WHERE periods.id IS NULL AND grades.period_id IS NOT NULL');

        // Update existing grades to set period_id from enrollment (for NULL values)
        \DB::statement('UPDATE grades 
            INNER JOIN enrollments ON grades.enrollment_id = enrollments.id 
            SET grades.period_id = enrollments.period_id 
            WHERE grades.period_id IS NULL OR grades.period_id = 0');

        // Check if foreign key on period_id exists
        $foreignKeys = \DB::select("SELECT CONSTRAINT_NAME 
            FROM information_schema.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
            AND TABLE_NAME = 'grades' 
            AND COLUMN_NAME = 'period_id' 
            AND REFERENCED_TABLE_NAME IS NOT NULL");
        $periodFkExists = !empty($foreignKeys);

        // Now make period_id required and add foreign key constraint if not exists
        Schema::table('grades', function (Blueprint $table) use ($periodFkExists) {
            if (!$periodFkExists) {
                $table->unsignedBigInteger('period_id')->nullable(false)->change();
                $table->foreign('period_id')->references('id')->on('periods')->onDelete('cascade');
            }
            
            // Check if unique constraint on [enrollment_id, period_id] exists
            $compositeIndexes = \DB::select("SHOW INDEX FROM grades WHERE Key_name = 'grades_enrollment_id_period_id_unique'");
            if (empty($compositeIndexes)) {
                // Add unique constraint on combination of enrollment_id and period_id
                // This ensures one grade per enrollment per period
                $table->unique(['enrollment_id', 'period_id']);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grades', function (Blueprint $table) {
            // Drop the new unique constraint
            $table->dropUnique(['enrollment_id', 'period_id']);
            
            // Drop period_id foreign key and column
            $table->dropForeign(['period_id']);
            $table->dropColumn('period_id');
            
            // Drop enrollment_id foreign key
            $table->dropForeign(['enrollment_id']);
            
            // Restore the old unique constraint
            $table->unique('enrollment_id');
            
            // Recreate enrollment_id foreign key
            $table->foreign('enrollment_id')->references('id')->on('enrollments')->onDelete('cascade');
        });
    }
};
