<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Barangay;
use App\Models\Municipality;
use App\Models\AuditTrail;
use App\Models\Volunteer;
use App\Models\ServicePeriod;
use App\Models\Quarter;
use App\Models\Accomplishment;
use App\Models\Requirement;
use App\Models\Scholar;
use App\Services\API\ApiGetScholarService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class APIController extends Controller
{
    protected $getScholarService;
    public function __construct(ApiGetScholarService $getScholarService)
    {
        $this->getScholarService = $getScholarService;
    }
    public function getMunicipalities(Request $request)
    {
        $district = $request->district;
        $data = Municipality::where('district_no', $district)->get();
        return response()->json($data);
    }

    public function getBarangays(Request $request)
    {
        $municipality = $request->code;
        $data = Barangay::where('city_and_municipality_code', $municipality)->get();
        return $data;
    }

    public function get_scholars(Request $request)
    {
        $data = $this->getScholarService->main($request);
        return response()->json($data);
    }
}
