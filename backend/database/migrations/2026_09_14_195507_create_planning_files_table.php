<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
    public function up(): void {
        Schema::create("planning_files", function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string("filename");
            $table->string("status")->default("Actif");
            $table->integer("slots_count")->default(0);
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists("planning_files");
    }
};