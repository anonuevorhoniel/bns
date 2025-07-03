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
        $data = DB::table('tbl_audit_trails as t')
            ->select(
                'u.name',
                't.id',
                't.created_at',
                't.action',
                't.description'

            )
            ->leftJoin('tbl_users as u', 't.user_id', 'u.id')
            ->when($search, function ($q) use ($search) {
                $q->where(function ($r) use ($search) {
                    $r->where('u.name', 'like', "$search%")
                        ->orWhere('t.action', 'like', "$search%");
                });
            });

        $page = $request->page;
        $limit = 8;
        $total_data = (clone $data)->get()->count();
        $total_page = ceil($total_data / $limit);
        $offset = ($page - 1) * $limit;

        $trails = (clone $data)
            ->limit($limit)->offset($offset)->get();
        $pages = compact('page', 'limit', 'total_data', 'total_page', 'offset');

        return response()->json(compact('trails', 'pages'));
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
