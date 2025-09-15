<?php

namespace App\Services\Scholars;

use App\Models\Eligibility;
use App\Models\Scholar;
use App\Models\ScholarTraining;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ScholarIndexService
{
    public function main($request)
    {
        $base = $this->base($request);
        $pagination = pagination($request, $base);
        $get_scholars = $this->query($base, $pagination);
        $get_scholars = $this->scholarMap($get_scholars);
        $current_scholar_count = $get_scholars->count();
        $pagination = pageInfo($pagination, $current_scholar_count);
        $except_scholar_id = $request->except_scholar_id;

        $data = compact('get_scholars', 'pagination', 'except_scholar_id');
        return $data;
    }

    private function base($request)
    {
        $search = $request->search;
        $scholarStatus = $request->scholarStatus;
        $except_scholar_id = $request->except_scholar_id;
        $data = DB::table('tbl_scholars')
            ->select('tbl_scholars.*', 'tbl_scholars.id as id')
            ->when($except_scholar_id, function ($q) use ($except_scholar_id) {
                $q->where(function ($q) use ($except_scholar_id) {
                    $q->whereNot('tbl_scholars.id', $except_scholar_id);
                });
            })
            ->when($scholarStatus == 'inactive', function ($q) {
                $q->where(function ($q) {
                    $q->where('tbl_scholars.replaced', 1);
                });
            })
            ->when($scholarStatus == 'active' || $scholarStatus == null, function ($q) {
                $q->where(function ($q) {
                    $q->where('tbl_scholars.replaced', 0);
                });
            })
            ->when($request->code, function ($q) use ($request) {
                $q->where(function ($q) use ($request) {
                    $q->where('tbl_scholars.citymuni_id', $request->code);
                });
            })
            ->when(!$request->code, function ($q) {
                $q->where(function ($q) {
                    if (Auth::user()->assigned_muni_code) {
                        $q->where('tbl_scholars.citymuni_id', Auth::user()->assigned_muni_code);
                    }
                });
            })
            ->leftJoin('tbl_municipalities as m', 'm.code', 'tbl_scholars.citymuni_id')
            ->leftjoin('tbl_barangays as b', 'b.code', 'tbl_scholars.barangay_id')
            ->when($request->filled('search'), function ($q) use ($search) {
                $q->where(function ($q) use ($search) {
                    $q->where('tbl_scholars.first_name', 'LIKE', "%$search%")
                        ->orWhere('tbl_scholars.middle_name', 'LIKE', "%$search%")
                        ->orWhere('tbl_scholars.last_name', 'LIKE', "%$search%")
                        ->orWhere('tbl_scholars.fund', 'LIKE', "%$search%")
                        ->orWhere('b.name', 'LIKE', "%$search%")
                        ->orWhere('m.name', 'LIKE', "%$search%");
                });
            });

        return $data;
    }

    private function query($base, $pagination)
    {
        $data = $base
            ->limit($pagination['limit'])
            ->offset($pagination['offset'])
            ->select(
                'tbl_scholars.*',
                'm.name as municity_name',
                DB::raw('CONCAT(tbl_scholars.last_name, ", " , tbl_scholars.first_name, " ", COALESCE(tbl_scholars.middle_name, "")) as full_name'),
                'b.name as barangay_name',
            )

            ->orderBy('tbl_scholars.last_name', 'asc')
            ->get();

        return $data;
    }

    private function scholarMap($data,)
    {
        $data = $data->map(function ($scholar) {
            $scholar->trainings = ScholarTraining::where('scholar_id', $scholar->id)->get();
            $scholar->eligibilities = Eligibility::where('scholar_id', $scholar->id)->get()->map(function ($scholar) {
                $scholar->date = Carbon::parse($scholar->date)->format('F j, Y');
                return $scholar;
            });
            $scholar->replaced_scholar = Scholar::select(
                DB::raw('CONCAT(first_name, " ", COALESCE(middle_name, ""), " ", last_name) as full_name')
            )->find($scholar->replaced_scholar_id);

            return $scholar;
        });
        return $data;
    }
}
