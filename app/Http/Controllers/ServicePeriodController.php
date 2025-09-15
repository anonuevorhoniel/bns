<?php

namespace App\Http\Controllers;

use App\Models\ServicePeriod;
use App\Models\Municipality;
use App\Models\Assignment;
use App\Models\AuditTrail;
use App\Models\Scholar;
use App\Models\Volunteer;
use App\Services\ServicePeriods\ServicePeriodIndexService;
use App\Services\ServicePeriods\ServicePeriodStoreService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use DateTime;
use Exception;

class ServicePeriodController extends Controller
{

    protected $indexService;
    protected $storeService;
    public function __construct(ServicePeriodIndexService $indexService, ServicePeriodStoreService $storeService)
    {
        $this->indexService = $indexService;
        $this->storeService = $storeService;
    }
    public function index(Request $request)
    {
        $data = $this->indexService->main($request);
        return response()->json($data);
    }

    public function store(Request $request)
    {
        $members = array();
        $get_from = explode('-', $request->from);
        $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
        $from_month = $from_date->format('F');
        $from = $from_month . ' ' . $get_from[0];
        $get_to = explode('-', $request->specific_date);

        DB::beginTransaction();
        try {
            foreach ($request->members as $scholar_id) {
                $dateRange = $this->storeService->getDateRange($request, $get_to);
                $to = $dateRange['to'];
                $month_to = $dateRange['month_to'];
                $year_to = $dateRange['year_to'];
                $this->storeService->servicePeriodStore($request, $scholar_id, $get_from, $month_to, $year_to);
            }
            DB::commit();
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
        // $service_period_query = ServicePeriod::where('scholar_id', $scholar->id)
        //     ->join('tbl_scholars as s', 'tbl_service_periods.scholar_id', 's.id')
        //     ->select(
        //         'tbl_service_periods.*',
        //         DB::raw('CONCAT ( s.last_name, " ",  s.first_name , " ", COALESCE(s.middle_name, ""), " " , COALESCE(s.name_extension, "" )) as full_name')
        //     );
        $base = ServicePeriod::where('scholar_id', $scholar->id);
        $pagination = pagination($request, $base);
        $service_periods = (clone $base)
            ->offset($pagination['offset'])
            ->limit($pagination['limit'])
            ->get();
        $pagination = pageInfo($pagination, $service_periods->count());
        $service_periods->map(function ($q) {
            $q->from = Carbon::parse("$q->year_from-$q->month_from")->format('F Y');
            $q->to = $q->year_to != 0 && $q->month_to != 0 ? Carbon::parse("$q->year_to-$q->month_to")->format('F Y') : 'Present';
        });
        return response()->json(compact('service_periods', 'pagination'));
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
