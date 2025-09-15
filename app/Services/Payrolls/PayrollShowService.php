<?php

namespace App\Services\Payrolls;

use App\Models\Eligibility;
use DateTime;
use App\Models\Rate;
use App\Models\Quarter;
use App\Models\Signatory;

use App\Models\Municipality;
use App\Models\Scholar;
use App\Models\ScholarTraining;
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
            ->take($pagination['limit'])
            ->skip($pagination['offset'])
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
        $data = Scholar::select('*', DB::raw("CONCAT(first_name, ' ', last_name) as full_name"))
            ->with(['barangay', 'municipality', 'servicePeriods', 'payrollDetails'])
            ->whereHas('payrollDetails', function ($query) use ($payroll) {
                $query->where('payroll_id', $payroll->id);
            });

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
            $scholar->eligibilities = Eligibility::where('scholar_id', $scholar->id)->get();
            $scholar->trainings = ScholarTraining::where('scholar_id', $scholar->id)->get();

            return $scholar;
        });

        return $data;
    }
}
