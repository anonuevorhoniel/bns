<?php

namespace App\Services\ServicePeriods;

use App\Models\AuditTrail;
use App\Models\ServicePeriod;
use DateTime;
use Illuminate\Support\Facades\DB;

class ServicePeriodStoreService
{
    public function main($request)
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

                // $scholar = $this->scholarQuery($scholar_id);
                $dateRange = $this->getDateRange($request, $get_to);
                $to = $dateRange['to'];
                $month_to = $dateRange['month_to'];
                $year_to = $dateRange['year_to'];

                // $existing_period = $this->getExistingPeriod($to, $get_from, $get_to, $scholar_id);

                $this->servicePeriodStore($request, $scholar_id, $get_from, $month_to, $year_to);
                // if ($existing_period->count() == 0) {
                //     $this->servicePeriodStore($request, $scholar_id, $get_from, $month_to, $year_to);
                // }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 422);
        }
    }

    private function scholarQuery($scholar_id)
    {
        $data = DB::table('tbl_scholars as s')
            ->select(
                's.id as id',
                's.first_name',
                's.middle_name',
                's.last_name',
                'm.name'
            )
            ->leftJoin('tbl_municipalities as m', 's.citymuni_id', 'm.code')
            ->where('s.id', $scholar_id)
            ->get();

        return $data;
    }

    public function getDateRange($request, $get_to)
    {
        if ($request->to == "specific") {
            $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
            $to_month = $to_date->format('F');
            $to = $to_month . ' ' . $get_to[0];
            $month_to = $get_to[1];
            $year_to = $get_to[0];
        } else {
            $to = "Present";
            $month_to = 0;
            $year_to = 0;
        }

        $data = compact('to', 'month_to', 'year_to');
        return $data;
    }

    private function getExistingPeriod($to, $get_from, $get_to, $scholar_id)
    {
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

        return $existing_period;
    }

    public function servicePeriodStore($request, $scholar_id, $get_from, $month_to, $year_to)
    {
        $period    = new ServicePeriod;
        $period->scholar_id = $scholar_id;
        $period->month_from = $get_from[1];
        $period->year_from = $get_from[0];
        $period->month_to = $month_to;
        $period->year_to = $year_to;
        $period->status = $request->to;
        $period->save();
    }
}
