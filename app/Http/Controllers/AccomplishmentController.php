<?php

namespace App\Http\Controllers;

use App\Models\AuditTrail;
use App\Models\Accomplishment;
use Illuminate\Http\Request;

class AccomplishmentController extends Controller
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
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Accomplishment  $accomplishment
     * @return \Illuminate\Http\Response
     */
    public function show(Accomplishment $accomplishment)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Accomplishment  $accomplishment
     * @return \Illuminate\Http\Response
     */
    public function edit(Accomplishment $accomplishment)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Accomplishment  $accomplishment
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        
        $year = date("Y");

        $is_existing = Accomplishment::where('month', $request->month)
            ->where('year', $year)
            ->where('volunteer_id', $request->volunteer_id)
            ->where('quarter_id', $request->quarter_id)
            ->get();

        if($is_existing->count() == 0){

            $accomplishment = new Accomplishment;
            $accomplishment->volunteer_id = $request->volunteer_id;
            $accomplishment->quarter_id = $request->quarter_id;
            $accomplishment->status = $request->status;
            $accomplishment->month = $request->month;
            $accomplishment->year = $year;
            $accomplishment->save();

            AuditTrail::createTrail("Create new accomplishment.", $accomplishment);

        }else{

            $update = Accomplishment::where('id', $is_existing[0]->id)
            ->update([
                'status' => $request->status,
            ]);
            AuditTrail::createTrail("Update accomplishment.", json_encode($request->all()));
        }

        return redirect('/volunteers/'.$request->volunteer_id)->with('success', 'Accomplishment successfully updated.');
        
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Accomplishment  $accomplishment
     * @return \Illuminate\Http\Response
     */
    public function destroy(Accomplishment $accomplishment)
    {
        //
    }
}
