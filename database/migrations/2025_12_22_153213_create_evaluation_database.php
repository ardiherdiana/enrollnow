<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * Note: Database 'evaluation' is already created by Laravel when you answer 'yes'
     * to the prompt. This migration is kept for documentation purposes.
     * 
     * If you need to create the database manually, use:
     * CREATE DATABASE IF NOT EXISTS `evaluation` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     */
    public function up(): void
    {
        // Database is already created by Laravel's migration system
        // No action needed here
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We don't drop the database in down() to prevent accidental data loss
        // If you need to drop the database, do it manually:
        // DROP DATABASE IF EXISTS `evaluation`;
    }
};
