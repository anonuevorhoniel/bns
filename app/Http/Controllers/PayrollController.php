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
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $page = [
            'name'      =>  'Payroll',
            'title'     =>  'Payroll Management',
            'crumb'     =>  array('Payrolls' => '/payrolls')
        ];

        $payrolls = DB::table('tbl_payrolls as p')
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
            ->leftJoin('tbl_municipalities as m', 'p.municipality_code', 'm.code')
            ->get();
        // dd($payrolls);
        return view('payrolls.index', compact('page', 'payrolls'));
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
        $volunteers = DB::table('tbl_payroll_details as pd')
            ->leftJoin('tbl_scholars as v', 'pd.volunteer_id', 'v.id')
            ->leftjoin('tbl_payrolls as py', 'pd.payroll_id', 'py.id')
            ->where('pd.payroll_id', $payroll->id)
            ->select('pd.*', 'v.*', 'py.month_from as payroll_month_from', 'py.month_to as payroll_month_to', 'py.year_from', 'py.year_to')
            ->orderBy('v.last_name', 'asc')
            ->get();

        #Payroll Details
        $rate = Rate::find($payroll->rate_id);
        $municipality = Municipality::where('code', $payroll->municipality_code)->get();
        if ($payroll->month_from == $payroll->month_to) {
            $payroll_period = DateTime::createFromFormat('!m', $payroll->month_from)->format('F') . ' 2025';
        } else {
            $payroll_period = DateTime::createFromFormat('!m', $payroll->month_from)->format('F') . ' - ' . DateTime::createFromFormat('!m', $payroll->month_to)->format('F') . ' ' . $payroll->year_from;
        }
        #Payroll Details -> signatories
        $head = Signatory::where('status', 1)
            ->where('designation_id', Signatory::HEAD)
            ->get();

        $governor = Signatory::where('status', 1)
            ->where('designation_id', Signatory::GOVERNOR)
            ->get();

        $accountant = Signatory::where('status', 1)
            ->where('designation_id', Signatory::ACCOUNTANT)
            ->get();

        #Load Template
        $reader = new Xlsx();
        $spreadsheet = $reader->load(public_path('/templates/BVW_Payroll_Template.xlsx'));
        $sheet = $spreadsheet->getActiveSheet();

        $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
        $drawing->setName('Paid');
        $drawing->setDescription('Paid');
        $drawing->setPath(public_path('/templates/audit_sticker.png')); // put your path and image here
        $drawing->setCoordinates('F42');
        $drawing->setOffsetX(200);
        $drawing->setWidth(345);
        $drawing->getShadow()->setVisible(true);
        $drawing->getShadow()->setDirection(45);
        $drawing->setWorksheet($spreadsheet->getActiveSheet());

        #Tentative Variable

        #Append Values to Sheets
        $sheet->setCellValue('I5', $payroll_period);
        $sheet->setCellValue('A8', strtoupper($municipality[0]->name) . ", LAGUNA");
        $last_page = ceil($volunteers->count() / 25);
        $volunteers = $volunteers->toArray();
        $chunks = array_chunk($volunteers, 25, true);
        $count = 1;

        $sub_total_array = [];

        foreach ($chunks as  $key => $chunk) {
            $page_number = $key + 1;
            $title = "Page $page_number of $last_page";
            $sheet = clone $spreadsheet->getSheet(0);
            $sheet->setTitle($title);
            $spreadsheet->addsheet($sheet);
            $row_start = '9';
            $subtotal = 0;

            foreach ($chunk as $key => $volunteer) {

                $full_name = $volunteer->last_name . ', ' . $volunteer->first_name . ' ' . $volunteer->middle_name . ' ' . $volunteer->name_extension;
                // dd($volunteer->month_to);
                if ($volunteer->payroll_month_from == $volunteer->payroll_month_to) {
                    $service_period = DateTime::createFromFormat('!m', $volunteer->payroll_month_from)->format('F') . ' ' . $volunteer->year_from;
                } else {
                    $service_period = DateTime::createFromFormat('!m', $volunteer->payroll_month_from)->format('F') . ' - ' . DateTime::createFromFormat('!m', $volunteer->payroll_month_to)->format('F') . ", " . $volunteer->year_from;
                }
                $rate_final = number_format($rate->rate, 2);
                $sheet->setCellValue('J1', $title);
                $sheet->setCellValue('A' . $row_start, $count);
                $sheet->setCellValue('B' . $row_start, strtoupper($full_name));
                $sheet->setCellValue('C' . $row_start, $service_period);
                $sheet->setCellValue('D' . $row_start, $rate_final);
                $sheet->setCellValue('E' . $row_start, $volunteer->total);

                $subtotal += $volunteer->total;
                $row_start++;
                $count++;

                // $sheet->setCellValue('A'.$row_start, '***Nothing Follows***');
                $sheet->setCellValue('E36', $subtotal);
                if ($page_number == $last_page) {
                    $sheet->setCellValue('E37', $payroll->grand_total);
                    $sheet->setCellValue('B37', "TOTAL");
                }

                $sheet->setCellValue('B36', "SUB-TOTAL $page_number");
                $sheet->setCellValue('A43', $head[0]->name);
                $sheet->setCellValue('A44', $head[0]->description);
                $sheet->setCellValue('D43', $governor[0]->name);
                $sheet->setCellValue('D44', $governor[0]->description);
                // $sheet->setCellValue('A50', $accountant[0]->name);
                // $sheet->setCellValue('A51', $accountant[0]->description);

                $styleArray = array(
                    'borders' => array(
                        'outline' => array(
                            'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            'color' => array('argb' => '#000000'),
                        ),
                    ),
                );
                $sheet->getStyle('A' . $row_start - 1)->applyFromArray($styleArray);
                $sub_total_array[$key] = $subtotal;
            }

            unset($sheet);
        }

        $spreadsheet->removeSheetByIndex(0); //template
        $spreadsheet->setActiveSheetIndex(0);

        /* Setting of workbook properties */
        $spreadsheet->getProperties()
            ->setTitle('BNS: SYSTEM GENERATED REPORT')
            ->setSubject('BNS: SYSTEM GENERATED REPORT')
            ->setKeywords('PAYROLL') //Tags
            ->setCategory('BNS Report')
            ->setDescription('This is a system generated report.') //Comment
            ->setCreator('Barangay Nutritional Scholar System') //Author
            ->setLastModifiedBy('Developer - Rhoniel L. Añonuevo');
        $filename = $municipality[0]->name . ' Payroll - '
            //  .$quarter->quarter.' ( '.$payroll_period.')'
        ;

        /* Remove the template sheet and 
         * set first sheet as active sheet
         */
        // $spreadsheet->removeSheetByIndex(0); //template
        // $spreadsheet->setActiveSheetIndex(0);

        /* Redirect output to a client's web browser (Xlsx) 
         */
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $filename . '.xlsx"');
        header('Cache-Control: max-age=0');

        /* NOTE: If you're serving to IE 9, then the 
         * following may be needed 
         */
        header('Cache-Control: max-age=1');

        /* NOTE: If you're serving to IE over SSL, then the 
         * following may be needed 
         */
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // Date modified
        header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
        header('Pragma: public');  // HTTP/1.0

        /* Download/Export as xlsx */
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save('php://output');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'rate_id' => 'required'
        ]);
        // Validate that volunteers are selected
        if (empty($request->volunteers)) {
            // If no volunteers are selected, redirect back with an error message
            return back()->withErrors('Minimum of one Scholar selected is required');
        }

        #Get latest rate.
        #Get active Signatories.
        DB::beginTransaction();
        try {
            // dd($request->month_from, $request->month_to);
            $payroll_period_months = range($request->month_from, $request->month_to);
            // $rates = Rate::whereIn('month', $payroll_period_months)
            //     ->where('year', date('Y'))
            //     ->orderBy('month', 'asc')
            //     ->get();
            // // dd($rates);

            // if ($rates->count() == 0) {
            //     $rate_id = Rate::max('id');
            //     $rate = Rate::find($rate_id);
            // } else if ($rates->count() == 1) {
            //     $rate = $rates[0];
            // } else {
            //     return back()->withErrors("You are trying to generate a payroll with more than one rate setting");
            // }
            $rate_id = $request->rate_id;
            $rate = Rate::find($rate_id);

            $signatories = Signatory::where('status', 1)->get();
            $count_months = 1;

            foreach ($signatories as $key => $value) {
                $signatory[] = $value->id;
            }

            $payroll = new Payroll;
            $payroll->rate_id = $rate->id;
            // $payroll->quarter_id = Quarter::isActive();
            $payroll->month_from = $request->month_from;
            $payroll->month_to = $request->month_to;
            $payroll->year_from = $request->year_from;
            $payroll->year_to = $request->year_to;
            $payroll->signatories = json_encode($signatory);
            $payroll->municipality_code = $request->municipality_code;
            $payroll->fund = $request->fund;
            $payroll->save();

            AuditTrail::createTrail("Create Payroll", $payroll);
            $try = array();
            $total_request_volunteers = array_chunk($request->volunteers, 100);

            foreach ($total_request_volunteers[0] as $volunteer_id) {
                #Get Service Period Range
                #vmf - volunteer_month_from
                #vmt = volunteer_month_to

                $vmf = ServicePeriod::where('volunteer_id', $volunteer_id)
                    ->where('year_from', Quarter::currentYear())
                    ->min('month_from');
                // dd($vmf);

                $present = ServicePeriod::where('status', 'present')
                    ->where('volunteer_id', $volunteer_id)->get();
                // dd($present);
                if ($present->count() > 0) {
                    $vmt = $request->month_to;
                    //if more than one na may to present
                } else {
                    $vmt = ServicePeriod::where('volunteer_id', $volunteer_id)
                        ->where('year_to', Quarter::currentYear())
                        ->max('month_to');
                    // dd($vmt);
                }
                $parameters = array(
                    "volunteer_id" => $volunteer_id,
                    "from" => Carbon::now()->year . '-' . $request->month_from,
                    "to" => Carbon::now()->year . '-' . $request->month_to,
                );

                $service_period = Volunteer::getServicePeriodPerRange($parameters);
                $valid_periods = array_intersect($payroll_period_months, $service_period);
                $count_months = count($valid_periods);
                // dd($count_months);
                $payroll_detail = "false";
                $try[] = $valid_periods;
                if ($count_months > 0) {
                    $payroll_detail = new PayrollDetails;
                    $payroll_detail->volunteer_id = $volunteer_id;
                    $payroll_detail->payroll_id = $payroll->id;
                    $payroll_detail->month_from = intval($request->month_from);
                    $payroll_detail->month_to = intval($request->month_to);
                    $payroll_detail->total = $rate->rate * $count_months;
                    $payroll_detail->save();
                }

                AuditTrail::createTrail("Create Payroll", $payroll_detail);
            }
            // dd($count);

            $grand_total = PayrollDetails::where('payroll_id', $payroll->id)->sum('total');
            $update_payroll = Payroll::where('id', $payroll->id)
                ->update(['grand_total' => $grand_total]);

            DB::commit();
            return redirect('/payrolls/' . $payroll->id)->with('success', 'A new payroll has been added.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Payroll  $payroll
     * @return \Illuminate\Http\Response
     */
    public function show(Payroll $payroll)
    {

        $page = [
            'name'      =>  'Payroll',
            'title'     =>  'Payroll Management',
            'crumb'     =>  array('Payrolls' => '/payrolls', 'Details' => '')
        ];

        $volunteers = DB::table('tbl_payroll_details as pd')
            ->leftJoin('tbl_scholars as v', 'pd.volunteer_id', 'v.id')
            ->leftjoin('tbl_barangays as b', 'b.code', 'v.barangay_id')
            ->join('tbl_municipalities as m', 'm.code', 'v.citymuni_id')
            ->where('pd.payroll_id', $payroll->id)
            ->orderBy('v.last_name')
            ->select('v.*', 'b.name as barangay_name', 'm.name as municity_name',)
            ->get();

        $rate = Rate::find($payroll->rate_id);
        $signatories = Signatory::whereIn('id', json_decode($payroll->signatories))->get();

        $heads = Signatory::where('designation_id', Signatory::HEAD)->get();
        $administrators = Signatory::where('designation_id', Signatory::ADMINISTRATOR)->get();
        $governors = Signatory::where('designation_id', Signatory::GOVERNOR)->get();
        $accountants = Signatory::where('designation_id', Signatory::ACCOUNTANT)->get();
        $months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');


        $volunteers->map(function ($scholar) use ($months) {
            $service_period = DB::table('tbl_service_periods')
                ->where('volunteer_id', $scholar->id)
                ->orderBy('year_from', 'desc')
                ->orderBy('month_from', 'desc')
                ->first();

            $month_from = $months[intval($service_period->month_from) - 1];
            $year_from = $service_period->year_from;
            $month_to = $service_period->month_to != 0 ? $months[intval($service_period->month_to) - 1] : 'Present';
            $scholar->service_period = $month_from . ' to ' . $month_to . ', ' . $year_from;
            return $scholar;
        });
        // dd($volunteers);

        $month_from   = DateTime::createFromFormat('!m', $payroll->month_from)->format('F'); // March
        $month_to   = DateTime::createFromFormat('!m', $payroll->month_to)->format('F');
        $year = Quarter::currentYear();
        $municipality = Municipality::where('code', $payroll->municipality_code)->get();
        // dd($payroll);
        return view('payrolls.show', compact(
            'page',
            'volunteers',
            'rate',
            'payroll',
            'month_from',
            'month_to',
            'year',
            'municipality',
            'signatories',
            'heads',
            'administrators',
            'governors',
            'accountants'
        ));
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
    public function masterlist_payroll_download($id, Request $request)
    {
        $months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

        Payroll::findOrFail($id);
        $payrolls = DB::table('tbl_payrolls')->where('id', $id)->first();

        $municipality = DB::table('tbl_municipalities')->where('code', $payrolls->municipality_code)->first();
        $templatePath = public_path('templates/BNS_Masterlist_Payroll_Template.xlsx');
        $filePath = public_path('templates/BNS_Masterlist_Payroll.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $activeWorksheet = $spreadsheet->getActiveSheet();

        $scholars =
            DB::table('tbl_payrolls as p')->where('p.id', $id)
            ->leftJoin('tbl_payroll_details as pd', 'pd.payroll_id', 'p.id')
            ->leftJoin('tbl_scholars as sc', 'sc.id', 'pd.volunteer_id')
            ->leftjoin('tbl_service_periods', function ($query) {
                $query->on('tbl_service_periods.volunteer_id', '=', 'sc.id')
                    ->on('tbl_service_periods.id', '=', DB::raw('(SELECT MAX(id) FROM tbl_service_periods WHERE tbl_service_periods.volunteer_id = sc.id)'));
            })
            ->leftjoin('tbl_barangays as b', 'b.code', 'sc.barangay_id')
            // ->where('sc.status', 'like', "$request->fund%")
            ->where('citymuni_id', $municipality->code)
            ->where(function ($q) use ($payrolls) {
                $q->where('tbl_service_periods.year_from', $payrolls->year_from)
                    ->orWhere('tbl_service_periods.year_from', '<', $payrolls->year_from);
            })
            ->select(DB::raw('CONCAT(sc.last_name, ", " , sc.first_name, " ", COALESCE(SUBSTRING(sc.middle_name, 1, 1), ""), ". ") AS full_name'), 'b.name as barangay_name', 'sc.last_name')
            ->orderByRaw('TRIM(sc.last_name) ASC')
            ->get();

        if ($scholars->count() == 0) {
            return redirect()->back()->withErrors('No Scholars For ' .  $municipality->name . ' in year ' . $request->masterlist_payroll_year);
        }

        $activeWorksheet->setCellValue('A1', 'MASTERLIST OF BNS FOR ' . strtoupper($months[intVal($payrolls->month_from) - 1]) . ' TO ' . strtoupper($months[intVal($payrolls->month_to) - 1]) . ', ' . $payrolls->year_from);
        $activeWorksheet->setCellValue('A2', strtoupper($municipality->name) . ', LAGUNA');
        $current_no = 1;

        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'], // Black border color
                ],
            ],
        ];

        #Append Values to Sheets
        $last_page = ceil($scholars->count() / 25);
        $scholars = $scholars->toArray();
        $chunks = array_chunk($scholars, 25, true);
        $count = 1;

        $sub_total_array = [];

        foreach ($chunks as  $key => $chunk) {
            $page_number = $key + 1;
            $title = "Page $page_number of $last_page";
            $activeWorksheet = clone $spreadsheet->getSheet(0);
            $activeWorksheet->setTitle($title);
            $spreadsheet->addsheet($activeWorksheet);
            $cellrow = 6;

            foreach ($chunk as $key => $scholar) {
                $activeWorksheet->setCellValue('A' . $cellrow, $current_no);
                $activeWorksheet->setCellValue('B' . $cellrow, strtoupper($scholar->full_name));
                $activeWorksheet->setCellValue('C' . $cellrow, $scholar->barangay_name);

                $activeWorksheet->getStyle('A' . $cellrow . ':C' . $cellrow)->applyFromArray($styleArray);
                $cellrow++;
                $current_no++;
            }

            $signatories = DB::table('tbl_signatories')->get();
            $action_officer_name = $signatories->where('status', 1)->where('designation_id', 1)->first()->name;
            $action_officer_position = $signatories->where('status', 1)->where('designation_id', 1)->first()->description;
            $chairman_name = $signatories->where('status', 1)->where('designation_id', 5)->first();

            if (!$chairman_name) {
                return redirect()->back()->withErrors('Missing Provincial Nutrition Action Officer Signatory');
            }
            // dd($scholars);
            $certified_correct = 'A' . $cellrow + 2;
            $certified_correct2 = 'B' . $cellrow + 2;
            $certified_correct3 = 'A' . $cellrow + 6;
            $certified_correct4 = 'B' . $cellrow + 6;
            $certified_correct5 = 'A' . $cellrow + 7;
            $certified_correct6 = 'B' . $cellrow + 7;

            $noted_by = 'C' . $cellrow + 2;
            $noted_by2 = 'C' . $cellrow + 6;
            $noted_by3 = 'C' . $cellrow + 7;
            // $noted_by2 = 'B' . $cellrow + 2;

            //all merge
            $activeWorksheet->mergeCells("$certified_correct:$certified_correct2");
            $activeWorksheet->mergeCells("$certified_correct3:$certified_correct4");
            $activeWorksheet->mergeCells("$certified_correct5:$certified_correct6");

            //all set
            $activeWorksheet->setCellValue($certified_correct, 'Certified Correct:');
            $activeWorksheet->setCellValue($certified_correct3, $action_officer_name);
            $activeWorksheet->setCellValue($certified_correct5, $action_officer_position);

            $activeWorksheet->setCellValue($noted_by, 'Noted by:');
            $activeWorksheet->setCellValue($noted_by2, $chairman_name->name);
            $activeWorksheet->setCellValue($noted_by3, $chairman_name->description);

            //all style
            $activeWorksheet->getStyle($certified_correct)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $activeWorksheet->getStyle($certified_correct3)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $activeWorksheet->getStyle($certified_correct5)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

            $activeWorksheet->getStyle($noted_by)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $activeWorksheet->getStyle($noted_by2)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            $activeWorksheet->getStyle($noted_by3)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

            $activeWorksheet->getStyle($noted_by2)->getFont()->setBold(true);
            $activeWorksheet->getStyle($certified_correct3)->getFont()->setBold(true);
            $activeWorksheet->getStyle('A1')->getFont()->setBold(true);
            $activeWorksheet->getStyle('A2')->getFont()->setBold(true);
            $activeWorksheet->getStyle('A3')->getFont()->setBold(true);
            $activeWorksheet->getStyle('B3')->getFont()->setBold(true);
            $activeWorksheet->getStyle('C3')->getFont()->setBold(true);

            $activeWorksheet->setCellValue("C4", $title);
            unset($sheet);

            $count++;
        }
        $spreadsheet->removeSheetByIndex(0); //template
        $spreadsheet->setActiveSheetIndex(0);

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $activeWorksheet->getPageSetup()->setScale(83); // Adjust the scale to your preference, e.g., 85%
        $activeWorksheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_PORTRAIT);

        $writer->save($filePath);

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
