<?php

use App\Http\Controllers\APIController;
use App\Http\Controllers\AuditTrailController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\RateController;
use App\Http\Controllers\ServicePeriodController;
use App\Http\Controllers\SignatoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VolunteerController;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/users/authenticate', [UserController::class, 'authenticate']);

Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('/scholars')->controller(VolunteerController::class)->group(function () {
        Route::post('/get', 'municipality_index');
        Route::get('/create', 'create');
        Route::get('/{id}/edit', 'edit');
        Route::post('/{id}/update', 'update');
        Route::get('/getAllMuni', "getAllMuni");
        Route::post('/store', 'store');
        Route::get('/{id}/show', 'show');
    });

    Route::prefix('/users')->controller(UserController::class)->group(function () {
        Route::get('/check-auth', 'check_auth');
        Route::post('/change_email', 'change_email');
    });

    Route::middleware('admin')->group(function () {
        Route::prefix('/scholars')->controller(VolunteerController::class)->group(function () {
            Route::post('/directory/download', 'directory_download');
            Route::post('/masterlist/download', 'masterlist_download');
        });

        Route::prefix('/dashboard')->controller(DashboardController::class)->group(function () {
            Route::post('/get-muni', 'index');
        });

        Route::prefix('/rates')->controller(RateController::class)->group(function () {
            Route::get('/', 'index');
        });

        Route::prefix('/payrolls')->controller(PayrollController::class)->group(function () {
            Route::post('/store', 'store');
            Route::post('/', 'index');
            Route::post('/show/{payroll}', 'show');
            Route::get('/{payroll}/download', 'download');
            Route::get('/masterlists/{id}/download', 'masterlist_payroll_download');
        });

        Route::prefix('/users')->controller(UserController::class)->group(function () {
            Route::post('/', 'index');
        });

        Route::prefix('/service_periods')->controller(ServicePeriodController::class)->group(function () {
            Route::post('/', 'index');
            Route::post('/{scholar}/show', 'show');
            Route::post('/store', 'store');
            Route::get('/{service_period}/destroy', 'destroy');
            Route::post('/single_store', 'single_store');
        });

        Route::prefix('/signatories')->controller(SignatoryController::class)->group(function () {
            Route::post('/store', 'store');
            Route::post('/', 'index');
            Route::get('/{signatory}/edit', 'edit');
            Route::post('/{signatory}/update', 'update');
        });

        Route::post('/audit_trails', [AuditTrailController::class, 'index']);
    });

    Route::post('/logout', [AuthController::class, 'destroy']);

    Route::controller(APIController::class)->group(function () {
        Route::post('/getMunicipalities', 'getMunicipalities');
        Route::post('/getBarangays', 'getBarangays');
    });

    Route::post('/getScholars', [APIController::class, 'getCompletedVolunteers']);
    Route::post('/gmv/{municipality}',  [APIController::class, 'getMunicipalityVolunteers']);
});
