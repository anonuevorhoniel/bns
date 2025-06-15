<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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
       
        DB::beginTransaction();
        try {


            foreach ($request->municipalities as $code) {
                
                $existing = Assignment::where('municipality_code', $code)
                    ->where('user_id', $request->user_id)
                    ->get();
                if($existing->count() == 0){
                    $assignment = new Assignment;
                    $assignment->user_id = $request->user_id;
                    $assignment->municipality_code = $code; 
                    $assignment->save();
                }
                
                AuditTrail::createTrail("Add Assignment.", $assignment);
            }

            DB::commit();
            return back()->withSuccess('Assigned municipality has been added.');

        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
              
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Assignment  $assignment
     * @return \Illuminate\Http\Response
     */
    public function show(Assignment $assignment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Assignment  $assignment
     * @return \Illuminate\Http\Response
     */
    public function edit(Assignment $assignment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Assignment  $assignment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Assignment $assignment)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Assignment  $assignment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Assignment $assignment)
    {   
        
        AuditTrail::createTrail("Remove Assignment.", $assignment);
        DB::table('tbl_assignments')->delete($assignment->id);
        return back()->withSuccess('Assigned municipality has been removed!');

    }
}
