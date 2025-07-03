<?php

namespace App\Http\Controllers;

use File;
use Exception;
use Carbon\Carbon;
use App\Models\Fund;
use App\Models\User;
use App\Models\Quarter;
use App\Models\Scholar;
use App\Models\Barangay;
use App\Models\District;
use App\Models\Position;
use App\Models\Volunteer;
use App\Models\Assignment;
use App\Models\AuditTrail;
use App\Models\Eligibility;
use App\Models\Requirement;
use App\Models\Municipality;
use Illuminate\Http\Request;
use App\Models\ServicePeriod;
use App\Models\Accomplishment;
use App\Models\Classification;
use App\Models\ScholarTraining;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\EducationalAttainment;
use App\Models\MunicipalRepresentative;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class VolunteerController extends Controller
{

    public function index()
    {
        $page = [
            'name'      =>  'Scholars',
            'title'     =>  'Scholar Management',
            'crumb'     =>  array('Scholars' => '/scholars')
        ];

        $municipalities = Assignment::getMunicipalities();

        return view('volunteers.index', compact('page', 'municipalities'));
    }

    // public function municipality_index(Municipality $municipality)
    public function municipality_index(Request $request)
    {
        $search = $request->search;
        $page = $request->page;
        $limit = 8;
        $scholars = DB::table('tbl_scholars')
            ->where('citymuni_id', $request->code)
            ->join('tbl_municipalities as m', 'm.code', 'tbl_scholars.citymuni_id')
            ->leftjoin('tbl_barangays as b', 'b.code', 'tbl_scholars.barangay_id')
            ->when($request->filled('search'), function ($q) use ($search) {
                return $q->where('tbl_scholars.first_name', 'LIKE', "$search%")
                    ->orWhere('tbl_scholars.middle_name', 'LIKE', "$search%")
                    ->orWhere('tbl_scholars.last_name', 'LIKE', "$search%")
                    ->orWhere('b.name', 'LIKE', "$search%");
            });
        $total_count = (clone $scholars)->count();
        $offset = $limit * ($page - 1);
        $total_page = ceil($total_count / $limit);
        $get_scholars =
            $scholars
            ->limit($limit)
            ->offset($offset)
            ->select(
                'tbl_scholars.*',
                'm.name as municity_name',
                DB::raw('CONCAT(tbl_scholars.last_name, ", " , tbl_scholars.first_name, " ", COALESCE(tbl_scholars.middle_name, "")) as full_name'),
                'b.name as barangay_name',
            )

            ->orderBy('tbl_scholars.last_name', 'asc')
            ->get();
        $current_scholar_count = $get_scholars->count();
        $get_scholars->map(function ($q) {
            $exists = DB::table('tbl_scholars')
                ->where('replaced_scholar_id', $q->id)
                ->exists();

            if ($exists) {
                $q->status = 'REPLACED';
            }
        });
        return response()->json(compact('get_scholars', 'total_count', 'total_page', 'offset', 'current_scholar_count'));
    }

    public function datatable_old(Request $request)
    {
        $result = Volunteer::select(
            'tbl_volunteers.id as id',
            'tbl_volunteers.first_name',
            'tbl_volunteers.middle_name',
            'tbl_volunteers.last_name',
            'tbl_volunteers.suffix',
            'tbl_volunteers.position_id',
            'tbl_volunteers.mobile',
            'tbl_volunteers.district_id',
            'position.position',
            'district.description',
            'municipality.name as m_name'
        )
            ->leftJoin('tbl_positions as position', 'tbl_volunteers.position_id', 'position.id')
            ->leftJoin('tbl_districts as district', 'tbl_volunteers.district_id', 'district.district_no')
            ->leftJoin('tbl_municipalities as municipality', 'tbl_volunteers.municipality_code', 'municipality.code')
            ->leftJoin('tbl_barangays as barangay', 'tbl_volunteers.barangay_code', 'barangay.code')
            ->where('tbl_volunteers.deleted_at', null);
        // Filter Volunteers based on assignments
        if (Auth::user()->classification == "Field Officer") {
            $result = $result->leftJoin('tbl_assignments as assignment', 'municipality.code', 'assignment.municipality_code')
                ->where('assignment.user_id', Auth::user()->id);
        }
        if (Auth::user()->classification == "Municipal Representative") {
            $rep = MunicipalRepresentative::where('user_id', '=', Auth::user()->id)->first();
            $volunteer_rep = Volunteer::find($rep->volunteer_id);
            $result = $result->where('tbl_volunteers.municipality_code', $volunteer_rep->municipality_code);
        }

        $result = $result->where(
            DB::raw(
                "CONCAT(
                        `tbl_volunteers`.`first_name`,
                        `tbl_volunteers`.`last_name`,
                        `tbl_volunteers`.`position_id`,
                        `district`.`description`,
                        `municipality`.`name`,
                        `position`.`position`,
                        `tbl_volunteers`.`id`
                    )"
            ),
            'LIKE',
            "%" . $request->search['value'] . "%"
        )->orderBy('tbl_volunteers.last_name');
        $count_result = $result->get();
        $count_result = $count_result->count();

        $result = $result->skip($request->start)->take($request->length)->get();

        $total = Volunteer::totalVolunteer();

        $filtered = (is_null($request->search['value']) ? $total : $count_result);
        $fin_result = array();

        foreach ($result as $key => $rs) {
            $check_requirements = Requirement::where('quarter_id', Quarter::isActive())
                ->where('volunteer_id', $rs->id)
                ->where('completed', 1)->get();
            $requirements = ($check_requirements->count() > 0) ? 1 : 0;

            $check_accomplishments = Accomplishment::where('quarter_id', Quarter::isActive())
                ->where('month', Quarter::currentMonthNum())
                ->where('volunteer_id', $rs->id)
                ->where('status', 1)->get();
            $accomplishments = ($check_accomplishments->count() > 0) ? 1 : 0;

            $fin_result[] = array(
                'id' => $rs->id,
                'first_name' => $rs->first_name,
                'middle_name' => ($rs->middle_name != null) ? $rs->middle_name : '',
                'last_name' => $rs->last_name,
                'suffix' => $rs->suffix,
                'position_id' => $rs->position_id,
                'mobile' => $rs->mobile,
                'district_id' => $rs->district_id,
                'position' => $rs->position,
                'description' => $rs->description,
                'm_name' => $rs->m_name,
                // 'b_name' => $rs->b_name,
                'requirements' => $requirements,
                'accomplishments' => $accomplishments,
            );
        }

        $result = $fin_result;
        return array(
            "draw" => $request->draw,
            "recordsTotal" => $total,
            "recordsFiltered" => $filtered,
            "data" => $result,
            "request" => $request->all()
        );
        return $result;
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
        // return response($request->trainings);
        $request->validate([
            'form.first_name' => 'required',
            // 'last_name' => 'required',
            // 'name_on_id' => 'required',
            // 'sex' => 'required',
            // 'birth_date' => 'required',
            // 'civil_status' => 'required',
            // 'fund_id' => 'required',
            // 'educational_attainment_id' => 'required',
            // 'benificiary_name' => 'required',
            // 'relationship' => 'required',
            'form.citymuni_id' => 'required',
            // 'birth_date' => 'required',
            'form.district_id' => 'required',
            'form.barangay_id' => 'required',
            // 'complete_address' => 'required',
            // 'first_employment_date' => 'required|date',
            // 'classification_id'  => 'required',
            // 'place_of_assignment' => 'required',
            // 'status' => 'required',
            // 'incentive_prov' => 'required',
            // 'incentive_mun' => 'required',
            // 'incentive_brgy' => 'required',
        ]);

        if ($request->form['status'] == 'REPLACEMENT') {
            $request->validate([
                'form.replacing' => 'required',
                'form.replacement_date' => 'required'
            ]);
        }
        try {
            $scholar = new Scholar();
            $scholar->first_name = $request->form['first_name'] ?? null;
            $scholar->middle_name = $request->form['middle_name'] ?? null;
            $scholar->last_name = $request->form['last_name'] ?? null;
            $scholar->name_extension = $request->form['name_extension'] ?? null;
            $scholar->name_on_id = $request->form['name_on_id'] ?? null;
            $scholar->id_no = $request->form['id_no'] ?? null;
            $scholar->sex = $request->form['sex'] ?? null;
            $scholar->bns_type = $request->form['bns_type'] ?? null;
            $scholar->birth_date = $request->form['birth_date'] ?? null;
            $scholar->civil_status = $request->form['civil_status'] ?? null;
            $scholar->contact_number = $request->form['contact_number'] ?? null;
            $scholar->fund = $request->form['fund'] ?? null;
            $scholar->educational_attainment = $request->form['educational_attainment'] ?? null;
            $scholar->benificiary_name = $request->form['benificiary_name'] ?? null;
            $scholar->relationship = $request->form['relationship'] ?? null;
            $scholar->district_id = $request->form['district_id'] ?? null;
            $scholar->citymuni_id = $request->form['citymuni_id'] ?? null;
            $scholar->barangay_id = $request->form['barangay_id'] ?? null;
            $scholar->complete_address = $request->form['complete_address'] ?? null;
            $scholar->classification = $request->form['classification'] ?? null;
            $scholar->philhealth_no = $request->form['philhealth_no'] ?? null;
            $scholar->status = $request->form['status'] ?? null;

            if ($request->place_of_assignment == 'Same as Barangay') {
                $barangay = DB::table('tbl_barangays')
                    ->where('code', $request->barangay_id)
                    ->first();

                if (!$barangay) {
                    return response()->json(['message' => 'Error in barangay_name'], 422);
                }

                $scholar->place_of_assignment = $barangay->name;
            } else {
                $scholar->place_of_assignment = 'BNS Coordinator';
            }

            $scholar->first_employment_date = $request->first_employment_date;
            $scholar->end_employment_date = $request->end_employment_date;
            $scholar->incentive_prov  = $request->incentive_prov;
            $scholar->incentive_mun = $request->incentive_mun;
            $scholar->incentive_brgy = $request->incentive_brgy;

            $scholar->save();
        } catch (\Exception $e) {
            return response()->json($e->getMessage());
        }
        if ($request->first_employment_date != null) {
            $sp = new ServicePeriod();
            $sp->volunteer_id = $scholar->id;
            $sp->month_from = date('m', strtotime($request->first_employment_date));
            $sp->year_from = date('Y', strtotime($request->first_employment_date));
            $sp->month_to = 0;
            $sp->year_to = 0;
            $sp->status = 'present';
            $sp->save();
        }

        $eligibilities = $request->eligibilities;
        $trainings = $request->trainings;
        $date_tr = $request->date_training;
        $trainor = $request->trainor;
        // dd($eligibilities);
        if ($eligibilities && count($eligibilities) > 0) {
            foreach ($eligibilities as $el) {
                $eligibility = new Eligibility();
                $eligibility->scholar_id = $scholar->id;
                $eligibility->name = $el["value"];
                $eligibility->save();
            }
        }

        if ($trainings) {
            try {
                foreach ($trainings as $t) {
                    $training = new ScholarTraining();
                    $training->scholar_id = $scholar->id;
                    $training->name = $t['name'];
                    $training->date = $t['date'];
                    $training->trainor = $t['trainor'];
                    $training->save();
                }
            } catch (Exception $e) {
                return response()->json($e->getMessage());
            }
        }
        // Log the volunteer creation in audit trail
        AuditTrail::createTrail("Encode scholar.", $scholar);

        // If the position is Municipal Representative, create a user and related record
        // if ($request->position_id == 2) {
        //     $user = new User;
        //     $user->name = $scholar->first_name . ' ' . $scholar->middle_name . ' ' . $scholar->last_name;
        //     $user->username = $scholar->mobile;
        //     $user->password = Hash::make('12345');
        //     $user->classification = "Municipal Representative";
        //     $user->mobile = $scholar->mobile;
        //     $user->save();

        //     $mr = new MunicipalRepresentative;
        //     $mr->volunteer_id = $scholar->id;
        //     $mr->user_id = $user->id;
        //     $mr->status = '1';
        //     $mr->save();

        //     AuditTrail::createTrail("New Municipal Representative", $mr);
        // }

        // Commit the transaction
        $scholars = Scholar::all();
        return response()->json(['message' => 'Scholar Created Successfully']);
    }


    public function id(Volunteer $volunteer)
    {
        $municipality = Municipality::where('code', $volunteer->municipality_code)->first();
        $barangay = Barangay::where('code', $volunteer->barangay_code)->first();
        $id_code = Municipality::code($municipality->code);
        $id_code = $id_code . '-' . $volunteer->id;
        return view('volunteers.include.id', compact('volunteer', 'municipality', 'barangay', 'id_code'));
    }


    public function show($id)
    {
        $page = [
            'name'      =>  'Scholars',
            'title'     =>  'Scholar Management',
            'crumb' =>  array('Scholars' => '/Scholars', 'Information' => '')
        ];

        Scholar::findOrFail($id);
        $scholar = DB::table('tbl_scholars as sc')->where('sc.id', $id)
            ->leftjoin('tbl_barangays as b', 'b.code', 'sc.barangay_id')
            ->leftjoin('tbl_municipalities as m', 'm.code', 'sc.citymuni_id')
            ->select(
                DB::raw('CONCAT( sc.last_name, ", " , sc.first_name, " " , COALESCE(sc.name_extension, ""), " " , COALESCE(sc.middle_name, ""))  as full_name'),
                DB::raw('CONCAT("Brgy. " , COALESCE(b.name, ""), " ", m.name , ", Laguna") as full_address'),
                'sc.*',
            )
            ->first();

        $replaced = "";

        if ($scholar->status == "REPLACEMENT") {
            $replaced = DB::table('tbl_scholars')
                ->where('id', $scholar->replaced_scholar_id)
                ->select(DB::raw('CONCAT(first_name, " " , COALESCE(middle_name, ""), " ", last_name) as full_name'))
                ->first()
                ->full_name;
        }

        $service_periods = DB::table('tbl_service_periods as sp')
            ->where('sp.volunteer_id', $scholar->id)
            ->where('sp.deleted_at', null)
            ->orderBy('sp.month_from', 'desc')
            ->orderBy('sp.month_to', 'desc')
            ->get();

        $municipality_id = DB::table('tbl_municipalities')
            ->where('code', $scholar->citymuni_id)
            ->first()
            ->id;

        $trainings = DB::table('tbl_scholar_training_name')
            ->where('scholar_id', $id)
            ->get();

        $months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
        $eligibilities = DB::table('tbl_eligibilities')->where('scholar_id', $id)->get();
        return response()->json(compact('page', 'scholar', 'eligibilities', 'municipality_id', 'service_periods', 'months', 'trainings', 'replaced', 'id'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Volunteer  $volunteer
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $trainings =  ScholarTraining::select('id', 'date', 'name', 'scholar_id', 'trainor')->where('scholar_id', $id)->get();
        Scholar::findOrFail($id);
        $scholar = DB::table('tbl_scholars')->where('id', $id)->first();
        $muni_scholars = DB::table('tbl_scholars')
            ->where('citymuni_id', $scholar->citymuni_id)
            ->where('id', '!=', $id)
            ->select('tbl_scholars.id', DB::raw("CONCAT(tbl_scholars.first_name, ' ', COALESCE(tbl_scholars.middle_name, ''), ' ', tbl_scholars.last_name) as full_name"))
            ->get();

        $municipality_id = DB::table('tbl_municipalities')
            ->where('code', $scholar->citymuni_id)
            ->first()
            ->id;
        $replaced = null;

        $replaced = DB::table('tbl_scholars as s')
            ->where('id', $scholar->replaced_scholar_id)
            ->select('s.id', DB::raw('CONCAT(s.first_name, " ", s.middle_name, " ", s.last_name) as full_name'))
            ->first();
        // dd($replaced);

        $districts = District::all();
        $municipality = DB::table('tbl_municipalities')
            ->where('code', $scholar->citymuni_id)
            ->first();

        $barangays = Barangay::where('city_and_municipality_code', $scholar->citymuni_id)->get();
        // dd($volunteer);
        $positions = Position::all();
        $eligibilities = DB::table('tbl_eligibilities')
            ->where('scholar_id', $scholar->id)
            ->select('id', 'name as value', 'scholar_id')
            ->get();

        $sp_exists = DB::table('tbl_service_periods')
            ->where('volunteer_id', $id)
            ->exists();

        return response()->json(compact(
            'districts',
            'municipality',
            'barangays',
            'scholar',
            'positions',
            'eligibilities',
            'muni_scholars',
            'replaced',
            'municipality_id',
            'trainings',
            'sp_exists'
        ));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Volunteer  $volunteer
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $scholar = Scholar::findOrFail($id);
        $request->validate([
            'form.first_name' => 'required',
            'form.last_name' => 'required',
            'form.citymuni_id' => 'required',
            'form.barangay_id' => 'required'
        ]);

        if ($request->status == 'REPLACEMENT') {
            $request->validate([
                'form.replacing' => 'required|exists:tbl_scholars,id',
                'form.replacement_date' => 'required|date',
                'form.first_employment_date' => 'required|date',
            ]);

            try {
                DB::table('tbl_scholars')
                    ->where('id', $id)
                    ->update([
                        'replacement_date' => $request->form['replacement_date'],
                        'replaced_scholar_id' => $request->form['replacing']
                    ]);

                $month_from =  date('m', strtotime($request->form['first_employment_date']));
                $year_from =  date('Y', strtotime($request->form['first_employment_date']));

                if ($request->service_period_status == "new_service_period") {

                    $sp = new ServicePeriod();
                    $sp->volunteer_id = $id;
                    $sp->month_from = $month_from;
                    $sp->year_from = $year_from;
                    $sp->month_to = $request->form['end_employment_date'] ?  date('m', strtotime($request->form['end_employment_date'])) : 0;
                    $sp->year_to =  $request->form['end_employment_date'] ?  date('Y', strtotime($request->form['end_employment_date'])) : 0;
                    $sp->status =  $request->form['end_employment_date'] ? 'specific' : 'present';
                    $sp->save();
                } elseif ($request->service_period_status == "update_service_period") {
                    $max_id =  DB::table('tbl_service_periods')
                        ->where('volunteer_id', $id)
                        ->max('id');

                    if ($max_id) {
                        DB::table('tbl_service_periods')
                            ->where('volunteer_id', $id)
                            ->where('id', $max_id)
                            ->update([
                                'month_from' => $month_from,
                                'year_from' => $year_from,
                                'month_to' => $request->form['end_employment_date'] ?  date('m', strtotime($request->form['end_employment_date'])) : 0,
                                'year_to' =>  $request->form['end_employment_date'] ?  date('Y', strtotime($request->form['end_employment_date'])) : 0,
                                'status' => $request->form['end_employment_date'] ? 'specific' : 'present'
                            ]);
                    }
                }
            } catch (Exception $e) {
                return redirect()->back()->withErrors($e->getMessage());
            }
        } else {
            try {
                DB::table('tbl_scholars')
                    ->where('id', $id)
                    ->update([
                        'replacement_date' => null,
                        'replaced_scholar_id' => null
                    ]);
            } catch (Exception $e) {
                return redirect()->back()->withErrors($e->getMessage());
            }
        }

        $place_of_assignment = "";
        if ($request->place_of_assignment == 'same_barangay') {
            $barangay_name = DB::table('tbl_barangays')
                ->where('code', $request->barangay_id)
                ->first()
                ->name;
            $place_of_assignment = $barangay_name;
        } else {
            $place_of_assignment = 'BNS Coordinator';
        }

        try {
            $end_employment = null;

            if ($request->select_end_employ == "specific") {
                $end_employment = $request->form['end_employment_date'];
            }
            DB::table('tbl_scholars')
                ->where('id', $id)
                ->update([
                    'first_name' => $request->form['first_name'],
                    'middle_name' => $request->form['middle_name'],
                    'last_name' => $request->form['last_name'],
                    'name_extension' => $request->form['name_extension'],
                    'name_on_id' => $request->form['name_on_id'],
                    'id_no' => $request->form['id_no'],
                    'citymuni_id' => $request->form['citymuni_id'],
                    'bns_type' => $request->form['bns_type'],
                    'barangay_id' => $request->form['barangay_id'],
                    'complete_address' => $request->form['complete_address'],
                    'sex' => $request->form['sex'],
                    'birth_date' => $request->form['birth_date'],
                    'civil_status' => $request->form['civil_status'],
                    'educational_attainment' => $request->form['educational_attainment'],
                    'benificiary_name' => $request->form['benificiary_name'],
                    'relationship' => $request->form['relationship'],
                    'district_id' => $request->form['district_id'],
                    'classification' => $request->form['classification'],
                    'philhealth_no' => $request->form['philhealth_no'],
                    'first_employment_date' => $request->form['first_employment_date'],
                    'end_employment_date' => $end_employment,
                    'contact_number' => $request->form['contact_number'],
                    'status' => $request->form['status'],
                    'place_of_assignment' => $place_of_assignment,
                    'fund' => $request->form['fund'],
                    'incentive_prov' => $request->form['incentive_prov'],
                    'incentive_mun' => $request->form['incentive_mun'],
                    'incentive_brgy' => $request->form['incentive_brgy'],
                ]);

            DB::table('tbl_eligibilities')
                ->where('scholar_id', $id)
                ->delete();

            DB::table('tbl_scholar_training_name')
                ->where('scholar_id', $id)
                ->delete();

            $eligibilities = $request->eligibilities;
            $trainings = $request->trainings;
            if ($eligibilities && count($eligibilities) > 0) {
                foreach ($eligibilities as $el) {
                    $eligibility = new Eligibility();
                    $eligibility->scholar_id = $scholar->id;
                    $eligibility->name = $el["value"];
                    $eligibility->save();
                }
            }

            if ($trainings) {
                try {
                    foreach ($trainings as $t) {
                        $training = new ScholarTraining();
                        $training->scholar_id = $scholar->id;
                        $training->name = $t['name'];
                        $training->date = $t['date'];
                        $training->trainor = $t['trainor'];
                        $training->save();
                    }
                } catch (Exception $e) {
                    return response()->json($e->getMessage());
                }
            }

            return response()->json(['message' => 'Scholar updated successfully']);
        } catch (Exception $e) {
            return response()->json($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Volunteer  $volunteer
     * @return \Illuminate\Http\Response
     */

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


    public function seed(Request $request)
    {

        if ($request->keyword != "0893") {
            return back()->withErrors("Keyword didn't match!");
        }

        $path = public_path() . "/templates/volunteer.json";
        $volunteers =   json_decode(File::get($path));

        DB::beginTransaction();
        try {

            foreach ($volunteers as $row) {
                $municipality = Municipality::select('code')
                    ->where('name', 'like', '%' . $row->municipality . '%')
                    ->first();

                $barangay = Barangay::select('code')
                    ->where('city_and_municipality_code', $municipality->code)
                    ->where('name', 'like', '%' . $row->barangay . '%')
                    ->first();
                if ($barangay) {
                } else {
                    $barangay = Barangay::select('code')
                        ->where('city_and_municipality_code', $municipality->code)
                        ->first();
                }

                $volunteer                        = new Volunteer;
                $volunteer->first_name            = $row->middle_name;
                $volunteer->middle_name           = $row->first_name;
                $volunteer->last_name             = $row->last_name;
                $volunteer->suffix                = $row->suffix;
                $volunteer->sex                   = $row->sex;
                $volunteer->address               = $row->address;
                $volunteer->mobile                = $row->mobile;
                $volunteer->birth_date            = $row->birth_date;
                $volunteer->district_id           = $row->district_id;
                $volunteer->position_id           = $row->position_id;
                $volunteer->municipality_code     = $municipality->code;
                $volunteer->barangay_code         = $barangay->code;
                $volunteer->save();

                AuditTrail::createTrail("Encode volunteer.", $volunteer);

                if ($row->position_id == 2) {
                    if ($volunteer->mobile) {
                        $user = new User;
                        $user->name = $volunteer->first_name . ' ' . $volunteer->middle_name . ' ' . $volunteer->last_name;
                        $user->username = $volunteer->mobile;
                        $user->password = Hash::make('12345');
                        $user->classification = "Municipal Representative";
                        $user->mobile = $volunteer->mobile;
                        $user->save();

                        $mr = new MunicipalRepresentative;
                        $mr->volunteer_id = $volunteer->id;
                        $mr->user_id = $user->id;
                        $mr->status = '1';
                        $mr->save();

                        AuditTrail::createTrail("New Municipal Representative", $mr);
                    }
                }
            }

            DB::commit();
            return back()->withSuccess('Seed Successfully!');
        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
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
        // dd(count($sheets));
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
        if ($request->year < 2000 || $request->year > 2999 || !$request->year) {
            return response()->json(['message' => 'Invalid Year'], 422);
        }
        $municipality = DB::table('tbl_municipalities')->where('code', $request->code)->first();

        if (!$municipality) {
            return response()->json(['message' => 'Municipality | City not found'], 422);
        }

        $templatePath = public_path('templates/BNS_Directory.xlsx');
        $filePath = public_path('templates/Directory.xlsx');

        $spreadsheet = IOFactory::load($templatePath);
        $activeWorksheet = $spreadsheet->getActiveSheet();

        $municity_type = "";
        $municity_name = str_contains($municipality->name, 'City') ? strtoupper(str_replace("City", "", $municipality->name)) : strtoupper($municipality->name);
        str_contains($municipality->name, 'City') ? $municity_type = "CITY OF " : $municity_type  = "MUNICIPALITY OF ";
        $activeWorksheet->setCellValue('A1', "BARANGAY NUTRITION SCHOLAR DIRECTORY -  $municity_type $municity_name  $request->year");
        $cellrow = 5;
        $current_no = 1;

        $scholars = DB::table('tbl_scholars')
            ->leftjoin('tbl_barangays as b', 'b.code', '=', 'tbl_scholars.barangay_id')
            ->leftJoin('tbl_service_periods', function ($join) {
                //kunin lang isang service period na latest
                $join->on('tbl_service_periods.volunteer_id', '=', 'tbl_scholars.id')
                    ->on('tbl_service_periods.id', '=', DB::raw("(SELECT MAX(id) from tbl_service_periods WHERE tbl_service_periods.volunteer_id = tbl_scholars.id)"));
            })
            ->where('citymuni_id', $municipality->code)
            ->where('fund', 'like', "$request->fund%")
            // ->where('tbl_scholars.status', '!=', 'INACTIVE')
            ->where('tbl_service_periods.year_from', '<=', $request->year)
            ->where(function ($query) use ($request) {
                //logic lang neto ay kelangan pasok sa range ng year from at year to yung requested year
                $query->where('tbl_service_periods.year_to', '>=', $request->year)
                    ->orWhere('tbl_service_periods.year_to', 0);
            })
            ->select(
                'tbl_scholars.*',
                'b.name as barangay_name',
                'tbl_service_periods.*',
                'tbl_scholars.status as status'
            )
            ->get();

        if ($scholars->count() == 0) {
            return response()->json(['message' => "No $request->fund Scholars For $municipality->name in year $request->year"], 422);
        }
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'], // Black border color
                ],
            ],
        ];

        // dd($scholars);
        foreach ($scholars as $key => $scholar) {
            $scholar_eligibility = DB::table('tbl_eligibilities')->where('scholar_id', $scholar->id)->get();
            $eligibility_all = "";
            $age = 0;

            if (intval(date('m')) < intval(date('m', strtotime($scholar->birth_date)))) {
                $age = date('Y') - date('Y', strtotime($scholar->birth_date)) - 1;
            } elseif (intval(date('m')) >= intval(date('m', strtotime($scholar->birth_date)))) {
                $age = date('Y') - date('Y', strtotime($scholar->birth_date));
            }

            // $service_period_from = $months[intval($scholar->month_from) - 1] . ' ' . $scholar->year_from;
            // $service_period_to =  $scholar->month_to != 0 ? $months[intval($scholar->month_to) - 1] . ' ' . $scholar->year_to : 'To Present';

            foreach ($scholar_eligibility as $se) {
                $eligibility_all .= "$se->name\n";
            }

            $scholar_end_employment_date = 'N';
            if ($scholar->first_employment_date == null && $scholar->end_employment_date == null) {
                $scholar_end_employment_date = "N/A";
            } elseif ($scholar->first_employment_date && $scholar->end_employment_date == null) {
                $scholar_end_employment_date = "Present";
            } else {
                $scholar_end_employment_date = date("F j, Y", strtotime($scholar->end_employment_date));
            }

            $activeWorksheet->setCellValue('A' . $cellrow, $current_no);
            $activeWorksheet->setCellValue('B' . $cellrow, $scholar->id_no);
            $activeWorksheet->setCellValue('C' . $cellrow, $scholar->first_name);
            $activeWorksheet->setCellValue('D' . $cellrow, $scholar->middle_name);
            $activeWorksheet->setCellValue('E' . $cellrow, $scholar->middle_name ? substr($scholar->middle_name, 0, 1) . '.' : '');
            $activeWorksheet->setCellValue('F' . $cellrow, $scholar->last_name);
            $activeWorksheet->setCellValue('G' . $cellrow, $scholar->name_on_id);
            $activeWorksheet->setCellValue('H' . $cellrow, 'IV-A');
            $activeWorksheet->setCellValue('I' . $cellrow, 'LAGUNA');
            $activeWorksheet->setCellValue('J' . $cellrow, $scholar->barangay_name);
            $activeWorksheet->setCellValue('K' . $cellrow, $scholar->complete_address);
            $activeWorksheet->setCellValue('L' . $cellrow, $scholar->sex);
            $activeWorksheet->setCellValue('M' . $cellrow, str_replace('-', '/', date('m-d-Y', strtotime($scholar->birth_date))));
            $activeWorksheet->setCellValue('N' . $cellrow, $age);
            // $activeWorksheet->setCellValue('K' . $cellrow, $municipality->name);
            $activeWorksheet->setCellValue('O' . $cellrow, $scholar->civil_status);
            $activeWorksheet->setCellValue('P' . $cellrow, $scholar->status);
            $activeWorksheet->setCellValue('Q' . $cellrow, $scholar->fund);
            $activeWorksheet->setCellValue('R' . $cellrow, $scholar->educational_attainment);
            $activeWorksheet->setCellValue('S' . $cellrow, $scholar->benificiary_name);
            $activeWorksheet->setCellValue('T' . $cellrow, $scholar->relationship);
            $activeWorksheet->setCellValue('U' . $cellrow, $scholar->first_employment_date ? date('F Y', strtotime($scholar->first_employment_date)) : "N/A");
            $activeWorksheet->setCellValue('V' . $cellrow, $scholar_end_employment_date);
            $activeWorksheet->setCellValue('W' . $cellrow, $scholar->philhealth_no ? '✓' : '');
            $activeWorksheet->setCellValue('X' . $cellrow, $scholar->classification);
            $activeWorksheet->setCellValue('Y' . $cellrow, $scholar->philhealth_no ? $scholar->philhealth_no : '');
            $activeWorksheet->getStyle('A' . $cellrow . ':X' . $cellrow)->applyFromArray($styleArray);

            $cellrow++;
            $current_no++;
        }
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        // $activeWorksheet->getPageSetup()->setScale(70); // Adjust the scale to your preference, e.g., 85%
        $activeWorksheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE);

        $writer->save($filePath);

        return response()->file($filePath, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="Directory.xlsx"',
        ])->deleteFileAfterSend(true);
    }

    public function masterlist_download(Request $request)
    {
        $id = $request->code;
        if ($request->year < 2000 || $request->year > 2999 || !$request->year) {
            return redirect()->back()->withErrors('Invalid Year');
        }
        $months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

        $municipality = DB::table('tbl_municipalities')->where('code', $id)->first();

        if (!$municipality) {
            return response()->json(['message' => 'Municipality | City not found'], 422);
        }

        $filePath = public_path('templates/BNS_Masterlist.xlsx');
        $reader = new Xlsx();
        $spreadsheet = $reader->load(public_path('/templates/BNS_Masterlist_Template.xlsx'));
        $activeWorksheet = $spreadsheet->getActiveSheet();

        $scholars = DB::table('tbl_scholars as tbl_scholars')
            ->leftjoin('tbl_barangays as b', 'b.code', '=', 'tbl_scholars.barangay_id')
            ->leftJoin('tbl_service_periods', function ($join) {
                //kunin lang isang service period na latest
                $join->on('tbl_service_periods.volunteer_id', '=', 'tbl_scholars.id')
                    ->on('tbl_service_periods.id', '=', DB::raw("(SELECT MAX(id) from tbl_service_periods WHERE tbl_service_periods.volunteer_id = tbl_scholars.id)"));
            })
            ->where('citymuni_id', $municipality->code)
            ->where('fund', 'like', "$request->fund%")
            // ->where('tbl_scholars.status', '!=', 'INACTIVE')
            ->where('tbl_service_periods.year_from', '<=', $request->year)
            ->where(function ($query) use ($request) {
                //logic lang neto ay kelangan pasok sa range ng year from at year to yung requested year
                $query->where('tbl_service_periods.year_to', '>=', $request->year)
                    ->orWhere('tbl_service_periods.year_to', 0);
            })
            ->select(
                'tbl_scholars.*',
                'b.name as barangay_name',
                'tbl_service_periods.*',
                'tbl_scholars.status as status',
                DB::raw('CONCAT(tbl_scholars.last_name, ", ", tbl_scholars.first_name, " " ,  COALESCE(tbl_scholars.middle_name, "")) AS full_name')
            )
            ->get();


        $signatories = DB::table('tbl_signatories')->get();
        $action_officer_name = $signatories->where('status', 1)->where('designation_id', 1)->first()->name;
        $action_officer_position = $signatories->where('status', 1)->where('designation_id', 1)->first()->description;
        $chairman_name = $signatories->where('status', 1)->where('designation_id', 5)->first();

        if (!$chairman_name) {
            return response()->json(['message' => 'Missing Provincial Nutrition Action Officer Signatory'], 422);
        }
        if ($scholars->count() == 0) {
            return response()->json(['message' => "No $request->fund Scholars For $municipality->name in year $request->year"], 422);
        }
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'], // Black border color
                ],
            ],
        ];
        $scholar_count = $scholars->count();
        $scholars = $scholars->toArray();
        $scholars = array_chunk($scholars, 25, true);

        // $activeWorksheet->setCellValue('F3', 'Municipality of ' . $municipality->name);
        // $activeWorksheet->setCellValue('F5', 'LIST OF BNS  for the year ' . $request->year);
        $municity_type = "";
        $municity_name = str_contains($municipality->name, 'City') ? strtoupper(str_replace("City", "", $municipality->name)) : strtoupper($municipality->name);
        str_contains($municipality->name, 'City') ? $municity_type = "CITY OF " : $municity_type  = "MUNICIPALITY OF ";
        $activeWorksheet->setCellValue('A1', "$request->year BARANGAY NUTRITION SCHOLAR MASTERLIST -  $municity_type $municity_name");

        $page = 1;
        $total_page = ceil($scholar_count / 25);
        $current_no = 1;


        foreach ($scholars as $key => $sc) {

            $cellrow = 5;
            $title = "Page $page of $total_page";
            $clone_sheet = clone $spreadsheet->getSheet(0);
            $clone_sheet->setTitle("Page $page");
            $spreadsheet->addSheet($clone_sheet);
            $spreadsheet->setActiveSheetIndex($page); // Set the new sheet as active
            $clone_sheet = $spreadsheet->getActiveSheet(); // Now modify the correct sheet

            foreach ($sc as $key => $scholar) {
                $age = 0;

                if (intval(date('m')) < intval(date('m', strtotime($scholar->birth_date)))) {
                    $age = date('Y') - date('Y', strtotime($scholar->birth_date)) - 1;
                } elseif (intval(date('m')) >= intval(date('m', strtotime($scholar->birth_date)))) {
                    $age = date('Y') - date('Y', strtotime($scholar->birth_date));
                }
                $eligibility_all = "";
                $scholar_eligibility = DB::table('tbl_eligibilities')->where('scholar_id', $scholar->id)->get();

                $service_period_from = $months[intval($scholar->month_from) - 1] . ' ' . $scholar->year_from;
                $service_period_to =  $scholar->month_to != 0 ? $months[intval($scholar->month_to) - 1] . ' ' . $scholar->year_to : 'To Present';
                $clone_sheet->setCellValue("A$cellrow", $current_no);
                $clone_sheet->setCellValue("B$cellrow", $scholar->id_no);
                $clone_sheet->setCellValue("C$cellrow", $scholar->first_name);
                $clone_sheet->setCellValue("D$cellrow", $scholar->middle_name);
                $clone_sheet->setCellValue("E$cellrow", $scholar->middle_name ? substr($scholar->middle_name, 0, 1) . "." : "");
                $clone_sheet->setCellValue("F$cellrow", $scholar->last_name);
                $clone_sheet->setCellValue("G$cellrow", $scholar->name_on_id);
                $clone_sheet->setCellValue("H$cellrow", "LAGUNA");
                $clone_sheet->setCellValue("I$cellrow", $municipality->name);
                $clone_sheet->setCellValue("K$cellrow", $scholar->sex);
                $clone_sheet->setCellValue("J$cellrow", $scholar->barangay_name);
                $clone_sheet->setCellValue("K$cellrow", $scholar->sex);
                $clone_sheet->setCellValue("L$cellrow", $scholar->birth_date ? date('m/d/Y', strtotime($scholar->birth_date)) : "");
                $clone_sheet->setCellValue("M$cellrow", $age);
                $clone_sheet->setCellValue("N$cellrow", $scholar->status);
                $clone_sheet->setCellValue("O$cellrow", $scholar->fund);
                $clone_sheet->setCellValue("P$cellrow", $scholar->benificiary_name);
                $clone_sheet->setCellValue("Q$cellrow", $scholar->relationship);
                $clone_sheet->setCellValue("R$cellrow", $scholar->first_employment_date ? date('F j, Y', strtotime($scholar->first_employment_date)) : "");
                $clone_sheet->setCellValue("S$cellrow", $service_period_from);
                $clone_sheet->setCellValue("T$cellrow", $service_period_to);

                foreach ($scholar_eligibility as $se) {
                    $eligibility_all .= $se->name . "\n";
                }

                $clone_sheet->getStyle("A$cellrow:N$cellrow")->applyFromArray($styleArray);

                $cellrow++;
                $current_no++;
            }

            $clone_sheet->setCellValue("T40", $title);

            $page++;
        }
        $spreadsheet->removeSheetByIndex(0); //template

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $activeWorksheet->getPageSetup()->setScale(75); // Adjust the scale to your preference, e.g., 85%
        $activeWorksheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE);

        $writer->save($filePath);

        return response()->download($filePath)->deleteFileAfterSend(true);
    }

    public function get_municipal_scholars()
    {
        $scholars = DB::table('tbl_scholars as sc')
            ->where('status', '!=', 'INACTIVE')
            ->select('sc.id', DB::raw('CONCAT(sc.first_name, " " , COALESCE(sc.middle_name, ""), " " , sc.last_name) as full_name'))
            ->get();

        return dataTables()->of($scholars)
            ->make(true);
    }

    public function top_bns()
    {
        $year = date('Y');
        $top_bns = DB::table('tbl_scholars')
            ->where(function ($q) {
                $q->where('end_employment_date', ">=", now())
                    ->orWhereNull('end_employment_date');
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
