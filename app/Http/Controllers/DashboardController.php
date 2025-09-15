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
        $total_muni_count =  $scholar_per_mun = DB::table('tbl_municipalities as m')
            ->count();
        $activeScholars = Scholar::where('replaced', 0)->count();
        $inactiveScholars = Scholar::whereNot('replaced', 0)->count();

        $base = DB::table('tbl_municipalities as m')
            ->leftJoin('tbl_scholars as sc', 'sc.citymuni_id', 'm.code')
            ->groupBy('m.id', 'm.name', 'm.code')
            ->select(DB::raw('COUNT(sc.id) as total'), 'm.id as id', 'm.name as month', 'm.code',);

        $pagination = pagination($request, $base);

        $scholar_per_mun = (clone $base)
            ->limit($pagination['limit'])
            ->offset($pagination['offset'])
            ->get();

        $pagination = pageInfo($pagination, $scholar_per_mun->count());

        $scholarsPerMunicipality = DB::table('tbl_municipalities as m')
            ->leftJoin('tbl_scholars as sc', 'sc.citymuni_id', 'm.code')
            ->groupBy('m.id', 'm.name', 'm.code')
            ->select(DB::raw('COUNT(sc.id) as total'), 'm.id', 'm.name as month', 'm.code')
            ->get();
        $users = User::all();

        return response()->json(compact(
            'scholars_count',
            'users',
            'scholar_per_mun',
            'total_muni_count',
            'scholarsPerMunicipality',
            'pagination',
            'activeScholars',
            'inactiveScholars'
        ));
    }

    public function countTotalActiveVolunteers()
    {

        $municipalities = Assignment::getMunicipalities();
        $total_volunteers = 0;

        foreach ($municipalities as $municipality) {

            $sp_specific = Volunteer::join('tbl_service_periods', 'tbl_volunteers.id', 'tbl_service_periods.scholar_id')
                ->where("month_to", '>=', Quarter::currentMonthNum())
                ->where("year_from", Quarter::currentYear())
                ->where("year_to", Quarter::currentYear())
                ->where("municipality_code", $municipality->code)
                ->count();


            $sp_present = Volunteer::join('tbl_service_periods', 'tbl_volunteers.id', 'tbl_service_periods.scholar_id')
                ->where("status", "present")
                ->where("municipality_code", $municipality->code)
                ->count();

            $municipal_volunteers = $sp_specific + $sp_present;
            $total_volunteers += $municipal_volunteers;
        }

        return $total_volunteers;
    }
}
