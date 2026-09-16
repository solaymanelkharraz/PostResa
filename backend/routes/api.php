<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\GroupMessageController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\DashboardController;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth Profile    // Auth
    Route::get('/user', [App\Http\Controllers\AuthController::class, 'me']);
    Route::post('/logout', [App\Http\Controllers\AuthController::class, 'logout']);
    Route::put('/user/password', [App\Http\Controllers\AuthController::class, 'updatePassword']);

    // Users & Onboarding
    Route::put('/onboarding', [App\Http\Controllers\UserController::class, 'onboarding']);
    Route::get('/users', [App\Http\Controllers\UserController::class, 'searchUsers']);
    
    // Super Admin endpoints
    Route::get('/superadmin/stats', [DashboardController::class, 'superAdminStats']);
    Route::get('/admin/users', [App\Http\Controllers\UserController::class, 'index']);
    Route::put('/admin/users/{user}/verify', [App\Http\Controllers\UserController::class, 'verify']);

    // Dashboard Stats & Logs
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/logs', [DashboardController::class, 'logs']);

    // Settings
    Route::get('/settings', [SettingsController::class, 'index']);
    Route::post('/settings', [SettingsController::class, 'update']);

    // Users Management (School Admin)
    Route::get('/school/users', [App\Http\Controllers\UserController::class, 'schoolUsers']);
    Route::post('/school/users', [App\Http\Controllers\UserController::class, 'storeUser']);
    Route::post('/school/users/upload', [App\Http\Controllers\UserController::class, 'uploadUsers']);
    Route::put('/school/users/{user}', [App\Http\Controllers\UserController::class, 'updateUser']);
    Route::delete('/school/users/{user}', [App\Http\Controllers\UserController::class, 'destroyUser']);
    Route::post('/school/users/{user}/reset-password', [App\Http\Controllers\UserController::class, 'resetPassword']);

    // Resources
    Route::apiResource('spaces', SpaceController::class);
    
    Route::apiResource('posts', PostController::class);
    Route::post('/posts/{post}/like', [PostController::class, 'like']);
    Route::post('/posts/{post}/comment', [PostController::class, 'comment']);
    Route::apiResource('reservations', ReservationController::class);
    Route::apiResource('subjects', SubjectController::class);
    Route::apiResource('groups', GroupController::class);
        Route::get('planning-files', [\App\Http\Controllers\PlanningFileController::class, 'index']);
        Route::delete('planning-files/{id}', [\App\Http\Controllers\PlanningFileController::class, 'destroy']);
    Route::post('/schedules/upload', [ScheduleController::class, 'upload']);
    Route::apiResource('schedules', ScheduleController::class);
    Route::get('/messages/contacts', [MessageController::class, 'contacts']);
    Route::apiResource('messages', MessageController::class);

    // Custom Message Route
    Route::patch('/messages/{message}/read', [MessageController::class, 'markAsRead']);

    Route::get('/group-messages', [GroupMessageController::class, 'index']);
    Route::post('/group-messages', [GroupMessageController::class, 'store']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/support', [App\Http\Controllers\ContactMessageController::class, 'index']);
    Route::post('/support', [App\Http\Controllers\ContactMessageController::class, 'store']);
    Route::put('/support/{id}', [App\Http\Controllers\ContactMessageController::class, 'update']);
});
