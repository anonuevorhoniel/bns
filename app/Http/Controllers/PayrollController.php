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
use App\Models\Signatories;
use App\Services\Payrolls\PayrollDownloadService;
use App\Services\Payrolls\PayrollMasterlistService;
use App\Services\Payrolls\PayrollShowService;
use App\Services\Payrolls\PayrollStoreService;
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
    protected $storeService;
    protected $downloadService;
    protected $masterlistService;
    public function __construct(
        PayrollShowService $showService,
        PayrollDownloadService $downloadService,
        PayrollMasterlistService $masterlistService,
        PayrollStoreService $storeService
    ) {
        $this->showService = $showService;
        $this->downloadService = $downloadService;
        $this->masterlistService = $masterlistService;
        $this->storeService = $storeService;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $status = $request->status;
        $municipality_code = $user->assigned_muni_code;
        $classification = $user->classification;
        $base = DB::table('tbl_payrolls as p')
            ->select(
                'p.id as id',
                'p.month_from',
                'p.month_to',
                'p.created_at',
                'p.year_from',
                'p.year_to',
                'm.name',
                'm.code',
                'm.id as municity_id',
                'p.fund',
                'r.rate as rate'
            )
            ->leftJoin('tbl_municipalities as m', 'p.municipality_code', 'm.code')
            ->leftJoin('tbl_rates as r', 'r.id', 'p.rate_id')
            ->when($classification == "Encoder", function ($query) use ($municipality_code) {
                $query->where(function ($query) use ($municipality_code) {
                    $query->where('m.code', $municipality_code)
                    ->where('p.fund', 'Municipal');
                });
            });
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
    public function create() {}


    public function download(Payroll $payroll)
    {
        if ($payroll->status == 0) {
            return response()->json(['message' => 'Payroll not approved'], 422);
        }
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
        $user = Auth::user();
        $municipality_code = $request->municipality_code;
            $scholars = $request->scholars;

        if (empty($scholars)) {
            return response()->json(['message' => 'Minimum of one Scholar selected is required'], 422);
        }

        if ($user->classification == "Encoder") {
            if ($user->assigned_muni_code != $municipality_code) {
                return response()->json(['message' => "DO NOT TAMPER WITH THE PAYLOAD!"], 422);
            }
        }

        DB::beginTransaction();
        try {
            $this->storeService->main($request, $user);
            DB::commit();
            return response()->json(['message' => 'Payroll Created']);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 422);
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
        if ($payroll->status == 0) {
            return response()->json(['message' => 'Unauthorized'], 422);
        }
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

    public function approve(Payroll $payroll)
    {
        $classification = Auth::user()->classification;
        if ($classification !== "System Administrator") {
            return response()->json(['message' => 'DO NOT TAMPER WITH THE SYSTEM'], 422);
        }
        try {
            $payroll->update([
                'status' => 1
            ]);
            return response()->json(['message' => 'Payroll Approved']);
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 422);
        }
    }
}
