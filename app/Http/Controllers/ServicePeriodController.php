<?php

namespace App\Http\Controllers;

use App\Models\ServicePeriod;
use App\Models\Municipality;
use App\Models\Assignment;
use App\Models\AuditTrail;
use App\Models\Volunteer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use DateTime;
class ServicePeriodController extends Controller
{
   
    public function index()
    {
        $page = [
            'name'      =>  'Settings',
            'title'     =>  'Service Period',
            'crumb' =>  array('Settings' => '', 'Service Period Management' => '')
        ];

        $municipalities = Assignment::getMunicipalities()->toArray();
        $municipality_codes = array_column($municipalities, 'code');

        $volunteers = DB::table('tbl_scholars as v')
            ->join('tbl_service_periods as sp', 'sp.volunteer_id', 'v.id')
            ->leftJoin('tbl_municipalities as m', 'v.citymuni_id', 'm.code')
            ->whereIn('v.citymuni_id', $municipality_codes)
            ->groupBy(['v.id', 'v.first_name', 'v.middle_name', 'v.last_name', 'v.name_extension', 'm.name'])
            ->select('v.id as volunteer_id','v.first_name', 'v.first_name', 'v.middle_name', 'v.last_name', 'v.name_extension', 'm.name')
            ->get();

        return view('service_periods.index', compact('page', 'volunteers'));
    }

    public function create()
    {
        $page = [
            'name'      =>  'Settings',
            'title'     =>  'Service Period',
            'crumb' =>  array(
                'Settings' => '', 
                'Service Period Management' => '/settings/service_periods', 
                'Add' => ''
            )
        ];

        $municipalities = Assignment::getMunicipalities();
        return view('service_periods.create', compact('page', 'municipalities'));
    }

    
    public function verify(Request $request)
    {
      

        $page = [
            'name'  =>  'Settings',
            'title' =>  'Service Period',
            'crumb' =>  array(
                'Settings' => '', 
                'Service Period Management' => '/settings/service_periods', 
                'Add' => '/service_periods/create',
                'Verify' => ''
            )
        ];
        
        

        if($request->to == "specific"){
            $get_to = explode('-', $request->specific_date);
            $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
            $to_month = $to_date->format('F'); // March
            $to = $to_month.' '.$get_to[0];
        }else{
            $to = "Present";
        }
        
        $get_from = explode('-', $request->from);
        $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
        $from_month = $from_date->format('F'); // March
        $from = $from_month.' '.$get_from[0];


        $members = array();
        foreach($request->members as $member){
            $volunteer = DB::table('tbl_volunteers as v')
                ->select(
                    'v.id as id',
                    'v.first_name', 'v.middle_name', 'v.last_name',
                    'm.name'
                )
                ->leftJoin('tbl_municipalities as m', 'v.municipality_code', 'm.code')
                ->where('v.id', $member)
                ->get();

            if($to == "Present"){
                $service_period = ServicePeriod::where('volunteer_id', $member)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from', $get_from[0])
                    ->get();

            }else{
               $service_period = ServicePeriod::where('volunteer_id', $member)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from',  $get_from[0])
                    ->where('month_to', '<=', $get_to[1])
                    ->where('year_to', $get_to[0])
                    ->get();
            }

            if($service_period->count() == 0){
                $conflict = "Clear";
                $remark = "Save Service Period.";
            }else{
                $conflict = "Conflict with other Service Period.";
                $remark = "Unsave Service Period.";
            }
            $members[] = array(
                'id' => $volunteer[0]->id,
                'municipality' => $volunteer[0]->name, 
                'volunteer' => $volunteer[0]->last_name.', '.$volunteer[0]->first_name.' '.$volunteer[0]->middle_name,
                'remark' => $remark,
                'conflict' => $conflict
            );
        }


        // dd($members);
        return view('service_periods.verify', compact('page', 'request', 'from', 'to', 'members'));
    }


    public function store(Request $request)
    {   
        // dd($request->all());
        $page = [
            'name'      =>  'Settings',
            'title'     =>  'Service Period',
            'crumb' =>  array(
                'Settings' => '', 
                'Service Period Management' => '/settings/service_periods', 
                'Add' => '/service_periods/create',
                'Verify' => ''
            )
        ];

        DB::beginTransaction();
        try {    
            $members = array();
            
            if($request->to == "specific"){
                $get_to = explode('-', $request->specific_date);
                $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
                $to_month = $to_date->format('F'); // March
                $to = $to_month.' '.$get_to[0];
                $month_to = $get_to[1]; 
                $year_to = $get_to[0];
            } else {
                $to = "Present";
                $month_to = 0;
                $year_to = 0;
            }
            
            $get_from = explode('-', $request->from);
            $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
            $from_month = $from_date->format('F'); // March
            $from = $from_month.' '.$get_from[0];


            foreach ($request->members as $volunteer_id) {

                $volunteer = DB::table('tbl_scholars as v')
                    ->select(
                        'v.id as id',
                        'v.first_name', 'v.middle_name', 'v.last_name',
                        'm.name'
                    )
                    ->leftJoin('tbl_municipalities as m', 'v.citymuni_id', 'm.code')
                    ->where('v.id', $volunteer_id)
                    ->get();

                if($to == "Present"){
                    $existing_period = ServicePeriod::where('volunteer_id', $volunteer_id)
                        ->where('month_from', '>=', $get_from[1])
                        ->where('year_from', '=', $get_from[0])
                        ->get();
                }else{
                   $existing_period = ServicePeriod::where('volunteer_id', $volunteer_id)
                        ->where('month_from', '>=', $get_from[1])
                        ->where('year_from',  $get_from[0])
                        ->where('month_to', '<=', $get_to[1])
                        ->where('year_to', $get_to[0])
                        ->get();
                }

                if($existing_period->count() == 0){
                    $conflict = "Clear";
                    $remark = "Save Service Period.";

                    // insert data.
                    $period    = new ServicePeriod;
                    $period->volunteer_id = $volunteer_id;
                    $period->month_from = $get_from[1];
                    $period->year_from = $get_from[0];
                    $period->month_to = $month_to;
                    $period->year_to = $year_to;
                    $period->status = $request->to;
                    $period->save();

                    AuditTrail::createTrail("Add service period", $period);

                }else{
                    $conflict = $existing_period[0]->month_from.'-'.$existing_period[0]->year_from
                        .' | '.$existing_period[0]->month_to.'-'.$existing_period[0]->year_to;
                    $remark = "Unsave Service Period.";
                }

                $members[] = array(
                    'id' => $volunteer[0]->id,
                    'municipality' => $volunteer[0]->name, 
                    'volunteer' => $volunteer[0]->last_name.', '.$volunteer[0]->first_name.' '.$volunteer[0]->middle_name,
                    'remark' => $remark,
                    'conflict' => $conflict
                );
            }

            DB::commit();
            return view('service_periods.verify', compact('page', 'request', 'from', 'to', 'members'));

        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }


    public function singleStore(Request $request){
       
        DB::beginTransaction();
        try {    

               
            $get_from = explode('-', $request->from);
            $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
            $from_month = $from_date->format('F'); // March
            $from = $from_month.' '.$get_from[0];


            if($request->to == "specific"){
                $get_to = explode('-', $request->specific_date);
                $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
                $to_month = $to_date->format('F'); // March
                $to = $to_month.' '.$get_to[0];
                $month_to = $get_to[1]; 
                $year_to = $get_to[0];
            }else{
                $to = "Present";
                $month_to = 0;
                $year_to = 0;
            }



            if($to == "Present"){
                $existing_period = ServicePeriod::where('volunteer_id', $request->volunteer_id)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from', '=', $get_from[0])
                    ->get();
            }else{
               $existing_period = ServicePeriod::where('volunteer_id', $request->volunteer_id)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from',  $get_from[0])
                    ->where('month_to', '<=', $get_to[1])
                    ->where('year_to', $get_to[0])
                    ->get();
            }
                
            if($existing_period->count() == 0){
              
                // insert data.
                $period    = new ServicePeriod;
                $period->volunteer_id = $request->volunteer_id;
                $period->month_from = $get_from[1];
                $period->year_from = $get_from[0];
                $period->month_to = $month_to;
                $period->year_to = $year_to;
                $period->status = $request->to;
                $period->save();

                AuditTrail::createTrail("Add service period", $period);
                
                DB::commit();
                return back()->withSuccess('Service Period has been added.');

            }else{

                $conflict = $existing_period[0]->month_from.'-'.$existing_period[0]->year_from
                    .' | '.$existing_period[0]->month_to.'-'.$existing_period[0]->year_to;
                
                return back()->withErrors('Conflict with Schedule - '.$conflict);
            }


            

        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }
   
    public function show($volunteer_id)
    {   

        $page = [
            'name'      =>  'Settings',
            'title'     =>  'Service Period',
            'crumb' =>  array(
                'Settings' => '', 
                'Service Period Management' => '/settings/service_periods', 
                'Show' => ''
            )
        ];
        $volunteer = DB::table('tbl_scholars')->where('id', $volunteer_id)->get();
        $volunteer = $volunteer[0];
        $service_periods = ServicePeriod::where('volunteer_id', $volunteer_id)
            ->get();


        return view('service_periods.show', compact('page', 'service_periods', 'volunteer'));
     
    }

  
    public function edit(ServicePeriod $servicePeriod)
    {
        //
    }

  
    public function update(Request $request)
    {   
        DB::beginTransaction();
        try {    

               
            $get_from = explode('-', $request->from);
            $from_date   = DateTime::createFromFormat('!m', $get_from[1]);
            $from_month = $from_date->format('F'); // March
            $from = $from_month.' '.$get_from[0];


            if($request->to == "specific"){
                $get_to = explode('-', $request->specific_date);
                $to_date   = DateTime::createFromFormat('!m', $get_to[1]);
                $to_month = $to_date->format('F'); // March
                $to = $to_month.' '.$get_to[0];
                $month_to = $get_to[1]; 
                $year_to = $get_to[0];
            }else{
                $to = "Present";
                $month_to = 0;
                $year_to = 0;
            }



            if($to == "Present"){
                $existing_period = ServicePeriod::where('volunteer_id', $request->volunteer_id)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from', '=', $get_from[0])
                    ->where('id', '<>', $request->id)
                    ->get();
            }else{
               $existing_period = ServicePeriod::where('volunteer_id', $request->volunteer_id)
                    ->where('month_from', '>=', $get_from[1])
                    ->where('year_from',  $get_from[0])
                    ->where('month_to', '<=', $get_to[1])
                    ->where('year_to', $get_to[0])
                    ->where('id', '<>', $request->id)
                    ->get();
            }
                
            if($existing_period->count() == 0){
              
                // insert data.
               
                $update_volunteer = ServicePeriod::where('id', $request->id)
                ->update([
                    'volunteer_id' => $request->volunteer_id,
                    'month_from' => $get_from[1],
                    'year_from' => $get_from[0],
                    'month_to' => $month_to,
                    'year_to' => $year_to,
                    'status' =>  $request->to
                ]);

                AuditTrail::createTrail("Update service period", $request);
                
                DB::commit();
                return back()->withSuccess('Service Period has been added.');

            }else{

                $conflict = $existing_period[0]->month_from.'-'.$existing_period[0]->year_from
                    .' | '.$existing_period[0]->month_to.'-'.$existing_period[0]->year_to;
                
                return back()->withErrors('Conflict with Schedule - '.$conflict);
            }


            

        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\ServicePeriod  $servicePeriod
     * @return \Illuminate\Http\Response
     */
    public function destroy(ServicePeriod $servicePeriod)
    {
        //
    }
}
