<?php

use App\Http\Controllers\APIController;
use App\Http\Controllers\AuditTrailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MunicipalityController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\ServicePeriodController;
use App\Http\Controllers\SignatoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ScholarController;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/users/authenticate', [UserController::class, 'authenticate']);
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'session_id' => session()->getId(),
        'time' => now()
    ]);
});
Route::get('/municipalities', [MunicipalityController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {

    Route::prefix('/scholars')->controller(ScholarController::class)->group(function () {
        Route::post('/', 'index');
        Route::get('/create', 'create');
        Route::get('/{scholar}/edit', 'edit');
        Route::post('/{scholar}/update', 'update');
        Route::get('/getAllMuni', "getAllMuni");
        Route::post('/store', 'store');
        Route::get('/{id}/show', 'show');
    });

    Route::prefix('/users')->controller(UserController::class)->group(function () {
        Route::get('/check-auth', 'check_auth');
        Route::post('/change_email', 'change_email');
        Route::post('/change_password', 'change_password');
    });

    Route::middleware('admin')->group(function () {
        Route::prefix('/scholars')->controller(ScholarController::class)->group(function () {
            Route::post('/directory/download', 'directory_download');
            Route::post('/masterlist/download', 'masterlist_download');
        });

        Route::prefix('/dashboard')->controller(DashboardController::class)->group(function () {
            Route::post('/', 'index');
        });

        Route::prefix('/rates')->controller(RateController::class)->group(function () {
            Route::get('/', 'index')->withoutMiddleware('admin');
            Route::post('/all', 'all')->withoutMiddleware('admin');
            Route::post('/store', 'store');
            Route::post('/{rate}/destroy', 'destroy');
        });

        Route::prefix('/users')->controller(UserController::class)->group(function () {
            Route::post('/', 'index');
        });



        Route::post('/audit_trails', [AuditTrailController::class, 'index']);
    });
    
    Route::prefix('/signatories')->controller(SignatoryController::class)->group(function () {
        Route::post('/store', 'store');
        Route::post('/', 'index');
        Route::get('/{signatory}/edit', 'edit');
        Route::post('/{signatory}/update', 'update');
    });
    Route::prefix('/service_periods')->controller(ServicePeriodController::class)->group(function () {
        Route::post('/', 'index');
        Route::post('/{scholar}/show', 'show');
        Route::post('/store', 'store');
        Route::get('/{service_period}/destroy', 'destroy');
        Route::post('/single_store', 'single_store');
    });

    Route::post('/logout', [AuthController::class, 'destroy']);
    Route::prefix('/payrolls')->controller(PayrollController::class)->group(function () {
        Route::post('/store', 'store');
        Route::post('/', 'index');
        Route::post('/show/{payroll}', 'show');
        Route::post('/{payroll}/approve', 'approve')->middleware('admin');
        Route::get('/{payroll}/download', 'download');
        Route::get('/masterlists/{payroll}/download', 'masterlist_download');
        Route::post('/summary', 'summary');
    });
    Route::controller(APIController::class)->group(function () {
        Route::post('/getMunicipalities', 'getMunicipalities');
        Route::post('/getBarangays', 'getBarangays');
    });

    Route::post('/getScholars', [APIController::class, 'get_scholars']);
});
