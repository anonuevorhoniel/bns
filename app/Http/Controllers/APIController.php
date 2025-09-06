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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class APIController extends Controller
{
    public function getMunicipalities(Request $request)
    {
        $district = $request->district;
        if (Auth::user()->classification == "Field Officer") {
            $data = DB::table('tbl_assignments as a')
                ->leftJoin('tbl_municipalities as m', 'a.municipality_code', 'm.code')
                ->where('district_no', $district)
                ->where('user_id', Auth::user()->id)
                ->get();
        } else {
            $data = Municipality::where('district_no', $district)->get();
        }

        return response()->json($data);
    }

    public function getBarangays(Request $request)
    {
        $municipality = $request->code;
        $data = Barangay::where('city_and_municipality_code', $municipality)->get();
        return $data;
    }

    public function getMunicipalityVolunteers(Request $request, $municipality)
    {
        $page = $request->page;
        $scholars = Scholar::where('citymuni_id', $municipality)
            ->where('deleted_at', null);
        $limit = 7;
        $total_scholar = (clone $scholars)->count();
        $total_page = ceil($total_scholar / $limit);
        $offset = ($page - 1) * $limit;

        $data = (clone $scholars)
            ->offset($offset)
            ->limit($limit)
            ->select('tbl_scholars.id as id', DB::raw('CONCAT(tbl_scholars.last_name, " ", tbl_scholars.first_name, " ", COALESCE(tbl_scholars.middle_name, ""), " ", COALESCE(tbl_scholars.name_extension, ""))  as full_name'))
            ->get();

        $page_data = [
            'limit' => $limit,
            'total_scholar' => $total_scholar,
            'total_page' => $total_page,
            'offset' => $offset
        ];

        return response()->json(compact('data', 'page_data'));
    }

    public function getVolunteerInfo($volunteer)
    {
        $data = Volunteer::where('id', $volunteer)->get();
        return $data;
    }

    public function getCompletedVolunteers(Request $request)
    {
        # Get Volunteers with Completed Requirements and Accomplishment per Quarter
        # Get all Municipality Volunteers.
        if (!$request->form) {
            return;
        }
        $fund = $request->form['fund'];

        $volunteers = DB::table('tbl_scholars as v')
            ->select('v.id as id', 'v.*', 'b.name', DB::raw('CONCAT(v.last_name, ", ", v.first_name, " ", v.middle_name) as full_name'))
            ->leftJoin('tbl_barangays as b', 'v.barangay_id', 'b.code')
            ->where('v.citymuni_id', $request->form['municipality_code'])
            ->where(function ($q) use ($fund) {
                $q->where('fund', 'like', $fund . "%")
                    ->orWhere('fund', 'like', "BOTH%");
            })
            ->where('v.deleted_at', null)
            ->when(function () {})
            ->orderBy('v.last_name')
            ->get();

        $year_from = date('Y', strtotime($request->form['from']));
        $year_to = date('Y', strtotime($request->form['to']));
        $results = array();

        $months_array = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

        foreach ($volunteers as $volunteer) {
            $months = ServicePeriod::where('volunteer_id', $volunteer->id)->first();
            $parameters = array(
                "volunteer_id" => $volunteer->id,
                "from" => $request->form['from'],
                "to" => $request->form['to'],
                "year_from" => $year_from,
                "year_to" => $year_to,
            );
            $service_period = Scholar::getServicePeriodPerRange($parameters);

            if (sizeOf($service_period) > 0) {
                $months_to = intval($months->month_to) > 0 ? $months_array[intval($months->month_to) - 1] : 'Present';
                $results[] = array(
                    "volunteer_id" => $volunteer->id,
                    "name" => $volunteer->last_name . ', ' . $volunteer->first_name . ' ' . $volunteer->middle_name,
                    "barangay" => $volunteer->name,
                    'months' => $months_array[intval($months->month_from) - 1] . ' ' . $months->year_from . ' - ' . $months_to
                );
            }
            // $scholar_ids = $volunteers->pluck('id');
        }
        $page = $request->page ?? 1;
        $count = count($results);
        $limit = 8;
        $total_page = ceil($count / $limit);
        $offset = ($page - 1) * $limit;
        $year_from = date('Y', strtotime($request->form['from']));
        $year_to = date('Y', strtotime($request->form['to']));
        $scholar_ids = array_column($results, 'volunteer_id');
        $results = array_slice($results, $offset, $limit);
        return response()->json(compact('results', 'total_page', 'scholar_ids'));
    }

    public function getVolunteerRequirementsPerQuarter(Request $request)
    {

        $quarter = Quarter::find($request->quarter_id);
        $has_requirement = Requirement::where('quarter_id', $request->quarter_id)
            ->where('volunteer_id', $request->volunteer_id)
            ->first();

        $requirements = array();
        $requirements['voters_id'] = ($has_requirement) ? $has_requirement->voters_id : 0;
        $requirements['completed'] = ($has_requirement) ? $has_requirement->completed : 0;
        $requirements['cedula'] = ($has_requirement) ? $has_requirement->cedula : 0;
        $requirements['signature_bvw'] = ($has_requirement) ? $has_requirement->signature_bvw : 0;
        $requirements['signature_mr'] = ($has_requirement) ? $has_requirement->signature_mr : 0;


        $quarter_months = Quarter::quarterMonths($quarter->quarter);

        foreach ($quarter_months as $key => $month) {

            $check_accomplishment = Accomplishment::where('quarter_id', $request->quarter_id)
                ->where('month', $month)
                ->where('volunteer_id', $request->volunteer_id)
                ->first();

            $accomplishment_status = 0;
            if ($check_accomplishment != null) {
                if ($check_accomplishment->status == 1) {
                    $accomplishment_status = 1;
                } else {
                    $accomplishment_status =  $check_accomplishment->status;
                }
            }

            $accomplishments[$month] = $accomplishment_status;
        }

        $data = array(
            "accomplishments" => $accomplishments,
            "requirements" => $requirements,
        );
        return $data;
    }
}
