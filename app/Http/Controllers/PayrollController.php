<?php

namespace App\Http\Controllers;

use DateTime;
use Carbon\Carbon;
use App\Models\Rate;
use App\Models\Payroll;
use App\Models\Quarter;
use App\Models\Signatory;
use App\Models\Volunteer;
use App\Models\AuditTrail;
use App\Models\Municipality;
use Illuminate\Http\Request;
use App\Models\ServicePeriod;
use App\Models\PayrollDetails;
use App\Models\Scholar;
use App\Services\Payrolls\PayrollDownloadService;
use App\Services\Payrolls\PayrollMasterlistService;
use App\Services\Payrolls\PayrollShowService;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class PayrollController extends Controller
{
    protected $showService;
    protected $downloadService;
    protected $masterlistService;
    public function __construct(PayrollShowService $showService, PayrollDownloadService $downloadService, PayrollMasterlistService $masterlistService)
    {
        $this->showService = $showService;
        $this->downloadService = $downloadService;
        $this->masterlistService = $masterlistService;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $base = DB::table('tbl_payrolls as p')
            ->select(
                'p.id as id',
                'p.month_from',
                'p.month_to',
                'p.created_at',
                'p.year_from',
                'p.year_to',
                'm.name',
                'm.id as municity_id',
                'p.fund'
            )
            ->leftJoin('tbl_municipalities as m', 'p.municipality_code', 'm.code');
        $pagination = pagination($request, $base);
        $payrolls  = $base
            ->limit($pagination['limit'])
            ->offset($pagination['offset'])
            ->orderBy('p.created_at', 'desc')
            ->get();

        $payrolls->map(function ($p) {
            $from = "$p->year_from-$p->month_from";
            $to = "$p->year_to-$p->month_to";
            $p->period_cover = date('F Y', strtotime($from)) . " - " . date('F Y', strtotime($to));
            $p->diff_time = Carbon::parse($p->created_at)->diffForHumans();
            $p->created_at = date('F j, Y | h:i A', strtotime($p->created_at));
        });
        $pagination = pageInfo($pagination, $payrolls->count());
        return response()->json(compact('payrolls', 'pagination'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

        $page = [
            'name'      =>  'Payroll',
            'title'     =>  'Payroll Management',
            'crumb'     =>  array('Payrolls' => '/payrolls', 'Create' => '')
        ];

        $rates = Rate::all();
        if ($rates->count() > 0) {
            $municipalities = Municipality::assignments();
            return view('payrolls.create', compact('page', 'municipalities', "rates"));
        } else {
            return back()->withErrors('No Active Rate! Go to "Settings" > "Rates" and set active rate.');
        }
    }


    public function download(Payroll $payroll)
    {
        $filePath = public_path('/templates/Payroll.xlsx');
        $this->downloadService->main($payroll, $filePath);
        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'rate' => 'required'
        ]);

        $scholars = $request->scholars;
        // Validate that volunteers are selected
        if (empty($scholars)) {
            // If no volunteers are selected, redirect back with an error message
            return back()->withErrors('Minimum of one Scholar selected is required');
        }

        $month_from = date('m', strtotime($request->from));
        $month_to = date('m', strtotime($request->to));
        $year_from = date('Y', strtotime($request->from));
        $year_to = date('Y', strtotime($request->to));
        $rate = $request->rate;
        $fund = $request->fund;
        $municipality_code = $request->municipality_code;

        #Get latest rate.
        #Get active Signatories.
        DB::beginTransaction();
        try {
            $payroll_period_months = range($month_from, $month_to);
            $rate_id = $rate;
            $rate = Rate::find($rate_id);

            $signatories = Signatory::where('status', 1)->get();
            $count_months = 1;

            foreach ($signatories as $key => $value) {
                $signatory[] = $value->id;
            }

            $payroll = new Payroll;
            $payroll->rate_id = $rate->id;
            $payroll->month_from = $month_from;
            $payroll->month_to = $month_to;
            $payroll->year_from = $year_from;
            $payroll->year_to = $year_to;
            $payroll->signatories = json_encode($signatory);
            $payroll->municipality_code = $municipality_code;
            $payroll->fund = $fund;
            $payroll->save();

            AuditTrail::createTrail("Create Payroll", $payroll);
            $try = array();
            $total_request_volunteers = array_chunk($scholars, 100);

            foreach ($total_request_volunteers[0] as $scholar_id) {
                #Get Service Period Range
                #vmf - volunteer_month_from
                #vmt = volunteer_month_to

                $vmf = ServicePeriod::where('scholar_id', $scholar_id)
                    ->where('year_from', Quarter::currentYear())
                    ->min('month_from');

                $present = ServicePeriod::where('status', 'present')
                    ->where('scholar_id', $scholar_id)->get();

                if ($present->count() > 0) {
                    $vmt = $request->month_to;
                } else {
                    $vmt = ServicePeriod::where('scholar_id', $scholar_id)
                        ->where('year_to', Quarter::currentYear())
                        ->max('month_to');
                }
                $parameters = array(
                    "scholar_id" => $scholar_id,
                    "from" => Carbon::now()->year . '-' . $month_from,
                    "to" => Carbon::now()->year . '-' . $month_to,
                );

                $service_period = Volunteer::getServicePeriodPerRange($parameters);
                $valid_periods = array_intersect($payroll_period_months, $service_period);
                $count_months = count($valid_periods);
                $payroll_detail = "false";
                $try[] = $valid_periods;
                if ($count_months > 0) {
                    $payroll_detail = new PayrollDetails;
                    $payroll_detail->scholar_id = $scholar_id;
                    $payroll_detail->payroll_id = $payroll->id;
                    $payroll_detail->month_from = intval($month_from);
                    $payroll_detail->month_to = intval($month_to);
                    $payroll_detail->total = $rate->rate * $count_months;
                    $payroll_detail->save();
                }

                AuditTrail::createTrail("Create Payroll", $payroll_detail);
            }
            $grand_total = PayrollDetails::where('payroll_id', $payroll->id)->sum('total');
            Payroll::where('id', $payroll->id)
                ->update(['grand_total' => $grand_total]);

            DB::commit();
            return response()->json(['success' => 'A new payroll has been added.']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw new Exception($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Payroll  $payroll
     * @return \Illuminate\Http\Response
     */
    public function show(Payroll $payroll, Request $request)
    {
        $data = $this->showService->main($request, $payroll);
        return response()->json($data);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Payroll  $payroll
     * @return \Illuminate\Http\Response
     */
    public function edit(Payroll $payroll)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Payroll  $payroll
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Payroll $payroll)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Payroll  $payroll
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payroll $payroll)
    {
        //
    }


    public function updateSignatories(Request $request)
    {
        DB::beginTransaction();
        try {

            $update = Payroll::where('id', $request->payroll_id)
                ->update([
                    'signatories' => json_encode($request->signatory)
                ]);


            DB::commit();
            AuditTrail::createTrail("Update payroll.", $request);
            return back()->withSuccess("Payroll signatories successfully updated!");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }
    public function masterlist_download(Payroll $payroll, Request $request)
    {
        $filePath = public_path('templates/BNS_Masterlist_Payroll.xlsx');
        $this->masterlistService->main($payroll, $request, $filePath);
        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    public function summary(Request $request)
    {
        //requests
        // dd($request->all());
        $request->validate([
            'month_from' => 'required',
            'month_to' => 'required',
            'fund' => 'required',
        ]);
        $month_from = intval(substr($request->month_from, -2, 5));
        $month_to = intval(substr($request->month_to, -2, 5));
        $month_from_full = date('F', strtotime($request->month_from));
        $month_to_full = date('F', strtotime($request->month_to));
        // $range = range($month_from, $month_to);
        // dd($range); 
        $year = substr($request->month_from, 0, 4);
        $rate = DB::table('tbl_rates')->where('year', $year)->get();
        $latest_month_rate = $rate->max('month');
        $latest_rate = $rate->where('month', $latest_month_rate)->first();
        $final_rate = intval($latest_rate->rate);

        $certified_correct_signatory = DB::table('tbl_signatories')->where('designation_id', 1)->where('status', 1)->first();
        $certified_correct_signatory2 = DB::table('tbl_signatories')->where('designation_id', 4)->where('status', 1)->first();

        $months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

        $municipalities = DB::table('tbl_municipalities')->get();
        $templatePath = public_path('templates/BNS_Summary_of_Payroll.xlsx');
        $filePath = public_path('templates/Summary_Payroll.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $activeWorksheet = $spreadsheet->getActiveSheet();
        $activeWorksheet->setCellValue('D7', 'Period : ' . strtoupper($months[intval($month_from) - 1]) . ' TO ' .  strtoupper($months[intval($month_to) - 1]) . ', ' . $year);

        $cellrow = 10;
        $current_no = 1;
        $total_count_scholar = 0;
        $total_amount_scholar = 0.00;

        $activeWorksheet->setCellValue('F7', "$month_from_full - $month_to_full $year");

        foreach ($municipalities as $key => $mun) {
            $total_scholar = 0;
            $total_amount = 0.00;

            $total_bns =
                DB::table('tbl_payrolls as p')
                ->leftjoin('tbl_payroll_details as pd', 'pd.payroll_id', 'p.id')
                ->where('p.municipality_code', $mun->code)
                ->where('p.year_from', $year)
                ->where('p.month_from', $month_from)
                ->where('p.month_to', $month_to)
                ->where('p.fund', 'like', "$request->fund%")
                ->get();
            // dd($total_bns, $month_from, $month_to, $year);
            $total_scholar = $total_bns->count();
            $total_count_scholar += $total_bns->count();
            $total_amount += $total_bns->sum('total');
            $total_amount_scholar += $total_bns->sum('total');
            $final_total_amount = number_format($total_amount, 2);
            $total_amount_scholar_final = number_format(intval($total_amount_scholar), 2);
            $activeWorksheet->setCellValue('A' . $cellrow, $current_no);
            $activeWorksheet->setCellValue('B' . $cellrow, strtoupper($mun->name));
            $activeWorksheet->setCellValue('C' . $cellrow, $total_scholar);
            $activeWorksheet->setCellValue('D' . $cellrow, $final_total_amount);
            $activeWorksheet->setCellValue('E' . $cellrow, $final_total_amount);
            $activeWorksheet->setCellValue('A45', Auth::user()->name);
            $activeWorksheet->setCellValue('A46', Auth::user()->position);
            $activeWorksheet->setCellValue('C42', $total_count_scholar);
            $activeWorksheet->setCellValue('D42', $total_amount_scholar_final);
            $activeWorksheet->setCellValue('D42', $total_amount_scholar_final);
            $activeWorksheet->setCellValue('E42', $total_amount_scholar_final);
            $activeWorksheet->setCellValue('E45',  $certified_correct_signatory->name);
            $activeWorksheet->setCellValue('E46',  $certified_correct_signatory->description);
            $activeWorksheet->setCellValue('F51',  $certified_correct_signatory2->name);
            $activeWorksheet->setCellValue('F52',  $certified_correct_signatory2->description);

            $cellrow++;
            $current_no++;
        }
        // dd($total_count_scholar);
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $activeWorksheet->getPageSetup()->setScale(90);
        $activeWorksheet->getPageSetup()->setPrintArea('A1:F52');
        $activeWorksheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_PORTRAIT);

        $writer->save($filePath);

        return response()->download($filePath)->deleteFileAfterSend(true);
    }
}
