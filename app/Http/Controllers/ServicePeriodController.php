<?php

namespace App\Http\Controllers;

use App\Models\ServicePeriod;
use App\Models\Municipality;
use App\Models\Assignment;
use App\Models\AuditTrail;
use App\Models\Scholar;
use App\Models\Volunteer;
use App\Services\ServicePeriods\ServicePeriodIndexService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use DateTime;
use Exception;

class ServicePeriodController extends Controller
{

    protected $indexService;
    public function __construct(ServicePeriodIndexService $indexService)
    {
        $this->indexService = $indexService;
    }
    public function index(Request $request)
    {
        $data = $this->indexService->main($request);
        return response()->json($data);
    }

    public function verify(Request $request)
    {


        $page = [
            'name'  =>  'Settings',
            'title' =>  'Service Period',
            'crumb' =>  array(
                'Settings' => '',
                'Service Period Management' => '/settings/service_periods',
                'Add' => '/service_periods/create',
                'Verify' => ''
            )
        ];



        if ($request->to == "specific") {
            $get_to = explode('-', $request->specific_date);
            $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
            $to_month = $to_date->format('F'); // March
            $to = $to_month . ' ' . $get_to[0];
        } else {
            $to = "Present";
        }

        $get_from = explode('-', $request->from);
        $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
        $from_month = $from_date->format('F'); // March
        $from = $from_month . ' ' . $get_from[0];


        $members = array();
        foreach ($request->members as $member) {
            $volunteer = DB::table('tbl_scholars as v')
                ->select(
                    'v.id as id',
                    'v.first_name',
                    'v.middle_name',
                    'v.last_name',
                    'm.name'
                )
                ->leftJoin('tbl_municipalities as m', 'v.municipality_code', 'm.code')
                ->where('v.id', $member)
                ->get();

            if ($to == "Present") {
                $service_period = ServicePeriod::where('scholar_id', $member)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from', $get_from[0])
                    ->get();
            } else {
                $service_period = ServicePeriod::where('scholar_id', $member)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from',  $get_from[0])
                    ->where('month_to', '<=', $get_to[1])
                    ->where('year_to', $get_to[0])
                    ->get();
            }

            if ($service_period->count() == 0) {
                $conflict = "Clear";
                $remark = "Save Service Period.";
            } else {
                $conflict = "Conflict with other Service Period.";
                $remark = "Unsave Service Period.";
            }
            $members[] = array(
                'id' => $volunteer[0]->id,
                'municipality' => $volunteer[0]->name,
                'volunteer' => $volunteer[0]->last_name . ', ' . $volunteer[0]->first_name . ' ' . $volunteer[0]->middle_name,
                'remark' => $remark,
                'conflict' => $conflict
            );
        }


        // dd($members);
        return view('service_periods.verify', compact('page', 'request', 'from', 'to', 'members'));
    }


    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $members = array();

            if ($request->to == "specific") {
                $get_to = explode('-', $request->specific_date);
                $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
                $to_month = $to_date->format('F'); // March
                $to = $to_month . ' ' . $get_to[0];
                $month_to = $get_to[1];
                $year_to = $get_to[0];
            } else {
                $to = "Present";
                $month_to = 0;
                $year_to = 0;
            }

            $get_from = explode('-', $request->from);
            $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
            $from_month = $from_date->format('F'); // March
            $from = $from_month . ' ' . $get_from[0];
            foreach ($request->members as $scholar_id) {

                $volunteer = DB::table('tbl_scholars as v')
                    ->select(
                        'v.id as id',
                        'v.first_name',
                        'v.middle_name',
                        'v.last_name',
                        'm.name'
                    )
                    ->leftJoin('tbl_municipalities as m', 'v.citymuni_id', 'm.code')
                    ->where('v.id', $scholar_id)
                    ->get();

                if ($to == "Present") {
                    $existing_period = ServicePeriod::where('scholar_id', $scholar_id)
                        ->where('month_from', '>=', $get_from[1])
                        ->where('year_from', '=', $get_from[0])
                        ->get();
                } else {
                    $existing_period = ServicePeriod::where('scholar_id', $scholar_id)
                        ->where('month_from', '>=', $get_from[1])
                        ->where('year_from',  $get_from[0])
                        ->where('month_to', '<=', $get_to[1])
                        ->where('year_to', $get_to[0])
                        ->get();
                }

                if ($existing_period->count() == 0) {
                    $conflict = "Clear";
                    $remark = "Save Service Period.";

                    // insert data.
                    $period    = new ServicePeriod;
                    $period->scholar_id = $scholar_id;
                    $period->month_from = $get_from[1];
                    $period->year_from = $get_from[0];
                    $period->month_to = $month_to;
                    $period->year_to = $year_to;
                    $period->status = $request->to;
                    $period->save();

                    AuditTrail::createTrail("Add service period", $period);
                } else {
                    $conflict = $existing_period[0]->month_from . '-' . $existing_period[0]->year_from
                        . ' | ' . $existing_period[0]->month_to . '-' . $existing_period[0]->year_to;
                    $remark = "Unsave Service Period.";
                }

                $members[] = array(
                    'id' => $volunteer[0]->id,
                    'municipality' => $volunteer[0]->name,
                    'volunteer' => $volunteer[0]->last_name . ', ' . $volunteer[0]->first_name . ' ' . $volunteer[0]->middle_name,
                    'remark' => $remark,
                    'conflict' => $conflict
                );
            }

            DB::commit();
            return response()->json(compact('request', 'from', 'to', 'members'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 422);
        }
    }


    public function single_store(Request $request)
    {

        DB::beginTransaction();
        try {


            $get_from = explode('-', $request->from);
            $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
            $from_month = $from_date->format('F'); // March
            $from = $from_month . ' ' . $get_from[0];


            if ($request->to == "specific") {
                $get_to = explode('-', $request->specific_date);
                $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
                $to_month = $to_date->format('F'); // March
                $to = $to_month . ' ' . $get_to[0];
                $month_to = $get_to[1];
                $year_to = $get_to[0];
            } else {
                $to = "Present";
                $month_to = 0;
                $year_to = 0;
            }



            if ($to == "Present") {
                $existing_period = ServicePeriod::where('scholar_id', $request->scholar_id)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from', '=', $get_from[0])
                    ->get();
            } else {
                $existing_period = ServicePeriod::where('scholar_id', $request->scholar_id)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from',  $get_from[0])
                    ->where('month_to', '<=', $get_to[1])
                    ->where('year_to', $get_to[0])
                    ->get();
            }

            if ($existing_period->count() == 0) {

                // insert data.
                $period    = new ServicePeriod;
                $period->scholar_id = $request->scholar_id;
                $period->month_from = $get_from[1];
                $period->year_from = $get_from[0];
                $period->month_to = $month_to;
                $period->year_to = $year_to;
                $period->status = $request->to;
                $period->save();

                AuditTrail::createTrail("Add service period", $period);

                DB::commit();
                return response()->json('Service Period has been added.');
            } else {

                $conflict = $existing_period[0]->month_from . '-' . $existing_period[0]->year_from
                    . ' | ' . $existing_period[0]->month_to . '-' . $existing_period[0]->year_to;

                return response()->json('Conflict with Schedule - ' . $conflict, 422);
            }
        } catch (\Exception $e) {

            DB::rollBack();
            return response()->json($e->getMessage());
        }
    }

    public function show(Scholar $scholar, Request $request)
    {
        $service_period_query = ServicePeriod::where('scholar_id', $scholar->id)
            ->join('tbl_scholars as s', 'tbl_service_periods.scholar_id', 's.id')
            ->select(
                'tbl_service_periods.*',
                DB::raw('CONCAT ( s.last_name, " ",  s.first_name , " ", COALESCE(s.middle_name, ""), " " , COALESCE(s.name_extension, "" )) as full_name')
            );

        $total = (clone $service_period_query)->count();
        $page = $request->page ?? 1;
        $limit = 5;
        $total_page = ceil($total / $limit);
        $offset = ($page - 1) * $limit;
        $service_periods = (clone $service_period_query)
            ->offset($offset)
            ->limit($limit)
            ->get();
        $current_total = $service_periods->count();
        $page_info = compact('offset', 'limit', 'total_page', 'total', 'current_total');
        return response()->json(compact('service_periods', 'page_info'));
    }


    public function edit(ServicePeriod $servicePeriod)
    {
        //
    }


    public function update(Request $request)
    {
        DB::beginTransaction();
        try {


            $get_from = explode('-', $request->from);
            $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
            $from_month = $from_date->format('F'); // March
            $from = $from_month . ' ' . $get_from[0];


            if ($request->to == "specific") {
                $get_to = explode('-', $request->specific_date);
                $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
                $to_month = $to_date->format('F'); // March
                $to = $to_month . ' ' . $get_to[0];
                $month_to = $get_to[1];
                $year_to = $get_to[0];
            } else {
                $to = "Present";
                $month_to = 0;
                $year_to = 0;
            }



            if ($to == "Present") {
                $existing_period = ServicePeriod::where('scholar_id', $request->scholar_id)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from', '=', $get_from[0])
                    ->where('id', '<>', $request->id)
                    ->get();
            } else {
                $existing_period = ServicePeriod::where('scholar_id', $request->scholar_id)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from',  $get_from[0])
                    ->where('month_to', '<=', $get_to[1])
                    ->where('year_to', $get_to[0])
                    ->where('id', '<>', $request->id)
                    ->get();
            }

            if ($existing_period->count() == 0) {

                // insert data.

                $update_volunteer = ServicePeriod::where('id', $request->id)
                    ->update([
                        'scholar_id' => $request->scholar_id,
                        'month_from' => $get_from[1],
                        'year_from' => $get_from[0],
                        'month_to' => $month_to,
                        'year_to' => $year_to,
                        'status' =>  $request->to
                    ]);

                AuditTrail::createTrail("Update service period", $request);

                DB::commit();
                return back()->withSuccess('Service Period has been added.');
            } else {

                $conflict = $existing_period[0]->month_from . '-' . $existing_period[0]->year_from
                    . ' | ' . $existing_period[0]->month_to . '-' . $existing_period[0]->year_to;

                return back()->withErrors('Conflict with Schedule - ' . $conflict);
            }
        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ServicePeriod  $servicePeriod
     * @return \Illuminate\Http\Response
     */
    public function destroy(ServicePeriod $service_period)
    {
        try {
            $service_period->delete();
            return response()->json(['message' => 'Service Period Deleted']);
        } catch (Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }
}
