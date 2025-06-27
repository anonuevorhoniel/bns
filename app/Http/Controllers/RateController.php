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
        return response()->json(compact( 'rates'));
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
            'month' => 'required'
        ]);


        $date = explode('-', $request->month); # [0] year [1] month

        $is_existing = Rate::where('year', $date[0])
            ->where('month', $date[1])
            ->where('rate', $request->rate)
            ->get();


        if ($is_existing->count() == 0) {

            DB::beginTransaction();
            try {

                $rate = new Rate;
                $rate->year = $date[0];
                $rate->rate = $request->rate;
                $rate->month = $date[1];
                $rate->save();

                AuditTrail::createTrail("Create Rate", $rate);

                DB::commit();
                return back()->withSuccess('A new rate has been added.');
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
    public function destroy($id)
    {
        $rate = Rate::find($id);
        if (!$rate) {
            abort(404);
        }
        try {
            $rate->delete();
            return redirect()->back()->with('success', 'Deleted Successfully');
        } catch (Exception $e) {
            return redirect()->back()->withErrors($e->getMessage());
        }
    }
}
