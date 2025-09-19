<?php

namespace App\Http\Controllers;

use Auth;
use App\Models\Rate;
use App\Models\User;
use App\Models\Payroll;
use App\Models\Quarter;
use App\Models\Scholar;
use App\Models\Volunteer;
use App\Models\Assignment;
use App\Models\Requirement;
use App\Models\Municipality;
use Illuminate\Http\Request;
use App\Models\Accomplishment;
use Illuminate\Support\Facades\DB;
use App\Models\MunicipalRepresentative;

class DashboardController extends Controller
{
    //
    public function index(Request $request)
    {

        $scholars_count = Scholar::count();
        $activeScholars = Scholar::where('replaced', 0)->count();
        $inactiveScholars = Scholar::whereNot('replaced', 0)->count();
        $base = Municipality::withCount(['scholars']);
        $pagination = pagination($request, $base);
        $scholar_per_mun = (clone $base)
            ->take($pagination['limit'])
            ->skip($pagination['offset'])
            ->get();
        $pagination = pageInfo($pagination, $scholar_per_mun->count());
        $scholar_per_city_chart = (clone $base)->get();
        return response()->json(compact(
            'scholars_count',
            'scholar_per_mun',
            'scholar_per_city_chart',
            'pagination',
            'activeScholars',
            'inactiveScholars'
        ));
    }
}
