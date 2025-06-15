<?php

namespace App\Http\Controllers;

use App\Models\ScholarTraining;
use Exception;
use App\Models\Training;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TrainingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $page = [
            'name'      =>  'Trainings',
            'title'     =>  'Training Management',
            'crumb'     =>  array('Trainings' => '/trainings')
        ];

        $trainings = Training::all();
        return view('trainings.index', compact('page', 'trainings'));
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
        $request->validate([
            'name' => 'required',
            'date' => 'required'
        ]);

        try {
            $training = new Training();
            $training->name = $request->name;
            $training->date = $request->date;
            $training->save();
            return redirect()->back()->with('success', 'Training Created');
        } catch (Exception $e) {
            return redirect()->back()->withErrors($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Training  $training
     * @return \Illuminate\Http\Response
     */
    public function show(Training $training)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Training  $training
     * @return \Illuminate\Http\Response
     */
    public function edit(Training $training)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Training  $training
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $request->validate([
            'training_id' => 'required|exists:tbl_trainings,id',
            'name' => 'required',
            'date' => 'required'
        ]);

        try {
            DB::table('tbl_trainings')
                ->where('id', $request->training_id)
                ->update([
                    'name' => $request->name,
                    'date' => $request->date
                ]);
            return redirect()->back()->with('success', 'Training Updated');
        } catch (Exception $e) {
            return redirect()->back()->withErrors($e->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Training  $training
     * @return \Illuminate\Http\Response
     */
    public function destroy(Training $training)
    {
        //
    }

    public function members($id)
    {

        $training = Training::findOrFail($id);
        $members = DB::table('tbl_scholar_trainings as st')
            ->where('st.training_id', $id)
            ->leftJoin('tbl_scholars as s', 's.id', 'st.scholar_id')
            ->select('s.id as id', DB::raw('CONCAT(s.first_name, " " , COALESCE(s.middle_name, ""), " " , s.last_name) as full_name'))
            ->get();

        $page = [
            'name'      =>  $training->name,
            'title'     =>  'Member Management',
            'crumb'     =>  array('Members' => '/members')
        ];

        return view('trainings.show', compact('page', 'members', 'training'));
    }

    public function members_store(Request $request, $id)
    {
        $request->validate([
            'added_members' => 'required|exists:tbl_scholars,id'
        ]);

        Training::findOrFail($id);
        $added_members = $request->added_members;
        $members_added = 0;
        foreach ($added_members as $key => $member) {
            $exists = DB::table('tbl_scholar_trainings')
                ->where('training_id', $id)
                ->where('scholar_id', $member)
                ->first();
            if (!$exists) {
                try {
                    $scholar_training = new ScholarTraining();
                    $scholar_training->scholar_id = $member;
                    $scholar_training->training_id = $id;
                    $scholar_training->save();
                    $members_added++;
                } catch (\Exception $e) {
                    return redirect()->back()->withErrors($e->getMessage());
                }
            }
        }
        return redirect()->back()->with('success', $members_added . ' Members Added Successfully');
    }

    public function members_destroy(Request $request, $id)
    {
        try {
            DB::table('tbl_scholar_trainings')
                ->where('training_id', $id)
                ->where('scholar_id', $request->scholar_id)
                ->delete();
            return redirect()->back()->with('success', 'Member Removed Successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors($e->getMessage());
        }
    }
    public function members_batch_destroy(Request $request, $id)
    {
        Training::findOrFail($id);
        $request->validate([
            'member_id' => 'exists:tbl_scholars,id'
        ]);
        $members = $request->member_id;
        try {
            DB::table('tbl_scholar_trainings')
                ->whereIn('scholar_id', $members)
                ->delete();
            return redirect()->back()->with('success', 'Members Removed Successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors($e->getMessage());
        }
    }
}
