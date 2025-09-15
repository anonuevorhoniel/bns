<?php

namespace App\Services\ServicePeriods;

use App\Models\Assignment;
use Illuminate\Support\Facades\DB;

class ServicePeriodIndexService
{
    public function main($request)
    {
        $page = $request->page;
        $search = $request->search;
        $municipalities = Assignment::getMunicipalities()->toArray();
        $municipality_codes = array_column($municipalities, 'code');

        $base = $this->base($request);
        $pagination = pagination($request, $base->pluck('v.id'));
        $scholars = $base->offset($pagination['offset'])->limit($pagination['limit'])->get();
        $pagination = pageInfo($pagination, $scholars->count());
        $scholars = $this->mapQuery($scholars);

        $data = compact('scholars', 'pagination');
        return $data;
    }

    private function base($request)
    {
        $search = $request->search;
        $municipalities = Assignment::getMunicipalities()->toArray();
        $municipality_codes = array_column($municipalities, 'code');
        $data = DB::table('tbl_scholars as v')
            ->join('tbl_service_periods as sp', 'sp.scholar_id', 'v.id')
            ->where('sp.deleted_at', null)
            ->leftJoin('tbl_municipalities as m', 'v.citymuni_id', 'm.code')
            ->whereIn('v.citymuni_id', $municipality_codes)
            ->when($search, function ($q) use ($search) {
                $q->where('v.first_name', 'like', "$search%")
                    ->orWhere('v.middle_name', 'like', "$search%")
                    ->orWhere('v.last_name', 'like', "$search%")
                    ->orWhere('m.name', 'like', "$search%");
            })
            ->groupBy(['v.id', 'v.first_name', 'v.middle_name', 'v.last_name', 'v.name_extension', 'm.name', 'v.fund'])
            ->select('v.id as id', DB::raw('CONCAT(v.last_name, " ", COALESCE(v.middle_name, " "), " ", v.first_name, " ", COALESCE(v.name_extension, " ")) as full_name '), 'm.name', 'v.fund');

        return $data;
    }

    private function mapQuery($scholars)
    {
        $data = $scholars->map(function ($scholar) {
            $recent_period = DB::table('tbl_service_periods')
                ->where('scholar_id', $scholar->id)
                ->orderBy('created_at', 'desc')
                ->where('deleted_at', null)
                ->first();

            $from = date('F Y', strtotime("$recent_period->year_from-$recent_period->month_from"));
            $to = $recent_period->status == "present" ? "Present" : date('F Y', strtotime("$recent_period->year_to-$recent_period->month_to"));
            $scholar->recent_period = "$from - $to";

            return $scholar;
        });

        return $data;
    }
}
