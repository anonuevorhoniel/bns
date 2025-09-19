<?php

namespace App\Http\Controllers;

use App\Models\Rate;
use App\Models\AuditTrail;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\Calculation\Financial\Securities\Rates;

class RateController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $rates = Rate::all();
        return response()->json(compact('rates'));
    }

    public function all(Request $request)
    {
        $base = Rate::query();
        $pagination = pagination($request, $base);
        $rates = (clone $base)->skip($pagination['offset'])->take($pagination['limit'])->get();
        $pagination = pageInfo($pagination, $rates->count());
        return response()->json(compact('rates', 'pagination'));
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
            'rate' => 'required',
        ]);

        $is_existing = Rate::where('rate', $request->rate);

        if ($is_existing->count() == 0) {
            DB::beginTransaction();
            try {

                $rate = new Rate;
                $rate->rate = $request->rate;
                $rate->save();

                AuditTrail::createTrail("Create Rate", $rate);

                DB::commit();
                return response()->json(['message' => "Rate Added"]);
            } catch (\Exception $e) {
                DB::rollBack();
                return  response()->json($e->getMessage(), 422);
            }
        } else {
           return response()->json(['message' => "Duplicate Entry"], 422);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Rate  $rate
     * @return \Illuminate\Http\Response
     */
    public function show(Rate $rate)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Rate  $rate
     * @return \Illuminate\Http\Response
     */
    public function edit(Rate $rate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Rate  $rate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validate = $request->validate([
            'rate' => 'required',
            'month' => 'required',
        ]);
        $year = substr($validate['month'], 0, -3);
        $month = substr($validate['month'], 5, 3);
        $rate_data = DB::table('tbl_rates')->where('id', $id)->limit(1);

        if (!$rate_data) {
            abort(404);
        }

        try {
            $rate_data->update([
                'rate' => $validate['rate'],
                'year' => $year,
                'month' => $month
            ]);
            return redirect()->back()->with('success', 'Updated Successfully');
        } catch (Exception $e) {
            return redirect()->back()->withErrors($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Rate  $rate
     * @return \Illuminate\Http\Response
     */
    public function destroy(Rate $rate)
    {
        try {
            $rate->delete();
            return response()->json(['success' => 'Deleted Successfully']);
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 422);
        }
    }
}
