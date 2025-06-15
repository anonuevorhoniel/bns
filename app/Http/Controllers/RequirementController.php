<?php

namespace App\Http\Controllers;

use App\Models\AuditTrail;
use App\Models\Assignment;
use App\Models\Accomplishment;
use App\Models\Quarter;
use App\Models\Requirement;
use App\Models\Volunteer;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class RequirementController extends Controller
{
    

    public function all(Volunteer $volunteer){

        $page = [
            'name'      =>  'Requirements',
            'title'     =>  'Incomplete Requirement Management',
            'crumb'     =>  array(
                'Requirements' => '/requirements',
                'Volunteers' => ''
            )
        ];
        $active_quarter = Quarter::find(Quarter::isActive());
        $quarter_months = Quarter::quarterMonths($active_quarter->quarter);

        return view('requirements.index', compact('page'));
    }

    public function incompletes()
    {
        $page = [
            'name'      =>  'Requirements',
            'title'     =>  'Incomplete Requirement Management',
            'crumb'     =>  array(
                'Requirements' => '/requirements',
                'Incompletes' => '/requirements/incompletes'
            )
        ];
        

        $municipalities = Assignment::getMunicipalities()->toArray();
        $municipality_codes = array_column($municipalities, 'code');

        $volunteers = Volunteer::select(
                'first_name', 'middle_name', 'last_name', 'name',
                'tbl_volunteers.id as id'
            )
            ->whereIn('municipality_code', $municipality_codes)
            ->join('tbl_municipalities','tbl_municipalities.code', 'municipality_code')
            ->get();

        $active_quarter = Quarter::find(Quarter::isActive());
        $quarter_months = Quarter::quarterMonths($active_quarter->quarter);
        $months = Quarter::quarterMonthsName($active_quarter->quarter);
        $data = array();

        foreach ($volunteers as $key => $volunteer) {

            $requirement_status = 0;
            $check_requirement = Requirement::where('quarter_id', Quarter::isActive())
                ->where('volunteer_id', $volunteer->id)->first();

            if ($check_requirement) {
                if ($check_requirement->completed == 1) {
                    $requirement_status = 1;
                }
            }

            $total_accomplishments = 0;
            $accomplishments = array();

            foreach ($quarter_months as $key => $month) {

                $check_accomplishment = Accomplishment::where('quarter_id', Quarter::isActive())
                ->where('month', $month)
                ->where('volunteer_id', $volunteer->id)
                ->first();

                $accomplishment_status = 0;
                if ($check_accomplishment != null) {
                    if ($check_accomplishment->status == 1) {
                        $total_accomplishments += 1;
                        $accomplishment_status = 1;
                    }else{
                       $accomplishment_status =  $check_accomplishment->status;
                    }
                }

                $accomplishments[] = array(
                    "month" => $month,
                    "status" => $accomplishment_status
                );
            }

            if ($total_accomplishments < 3 || $requirement_status == 0  ) {
                $data[$volunteer->id] = array(
                    "name" => $volunteer->last_name.', '.$volunteer->first_name.' '.$volunteer->middle_name,
                    "municipality" => $volunteer->name,
                    "requirement" => $requirement_status,
                    "accomplishments" => $accomplishments,
                    "total_accomplishments" => $total_accomplishments
                );
            }

        }

        return view('requirements.index', compact('page', 'data', 'active_quarter', 'months'));
        
    }

    public function incompletes_update(Request $request)
    {   
        DB::beginTransaction();
        try {

            $active_quarter = Quarter::find(Quarter::isActive());

            $has_requirement = Requirement::where([
                'volunteer_id' =>$request->volunteer_id,
                'quarter_id' =>$active_quarter->id
            ])->first();

            $requirement = ($has_requirement) ? $has_requirement : new Requirement;
            $requirement->quarter_id = $active_quarter->id;
            $requirement->volunteer_id = $request->volunteer_id;
            $requirement->completed = ($request->completed)? '1' : '0';
            $requirement->voters_id = ($request->voters_id) ? '1' : '0';
            $requirement->cedula = ($request->cedula) ? '1' : '0';
            $requirement->signature_bvw = ($request->signature_bvw) ? '1' : '0';
            $requirement->signature_mr = ($request->signature_mr) ? '1' : '0';
            $requirement->save();


            foreach ($request->months as $key => $month) {
                
                $has_accomplishment = Accomplishment::where([
                    'month'        => $month,
                    'volunteer_id' => $request->volunteer_id,
                    'quarter_id'   => $active_quarter->id
                ])->first();

                if ($has_accomplishment) {
                    $accomplishment = $has_accomplishment;
                }else{
                    $accomplishment = new Accomplishment;
                    $accomplishment->month = $month;
                    $accomplishment->year = $active_quarter->year;
                    $accomplishment->quarter_id = $active_quarter->id;
                    $accomplishment->volunteer_id = $request->volunteer_id;
                }
                
                $accomplishment->status = $request->status[$key];
                $accomplishment->save();

            }


            DB::commit();
            return redirect('/requirements/incompletes/')->with('success', 'Requirements and accomplishment successfully updated.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }


    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Requirement  $requirement
     * @return \Illuminate\Http\Response
     */
    public function show(Requirement $requirement)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Requirement  $requirement
     * @return \Illuminate\Http\Response
     */
    public function edit(Requirement $requirement)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Requirement  $requirement
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {

        $completed     = ($request->completed)     ? '1' : '0';
        $voters_id     = ($request->voters_id)     ? '1' : '0';
        $completed     = ($request->completed)     ? '1' : '0';
        $cedula        = ($request->cedula)        ? '1' : '0';
        $signature_bvw = ($request->signature_bvw) ? '1' : '0';
        $signature_mr  = ($request->signature_mr)  ? '1' : '0';

        $is_existing = Requirement::where('quarter_id', $request->quarter_id)
            ->where('volunteer_id', $request->volunteer_id)
            ->get();

        DB::beginTransaction();
        try {

            if($is_existing->count() == 0){

                $requirement = new Requirement;
                $requirement->volunteer_id = $request->volunteer_id;
                $requirement->quarter_id = $request->quarter_id;
                $requirement->completed = $completed;
                $requirement->voters_id = $voters_id;
                $requirement->cedula = $cedula;
                $requirement->signature_bvw = $signature_bvw;
                $requirement->signature_mr = $signature_mr;
                $requirement->save();

                AuditTrail::createTrail("New requirements.", $requirement);
                
            }else{

                $requirement = Requirement::where('id', $is_existing[0]->id)
                ->update([
                    'completed' => $completed,
                    'voters_id' => $voters_id,
                    'cedula' => $cedula,
                    'signature_bvw' => $signature_bvw,
                    'signature_mr' => $signature_mr,
                    'volunteer_id' => $request->volunteer_id,
                    'quarter_id' => $request->quarter_id
                ]);

                AuditTrail::createTrail("Update requirements.", json_encode($request->all()));
            }
            DB::commit();
            return redirect('/volunteers/'.$request->volunteer_id)->with('success', 'Requirement successfully updated.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
                 

        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Requirement  $requirement
     * @return \Illuminate\Http\Response
     */
    public function destroy(Requirement $requirement)
    {
        //
    }
}
