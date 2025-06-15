<?php

namespace App\Http\Controllers;

use App\Models\Quarter;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class QuarterController extends Controller
{

    public function index()
    {
        $page = [
            'name'      =>  'Settings',
            'title'     =>  'Quarters',
            'crumb' =>  array('Settings' => '', 'Quarter Management' => '')
        ];

        $quarters = Quarter::QUARTERS;
        $all_quarters = Quarter::all();
        $current_year = Quarter::currentYear();
        $years = Quarter::years();
        $current_quarter = Quarter::currentQuarter();


        return view('quarters.index', compact('page', 'all_quarters', 'quarters', 'current_year', 'current_quarter', 'years'));
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
        $this->validate($request, [
            'year' => 'required',
            'quarter' => 'required',
            'status' => 'required'
        ]);

        $is_existing = Quarter::where('year', $request->year)
            ->where('quarter', $request->quarter)
            ->get();

        if ($is_existing->count() == 0) {

            DB::beginTransaction();
            try {

                $quarter = new Quarter;
                $quarter->year = $request->year;
                $quarter->quarter = $request->quarter;
                $quarter->status = $request->status;
                $quarter->save();

                AuditTrail::createTrail("Create Quarter", $quarter);

                if ($request->status == 1) {
                    $update_quarter = Quarter::where('id', '<>', $quarter->id)
                        ->update(['status' => '0']);

                    AuditTrail::createTrail("Update Active Quarter", $quarter);
                }

                DB::commit();
                return back()->withSuccess('A new quarter has been added.');
            } catch (\Exception $e) {
                DB::rollBack();
                return back()->withErrors($e->getMessage());
            }
        } else {
            return back()->withErrors("Duplicate Entry!");
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Quarter  $quarter
     * @return \Illuminate\Http\Response
     */
    public function show(Quarter $quarter)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Quarter  $quarter
     * @return \Illuminate\Http\Response
     */
    public function edit(Quarter $quarter)
    {
        //
    }

    /**
     * j the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Quarter  $quarter
     * @return \Illuminate\Http\Response
     */
    public function update(Quarter $quarter)
    {
        $deactivate = Quarter::where('id', '<>', $quarter->id)
            ->update(['status' => '0']);

        $activate = Quarter::where('id',  $quarter->id)
            ->update(['status' => '1']);

        $details = $quarter->id . ' ' . $quarter->quarter . ' ' . $quarter->year;

        AuditTrail::createTrail("Update Active Quarter", $details);
        return back()->withSuccess('Quarter has been activated!');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Quarter  $quarter
     * @return \Illuminate\Http\Response
     */
    public function destroy(Quarter $quarter)
    {
        //
    }
}
