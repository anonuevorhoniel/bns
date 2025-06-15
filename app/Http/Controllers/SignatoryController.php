<?php

namespace App\Http\Controllers;

use App\Models\Signatory;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SignatoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
         $page = [
            'name'      =>  'Settings',
            'title'     =>  'Signatories',
            'crumb' =>  array('Settings' => '', 'Signatory Management' => '')
        ];
        
        $designations = Signatory::DESIGNATION;
        $signatories = Signatory::all();
        return view('signatories.index', compact('page', 'signatories', 'designations'));
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
        // dd($request);
        $this->validate($request,[
            'name' => 'required',
            'description' => 'required',
            'designation_id' => 'required',
            'status' => 'required'
        ]);

        $is_existing = Signatory::where('name', $request->name)
            ->where('description', $request->description)
            ->where('designation_id', $request->designation_id)
            ->get();

        if($is_existing->count() == 0){
            
            DB::beginTransaction();
            try {

                $signatory = new Signatory;
                $signatory->name = $request->name;
                $signatory->description = $request->description;
                $signatory->designation_id = $request->designation_id;
                $signatory->status = $request->status;
                $signatory->save();

                AuditTrail::createTrail("Create Signatory", $signatory);

                if($request->status == 1){
                    $update_quarter = Signatory::where('id', '<>', $signatory->id)
                        ->where('designation_id', $request->designation_id)
                        ->update([ 'status' => '0' ]);

                    AuditTrail::createTrail("Update Active Signatory", $signatory);
                }
                
                DB::commit();
                return back()->withSuccess('A new signatory has been added.');

            } catch (\Exception $e) {
                DB::rollBack();
                return back()->withErrors($e->getMessage());
            }
        }else{
            return back()->withErrors("Duplicate Entry!");
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Signatory  $signatory
     * @return \Illuminate\Http\Response
     */
    public function show(Signatory $signatory)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Signatory  $signatory
     * @return \Illuminate\Http\Response
     */
    public function edit(Signatory $signatory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Signatory  $signatory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $is_existing = Signatory::where('name', $request->name)
            ->where('description', $request->description)
            ->where('designation_id', $request->designation_id)
            ->where('id', '<>', $request->id)
            ->get();

        if($is_existing->count() == 0){
            
            DB::beginTransaction();
            try {

                Signatory::where('id', $request->id)
                ->update([
                    'name' => $request->name,
                    'designation_id' => $request->designation_id,
                    'description' => $request->description,
                    'status' => $request->status,
                ]);
                AuditTrail::createTrail("Update Signatory Details", $request);

                if($request->status == 1){
                    $update_quarter = Signatory::where('id', '<>', $request->id)
                        ->where('designation_id', $request->designation_id)
                        ->update([ 'status' => '0' ]);

                    AuditTrail::createTrail("Update Active Signatory", $request);
                }
                
                DB::commit();
                return back()->withSuccess('Signatory has been updated.');

            } catch (\Exception $e) {
                DB::rollBack();
                return back()->withErrors($e->getMessage());
            }
        }else{
            return back()->withErrors("Duplicate Entry!");
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Signatory  $signatory
     * @return \Illuminate\Http\Response
     */
    public function destroy(Signatory $signatory)
    {
        //
    }
}
