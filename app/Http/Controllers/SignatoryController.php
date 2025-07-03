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
    public function index(Request $request)
    {
        $page = $request->page;
        $base_data = DB::table('tbl_signatories')->where('deleted_at', null);
        $designations = Signatory::DESIGNATION; 
        $limit = 8;
        $total_data = (clone $base_data)->pluck('id')->count();
        $total_page = ceil($total_data / $limit);
        $offset = ($page - 1) * $limit;

        $signatories = (clone $base_data)->offset($offset)->limit($limit)->get();
        $current_data_count = $signatories->count();
        $signatories->map(function ($s) {
            $designation = $s->designation_id;
            switch ($designation) {
                case "1":
                    $s->designation = "Office Head";
                    break;
                case "2":
                    $s->designation = "Provincial Administrator";
                    break;
                case "3":
                    $s->designation = "Governor";
                    break;
                case "4":
                    $s->designation = "Provincial Accountant";
                    break;
                case "5":
                    $s->designation = "Chairman-Provincial Nutrition Comittee";
                    break;
                default:
                    $s->designation = "Provincial Account";
                    break;
            }
        });

        $page_info = compact('limit', 'total_data', 'offset', 'total_page', 'current_data_count');
        return response()->json(compact('signatories', 'page_info', 'designations'));
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
        $this->validate($request, [
            'name' => 'required',
            'description' => 'required',
            'designation_id' => 'required',
            'status' => 'required'
        ]);

        $is_existing = Signatory::where('name', $request->name)
            ->where('description', $request->description)
            ->where('designation_id', $request->designation_id)
            ->get();

        if ($is_existing->count() == 0) {

            DB::beginTransaction();
            try {

                $signatory = new Signatory;
                $signatory->name = $request->name;
                $signatory->description = $request->description;
                $signatory->designation_id = $request->designation_id;
                $signatory->status = $request->status;
                $signatory->save();

                AuditTrail::createTrail("Create Signatory", $signatory);

                if ($request->status == 1) {
                    $update_quarter = Signatory::where('id', '<>', $signatory->id)
                        ->where('designation_id', $request->designation_id)
                        ->update(['status' => '0']);

                    AuditTrail::createTrail("Update Active Signatory", $signatory);
                }

                DB::commit();
                return response()->json(['message' => 'A new signatory has been added.']);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json($e->getMessage(), 422);
            }
        } else {
           return response()->json(['message' => 'Duplicate Entry!'], 422);
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
        return response()->json(compact('signatory'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Signatory  $signatory
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Signatory $signatory)
    {
        $is_existing = Signatory::where('name', $request->name)
            ->where('description', $request->description)
            ->where('designation_id', $request->designation_id)
            ->where('id', '<>', $signatory->id)
            ->get();

        if ($is_existing->count() == 0) {

            DB::beginTransaction();
            try {

                Signatory::where('id', $signatory->id)
                    ->update([
                        'name' => $request->name,
                        'designation_id' => $request->designation_id,
                        'description' => $request->description,
                        'status' => $request->status,
                    ]);
                AuditTrail::createTrail("Update Signatory Details", $request);

                if ($request->status == 1) {
                    $update_quarter = Signatory::where('id', '<>', $signatory->id)
                        ->where('designation_id', $request->designation_id)
                        ->update(['status' => '0']);

                    AuditTrail::createTrail("Update Active Signatory", $request);
                }

                DB::commit();
                return response()->json(['message' => 'Signatory has been updated.']);
            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json($e->getMessage(), 422);
            }
        } else {
            return response()->json(['message' => "Duplicate Entry!"], 422);
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
