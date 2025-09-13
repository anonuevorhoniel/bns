<?php

namespace App\Services\Payrolls;


use DateTime;
use App\Models\Rate;
use App\Models\Quarter;
use App\Models\Signatory;

use App\Models\Municipality;
use App\Models\ServicePeriod;
use Illuminate\Support\Facades\DB;



class PayrollShowService
{
    public function main($request, $payroll)
    {
        $page = $request->page;
        $search = $request->search;
        $base = $this->base($payroll, $search);
        $pagination = pagination($request, $base);
        $payroll = $this->payrollQuery($payroll);

        $scholars = (clone $base)
            ->limit($pagination['limit'])
            ->offset($pagination['offset'])
            ->get();

        $pagination = pageInfo($pagination, $scholars->count());
        $scholars = $this->scholarQuery($scholars);
        $data = compact(
            'scholars',
            'payroll',
            'pagination'
        );

        return $data;
    }

    private function base($payroll, $search)
    {
        $data = DB::table('tbl_payroll_details as pd')
            ->leftJoin('tbl_scholars as v', 'pd.scholar_id', 'v.id')
            ->leftjoin('tbl_barangays as b', 'b.code', 'v.barangay_id')
            ->join('tbl_municipalities as m', 'm.code', 'v.citymuni_id')
            ->where('pd.payroll_id', $payroll->id)
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qv) use ($search) {
                    $qv->where('v.first_name', 'LIKE', "$search%")
                        ->orWhere('v.last_name', 'LIKE', "$search%")
                        ->orWhere('v.middle_name', 'LIKE', "$search%");
                });
            })
            ->orderBy('v.last_name')
            ->select(
                'v.*',
                'b.name as barangay_name',
                'm.name as municity_name',
                DB::raw('CONCAT(v.first_name, " ", COALESCE(v.middle_name,""), " ", v.last_name) as full_name')
            );

        return $data;
    }

    private function payrollQuery($payroll)
    {
        $signatories = Signatory::whereIn('id', json_decode($payroll->signatories))->get();
        $month_from   = DateTime::createFromFormat('!m', $payroll->month_from)->format('F'); // March
        $month_to   = DateTime::createFromFormat('!m', $payroll->month_to)->format('F');
        $year = date('Y');
        $municipality = Municipality::where('code', $payroll->municipality_code)->first();
        $payroll->month_from = $month_from;
        $payroll->municipality = $municipality->name;
        $payroll->month_to = $month_to;
        $payroll->year = $year;
        $payroll->signatories = $signatories;
        $payroll->grand_total = number_format($payroll->grand_total, 2);

        return $payroll;
    }

    private function scholarQuery($scholars)
    {
        $months = months();
        $data = $scholars->map(function ($scholar) use ($months) {
            
            $service_period = ServicePeriod::where('scholar_id', $scholar->id)
                ->orderBy('year_from', 'desc')
                ->orderBy('month_from', 'desc')
                ->first();

            $month_from = $months[intval($service_period->month_from) - 1];
            $year_from = $service_period->year_from;
            $month_to = $service_period->month_to != 0 ? $months[intval($service_period->month_to) - 1] : 'Present';
            $scholar->service_period = $month_from . ' to ' . $month_to . ', ' . $year_from;

            return $scholar;
        });

        return $data;
    }
}
