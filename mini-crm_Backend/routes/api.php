<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// Ajouter un utilisateur
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\Admin\CompanyController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Admin\InvitationController ;
use App\Http\Controllers\Api\Employer\EmployerController;
use App\Http\Controllers\Api\Admin\HistoryController;
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me',       [AuthController::class, 'me']);
    Route::post('/logout',  [AuthController::class, 'logout']);
    Route::post('/users', [UserController::class, 'store']);

// Modifier un utilisateur
   Route::put('/users/{id}', [UserController::class, 'update']);
  // Route pour changer le mot de passe de l'utilisateur
Route::put('/users/{id}/password', [UserController::class, 'changePassword']);

});



// Supprimer un utilisateur
Route::delete('/users/{id}', [UserController::class, 'destroy']);
Route::apiResource('companies', CompanyController::class)->middleware('auth:sanctum');
// Ces routes DOIVENT être accessibles sans authentification
Route::get('/invitation/validate/{token}', [InvitationController::class, 'validateInvitation'])->name('completeProfile');
Route::post('/invitation/complete/{token}', [InvitationController::class, 'completeProfile']) ;

// Ces autres routes peuvent rester protégées
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admins', [AdminController::class, 'index']);
    Route::post('/admins', [AdminController::class, 'store']);
    Route::put('/admins/{id}', [AdminController::class, 'update']);
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
    Route::delete('/admins/{id}', [AdminController::class, 'destroy']);
    Route::get('/admin/employee', [UserController::class, 'allEmplyee']);
    Route::get('/invitations', [InvitationController ::class, 'getAllInv']);
    Route::post('/invitations', [InvitationController ::class, 'invite']);
    Route::get('/invitations/pending', [InvitationController::class, 'pending']);
    Route::put('/invitations/{id}', [InvitationController::class, 'cancel']);
    Route::get('/admin/history', [HistoryController::class, 'index']);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
Route::middleware(['auth:sanctum', 'verified.employee'])->group(function () {
    // Récupérer les informations de l'employeur
    Route::get('/employer', [EmployerController::class, 'index']);

    // Mettre à jour le profil de l'employeur
    Route::post('/employer/update-profile', [EmployerController::class, 'updateProfile']);
});
