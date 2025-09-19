<?php

namespace App\Http\Controllers;

use App\Models\Signatory;
use App\Models\AuditTrail;
use App\Models\Signatories;
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
        $user = Auth::user();
        $classification = $user->classification;
        $municipality_code = $user->assigned_muni_code;
        $base_data = Signatories::where('deleted_at', null)
            ->when($classification == "Encoder", function ($query) use ($municipality_code) {
                $query->where(function ($query) use ($municipality_code) {
                    $query->where('municipality_code', $municipality_code);
                });
            })
            ->when($classification == "System Administrator", function ($query) {
                $query->where(function ($query) {
                    $query->where('municipality_code', null);
                });
            });

        $pagination = pagination($request, $base_data);

        $signatories = (clone $base_data)->offset($pagination['offset'])->limit($pagination['limit'])->get();
        $current_data_count = $signatories->count();
        $pagination = pageInfo($pagination, $current_data_count);
        $signatories->map(function ($s) {
            $designation = $s->designation_id;
            switch ($designation) {
                case "1":
                    $s->designation = "Office Head";
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

        return response()->json(compact('signatories', 'pagination'));
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
        [$user, $classification, $municipality_code] = user();
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
                $signatory->municipality_code = $classification == "System Administrator" ? null : $municipality_code;
                $signatory->save();

                AuditTrail::createTrail("Create Signatory", $signatory);

                if ($request->status == 1) {
                    Signatory::where('id', '<>', $signatory->id)
                        ->when($classification == "Encoder", function ($query) use ($municipality_code) {
                            $query->where(function ($query) use ($municipality_code) {
                                $query->where('municipality_code', $municipality_code);
                            });
                        })
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
        [$user, $classification, $municipality_code] = user();
        $is_existing = Signatory::where('name', $request->name)
            ->where('description', $request->description)
            ->where('designation_id', $request->designation_id)
            ->where('id', '<>', $signatory->id)
            ->get();

        if ($is_existing->count() == 0) {

            DB::beginTransaction();
            try {
                Signatory::where('id', $signatory->id)
                    ->when($classification == "Encoder", function ($query) use ($municipality_code) {
                        $query->where(function ($query) use ($municipality_code) {
                            $query->where('municipality_code', $municipality_code);
                        });
                    })
                    ->when($classification == "System Administrator", function ($query) {
                        $query->where(function ($query) {
                            $query->where('municipality_code', null);
                        });
                    })
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
                        ->when($classification == "Encoder", function ($query) use ($municipality_code) {
                            $query->where(function ($query) use ($municipality_code) {
                                $query->where('municipality_code', $municipality_code);
                            });
                        })
                        ->when($classification == "System Administrator", function ($query) {
                            $query->where(function ($query) {
                                $query->where('municipality_code', null);
                            });
                        })
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
