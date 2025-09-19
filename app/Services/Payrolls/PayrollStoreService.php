<?php

namespace App\Services\Payrolls;

use Carbon\Carbon;
use App\Models\Rate;
use App\Models\Payroll;
use App\Models\AuditTrail;
use App\Models\ServicePeriod;
use App\Models\PayrollDetails;
use App\Models\Scholar;
use App\Models\Signatories;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class PayrollStoreService
{
    public function main($request, $user)
    {

        $scholars = $request->scholars;

        $month_from = date('m', strtotime($request->from));
        $month_to = date('m', strtotime($request->to));
        $rate = $request->rate;
        $rate  = $rate != null ? Rate::find($rate) : null;
        $municipality_code = $request->municipality_code;
        $payroll_period_months = range($month_from, $month_to);
        $signatories = Signatories::where('status', 1)->get();

        foreach ($signatories as $key => $value) {
            $signatory[] = $value->id;
        }

        $payroll = $this->payrollStore($rate, $request, $month_from, $month_to, $signatory, $municipality_code, $user);
        $this->handleRequestScholar($scholars, $month_from, $month_to, $payroll, $rate, $payroll_period_months, $user, $request);
        $this->updateGrandTotal($payroll);
        AuditTrail::createTrail("Create Payroll", $payroll);
    }

    private function handleRequestScholar($scholars, $month_from, $month_to, $payroll, $rate, $payroll_period_months, $user, $request)
    {
        $total_request_scholars = array_chunk($scholars, 100);
        foreach ($total_request_scholars[0] as $scholar_id) {
            $parameters = array(
                "scholar_id" => $scholar_id,
                "from" => Carbon::now()->year . '-' . $month_from,
                "to" => Carbon::now()->year . '-' . $month_to,
            );
            $service_period = Scholar::getServicePeriodPerRange($parameters);
            $valid_periods = array_intersect($payroll_period_months, $service_period);
            $count_months = count($valid_periods);
            $rate = $this->getScholarRate($scholar_id, $user, $request, $rate);
            $this->payrollDetailStore($month_from, $month_to, $scholar_id, $payroll, $rate, $count_months);
            $payroll_detail = "false";
            $try[] = $valid_periods;

            AuditTrail::createTrail("Create Payroll", $payroll_detail);
        }
    }

    private function getScholarRate($scholar_id, $user, $request, $rate)
    {
        $fund = $request->fund;
        if ($fund == "NNC" && $user->classification == 'System Administrator') {
            return $rate->rate;
        }
        if ($fund == "Province" && $user->classification == 'System Administrator') {
            $rate = Scholar::find($scholar_id)->incentive_prov;
            $rate = $rate ?? 0;
        } else if ($user->classification  == "Encoder") {
            $rate = Scholar::find($scholar_id)->incentive_mun;
            $rate = $rate ?? 0;
        } else {
            $rate = 0;
        }

        return $rate;
    }

    private function payrollStore($rate, $request, $month_from, $month_to, $signatory, $municipality_code,  $user)
    {
        $fund = $request->fund;
        $year_from = date('Y', strtotime($request->from));
        $year_to = date('Y', strtotime($request->to));
        $year_from = date('Y', strtotime($request->from));
        $year_to = date('Y', strtotime($request->to));

        $payroll = new Payroll;
        $payroll->rate_id = $request->fund == "NNC" ? $rate->id : null;
        $payroll->month_from = $month_from;
        $payroll->month_to = $month_to;
        $payroll->year_from = $year_from;
        $payroll->year_to = $year_to;
        $payroll->signatories = json_encode($signatory);
        $payroll->municipality_code = $municipality_code;

        if ($user->classification == "System Administrator") {
            $payroll->fund = $fund;
            $payroll->status = 1;
        } else {
            $payroll->fund = "Municipal";
        }
        $payroll->save();

        return $payroll;
    }

    private function payrollDetailStore($month_from, $month_to, $scholar_id, $payroll, $rate, $count_months)
    {
        if ($count_months > 0) {
            $payroll_detail = new PayrollDetails;
            $payroll_detail->scholar_id = $scholar_id;
            $payroll_detail->payroll_id = $payroll->id;
            $payroll_detail->month_from = intval($month_from);
            $payroll_detail->month_to = intval($month_to);
            $payroll_detail->total = $rate * $count_months;
            $payroll_detail->save();
        }
    }

    private function updateGrandTotal($payroll)
    {
        $grand_total = PayrollDetails::where('payroll_id', $payroll->id)->sum('total');
        Payroll::where('id', $payroll->id)
            ->update(['grand_total' => $grand_total]);
    }
}
