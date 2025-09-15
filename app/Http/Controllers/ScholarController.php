<?php

namespace App\Http\Controllers;

use File;
use Exception;
use Carbon\Carbon;
use App\Models\Fund;
use App\Models\User;
use App\Models\Scholar;
use App\Models\Barangay;
use App\Models\District;
use App\Models\Volunteer;
use App\Models\AuditTrail;
use App\Models\Eligibility;
use Illuminate\Http\Request;
use App\Models\Classification;
use App\Models\ScholarTraining;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Models\EducationalAttainment;
use App\Services\Scholars\Download\ScholarDirectoryDownloadService;
use App\Services\Scholars\Download\ScholarMasterlistService;
use App\Services\Scholars\ScholarIndexService;
use App\Services\Scholars\ScholarStoreService;
use App\Services\Scholars\ScholarUpdateService;
use Illuminate\Validation\ValidationException;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class ScholarController extends Controller
{
    protected $indexService;
    protected $storeService;
    protected $updateService;
    protected $directoryDownloadService;
    protected $masterlistService;
    public function __construct(
        ScholarIndexService $indexService,
        ScholarStoreService $storeService,
        ScholarUpdateService $updateService,
        ScholarDirectoryDownloadService $directoryDownloadService,
        ScholarMasterlistService $masterlistService,
    ) {
        $this->indexService = $indexService;
        $this->storeService = $storeService;
        $this->updateService = $updateService;
        $this->directoryDownloadService = $directoryDownloadService;
        $this->masterlistService = $masterlistService;
    }
    public function index(Request $request)
    {
        $data = $this->indexService->main($request);
        return response()->json($data);
    }

    public function create()
    {
        $districts = District::all();
        $funds = Fund::all();
        $educ_attain = EducationalAttainment::all();
        $class = Classification::all();
        $muni_scholars = DB::table('tbl_scholars')
            ->select('tbl_scholars.id', DB::raw("CONCAT(tbl_scholars.first_name, ' ', COALESCE(tbl_scholars.middle_name, ''), ' ', tbl_scholars.last_name) as full_name"))
            ->get();
        return response()->json(compact('districts', 'funds', 'educ_attain', 'class', 'muni_scholars'));
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        $replaced_scholar_id = $request->replaced_scholar_id;
        $eligibilities = $request->eligibilities;
        $trainings = $request->trainings;

        $request->validate([
            'first_name' => 'required',
            'citymuni_id' => 'required',
            'district_id' => 'required',
            'barangay_id' => 'required|exists:tbl_barangays,code',
        ]);

        if ($request->status == 'REP') {
            $request->validate([
                'replaced_scholar_id' => 'required',
                'replacement_date' => 'required'
            ]);
        }

        $placeOfAssignment = $this->storeService->placeOfAssignment($request);
        if ($placeOfAssignment == null) {
            return response()->json(['message' => 'Barangay Error'], 422);
        }

        DB::beginTransaction();
        try {
            $scholar = $this->storeService->storeScholar($request);
            $trainings && $this->storeService->trainingStore($trainings, $scholar);
            $request->first_employment_date != null &&  $this->storeService->servicePeriodStore($scholar, $request);
            ($eligibilities && count($eligibilities) > 0) &&  $this->storeService->eligibilityStore($eligibilities, $scholar);
            $replaced_scholar_id && $this->storeService->updateScholarReplaced($replaced_scholar_id);
            $replaced_scholar_id && $this->storeService->replacedServicePeriod($replaced_scholar_id, $scholar, $request);
            AuditTrail::createTrail("Encode scholar.", $scholar);
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json($e->getMessage(), 422);
        }
        return response()->json(['message' => 'Scholar Created Successfully']);
    }

    public function edit(Scholar $scholar)
    {
        $trainings =  ScholarTraining::select('id', 'from_date', 'to_date', 'name', 'scholar_id', 'trainor')->where('scholar_id', $scholar->id)->get();
        $replaced = Scholar::where('id', $scholar->replaced_scholar_id)
            ->select('id', DB::raw('CONCAT(first_name, " ", middle_name, " ", last_name) as full_name'))
            ->first();
        $eligibilities = DB::table('tbl_eligibilities')
            ->where('scholar_id', $scholar->id)
            ->select('id', 'name', 'date', 'number', 'scholar_id')
            ->get();
        $sp_exists = DB::table('tbl_service_periods')
            ->where('scholar_id', $scholar->id)
            ->exists();

        return response()->json(compact(
            'scholar',
            'eligibilities',
            'replaced',
            'trainings',
            'sp_exists'
        ));
    }

    public function update(Request $request, Scholar $scholar)
    {
        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'citymuni_id' => 'required',
            'barangay_id' => 'required'
        ]);
        DB::beginTransaction();
        try {
            if ($request->status === 'REP') {
                $request->validate([
                    'replaced_scholar_id' => 'required|exists:tbl_scholars,id',
                    'replacement_date' => 'required|date',
                    'first_employment_date' => 'required|date',
                ]);
                $this->updateService->ifRep($request, $scholar);
            } else {
                $this->updateService->ifNotRep($scholar);
            }

            if ($request->service_period_status !== "null") {
                $this->updateService->servicePeriodStore($scholar, $request);
                $this->updateService->updateServicePeriod($scholar, $request);
            }

            if ($request->place_of_assignment == 'Same as Barangay') {
                $barangay = $this->updateService->getBarangay($request);
                if (!$barangay) {
                    throw new Exception('Error in barangay');
                }
                $place_of_assignment = $barangay->name;
            } else {
                $place_of_assignment = 'BNS Coordinator';
            }

            $replacement = $request->replacement_date;
            $this->updateService->updateScholar($scholar, $replacement, $place_of_assignment, $request);
            $this->updateService->deleteEligibilityTraining($scholar);
            $this->updateService->eligibilityStore($request, $scholar);
            $this->updateService->trainingStore($request, $scholar);

            DB::commit();
            return response()->json(['message' => 'Scholar updated successfully']);
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json(['errors' => $e->errors()], 422);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function destroy(Volunteer $volunteer)
    {

        if (Auth::user()->classification == "Office Administrator") {
            $volunteer->delete();
            AuditTrail::createTrail("Deleted User Account.", $volunteer);
            return back()->withSuccess("Volunteer Worker Successfully Deleted.");
        } else {
            return redirect('/forbidden');
        }
    }

    public function upload(Request $request)
    {
        $no_data_added = 0;
        $request->validate([
            'excel' => 'required|mimes:xlsx,xls'
        ]);

        $file = $request->file('excel');
        $spreadsheet = IOFactory::load($file);
        $sheets = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);

        DB::beginTransaction();

        for ($i = 4; $i < count($sheets) + 1; $i++) {
            $district_id = DB::table('tbl_barangays')
                ->where('tbl_barangays.name', $sheets[$i]["L"])
                ->join('tbl_municipalities as m', 'm.code', 'tbl_barangays.city_and_municipality_code')
                ->join('tbl_districts as d', 'd.id', 'm.district_no')
                ->select('d.id as id')
                ->first();

            $district_id = $district_id ? $district_id->id : null;

            $city_id = DB::table('tbl_municipalities as m')->where('m.name', $sheets[$i]["K"])->first() ? DB::table('tbl_municipalities as m')->where('m.name', $sheets[$i]["K"])->first()->code : null;

            $barangay_id =  DB::table('tbl_municipalities as m')->where('m.name', $sheets[$i]["K"])
                ->join('tbl_barangays as b', 'b.city_and_municipality_code', 'm.code')
                ->where('b.name', $sheets[$i]["L"])
                ->first() ? DB::table('tbl_municipalities as m')->where('m.name', $sheets[$i]["K"])
                ->join('tbl_barangays as b', 'b.city_and_municipality_code', 'm.code')
                ->where('b.name', $sheets[$i]["L"])
                ->first()
                ->code
                : null;

            if (DB::table('tbl_municipalities as m')
                ->where('m.name', $sheets[$i]["K"])
                ->first()
            ) {
                $district_id = DB::table('tbl_municipalities as m')
                    ->where('m.name', $sheets[$i]["K"])
                    ->first()
                    ->district_no;
            }
            //  else {
            //     return redirect()
            // }


            // dd($district_id);
            // $year = substr($sheets[$i]["O"], 6, 4);
            // $day = substr($sheets[$i]["O"], 13, 2);
            // $month = substr($sheets[$i]["O"], 18, 2);   
            $birth_date = date('Y-m-d', strtotime($sheets[$i]["O"]));
            // dd($birth_date,  $sheets[$i]["C"]);
            // dd($birth_date);
            $first_employ_date = $sheets[$i]["Z"] != null ? date('Y-m-d', strtotime($sheets[$i]["Z"])) : null;
            $eligibilities = explode("\n", $sheets[$i]["W"]);
            try {
                $scholar = new Scholar();
                $scholar->first_name =                   $sheets[$i]["C"] ?  $sheets[$i]["C"] : 'NO FIRST NAME';
                $scholar->middle_name =                  $sheets[$i]["D"];
                $scholar->last_name =                    $sheets[$i]["F"] ? $sheets[$i]["F"] : 'NO LAST NAME';
                $scholar->name_on_id =                   $sheets[$i]["G"];
                $scholar->status =                       $sheets[$i]['H'];
                $scholar->barangay_id =                  $barangay_id;
                $scholar->citymuni_id =                  $city_id;
                $scholar->district_id =                  $district_id;
                $scholar->complete_address =             $sheets[$i]["M"];
                $scholar->sex =                          $sheets[$i]["N"];
                $scholar->birth_date =                   $birth_date;
                $scholar->civil_status =                 $sheets[$i]["Q"];
                $scholar->fund =                         $sheets[$i]["R"];
                $scholar->incentive_prov =               $sheets[$i]["S"];
                $scholar->incentive_mun =                $sheets[$i]["T"];
                $scholar->incentive_brgy =               $sheets[$i]["U"];
                $scholar->educational_attainment =       $sheets[$i]["V"];
                $scholar->benificiary_name =             $sheets[$i]["X"];
                $scholar->benificiary_name =             $sheets[$i]["X"];
                $scholar->relationship =                 $sheets[$i]["Y"];
                $scholar->first_employment_date =        $first_employ_date;
                $scholar->contact_number =               $sheets[$i]["AD"];
                $scholar->classification =               $sheets[$i]["AF"];
                $scholar->philhealth_no =                $sheets[$i]["AG"];
                $scholar->save();

                // dd($eligibilities);

                foreach ($eligibilities as $el) {
                    if ($el == "") {
                        // dd('quotation');
                        continue;
                    } else {
                        // dd('else');
                        $elibility = new Eligibility();
                        $elibility->scholar_id = $scholar->id;
                        $elibility->name = $el;
                        $elibility->save();
                    }
                }

                $no_data_added++;
            } catch (Exception $e) {
                DB::rollBack();
                return redirect()->back()->withErrors($e->getMessage());
            }
        }
        DB::commit();
        return redirect()->back()->withSuccess('Data Imported, ' . $no_data_added . ' records added');
    }

    public function directory_download(Request $request)
    {
        $filePath = public_path('templates/Directory.xlsx');
        $municipality = DB::table('tbl_municipalities')->where('code', $request->code)->first();

        if ($request->year < 2000 || $request->year > 2999 || !$request->year) {
            return response()->json(['message' => 'Invalid Year'], 422);
        }
        if (!$municipality) {
            return response()->json(['message' => 'Municipality | City not found'], 422);
        }

        $this->directoryDownloadService->main($request, $municipality, $filePath);

        return response()->file($filePath, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="Directory.xlsx"',
        ])->deleteFileAfterSend(true);
    }

    public function masterlist_download(Request $request)
    {
        $id = $request->code;
        $filePath = public_path('templates/BNS_Masterlist.xlsx');

        if ($request->year < 2000 || $request->year > 2999 || !$request->year) {
            return redirect()->back()->withErrors('Invalid Year');
        }
        $months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

        $municipality = DB::table('tbl_municipalities')->where('code', $id)->first();

        if (!$municipality) {
            return response()->json(['message' => 'Municipality | City not found'], 422);
        }
        $this->masterlistService->main($municipality, $request, $months, $filePath);
        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    public function top_bns()
    {
        $year = date('Y');
        $top_bns = DB::table('tbl_scholars')
            ->where(function ($q) {
                $q->where('replacement_date', ">=", now())
                    ->orWhereNull('replacement_date');
            })
            ->join('tbl_municipalities as m', 'm.code', 'tbl_scholars.citymuni_id')
            ->select('birth_date', DB::raw(
                'CONCAT(tbl_scholars.first_name, " ", COALESCE( tbl_scholars.middle_name, ""), " ", tbl_scholars.last_name) as full_name',
            ), 'first_employment_date', 'bns_type', 'm.name as barangay_name')
            ->get();

        $top_bns->map(function ($q) use ($year) {
            $first_employ_date = $q->first_employment_date;

            if ($first_employ_date != null) {
                $first_employ_date = Carbon::parse($q->first_employment_date);
                $now = Carbon::parse((date('y-m-d')));
                $years_in_service = $first_employ_date->diffInYears($now);
                $q->years_in_service = $years_in_service;
            } else {
                $q->years_in_service = 0;
            }
        });

        $top_bns = $top_bns
            ->sortByDesc('years_in_service')
            ->chunk(10)[0];

        $templatePath = public_path('templates/BNS_TOP_BNS.xlsx');
        $filePath = public_path('templates/TOP_BNS.xlsx');

        $spreadsheet = IOFactory::load($templatePath);
        $activeWorksheet = $spreadsheet->getActiveSheet();

        $row = 4;
        $now = date('F j, Y');

        $activeWorksheet->setCellValue("A1", "TOP BARANGAY NUTRITIONAL SCHOLAR AS OF " . strtoupper($now));

        foreach ($top_bns as $top) {
            $activeWorksheet->setCellValue("B$row", $top->years_in_service);
            $activeWorksheet->setCellValue("C$row", strtoupper($top->full_name));
            $activeWorksheet->setCellValue("E$row", strtoupper($top->barangay_name));
            $row++;
        }

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save($filePath);

        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    public function getAllMuni()
    {
        $cities = DB::table('tbl_municipalities as m')
            ->leftJoin('tbl_scholars as sc', 'sc.citymuni_id', 'm.code')
            ->groupBy('m.id', 'm.name', 'm.code')
            ->select(DB::raw('COUNT(sc.id) as sc_total'), 'm.id', 'm.name', 'm.code')
            ->get();
        $data = compact('cities');
        return response()->json($data);
    }
}
