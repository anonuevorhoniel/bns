<?php

namespace App\Http\Controllers;

use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AuditTrailController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $search = $request->search;
        $data = AuditTrail::with(['user'])
            ->when($search, function ($query) use ($search) {
                $query->whereHas('user', function ($query) use ($search) {
                    $query->where('name', 'like', "%$search%");
                });
            });

        $pagination = pagination($request, $data);

        $trails = (clone $data)
            ->take($pagination['limit'])->skip($pagination['offset'])
            ->orderBy('created_at', 'desc')->get();
        $pagination = pageInfo($pagination, $trails->count());
        return response()->json(compact('trails', 'pagination'));
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
     * @param  \App\Models\AuditTrail  $auditTrail
     * @return \Illuminate\Http\Response
     */
    public function show(AuditTrail $auditTrail)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\AuditTrail  $auditTrail
     * @return \Illuminate\Http\Response
     */
    public function edit(AuditTrail $auditTrail)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\AuditTrail  $auditTrail
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, AuditTrail $auditTrail)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\AuditTrail  $auditTrail
     * @return \Illuminate\Http\Response
     */
    public function destroy(AuditTrail $auditTrail)
    {
        //
    }
}
