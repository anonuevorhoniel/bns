<?php

namespace App\Services\API;

use App\Models\Scholar;
use App\Models\ServicePeriod;
use Illuminate\Support\Facades\DB;

class ApiGetScholarService
{
    public function main($request)
    {
        $scholars = $this->scholarQuery($request);
        $results = $this->scholarModification($scholars, $request);
        $page = $request->page;
        $limit = 8;
        $total = count($results);
        $offset = ($page - 1) * $limit;
        $total_page = ceil($total / $limit);
        $pagination = compact('limit', 'total', 'offset', 'total_page');
        $year_from = date('Y', strtotime($request->from));
        $year_to = date('Y', strtotime($request->to));
        $scholar_ids = array_column($results, 'id');
        $results = array_slice($results, $offset, $limit);
        $pagination = pageInfo($pagination, count($results));

        $data = compact('results', 'pagination', 'scholar_ids');
        return $data;
    }

    private function scholarQuery($request)
    {
        $fund = $request->fund;
        $data = DB::table('tbl_scholars as s')
            ->select('s.id as id', 's.*', 'b.name', DB::raw('CONCAT(s.last_name, ", ", s.first_name, " ", s.middle_name) as full_name'))
            ->leftJoin('tbl_barangays as b', 's.barangay_id', 'b.code')
            ->where('s.citymuni_id', $request->municipality_code)
            ->where(function ($q) use ($fund) {
                $q->where('fund', 'like', "%$fund%")
                    ->orWhere('fund', 'like', "%BOTH%");
            })
            ->where('s.deleted_at', null)
            ->orderBy('s.last_name')
            ->get();

        return $data;
    }

    private function scholarModification($scholars, $request)
    {
        $year_from = date('Y', strtotime($request->from));
        $year_to = date('Y', strtotime($request->to));
        $results = array();
        $months_array = months();

        foreach ($scholars as $scholar) {
            $months = ServicePeriod::where('scholar_id', $scholar->id)->first();
            $parameters = array(
                "scholar_id" => $scholar->id,
                "from" => $request->from,
                "to" => $request->to,
                "year_from" => $year_from,
                "year_to" => $year_to,
            );
            $service_period = Scholar::getServicePeriodPerRange($parameters);

            if (sizeOf($service_period) > 0) {
                $months_to = intval($months->month_to) > 0 ? $months_array[intval($months->month_to) - 1] : 'Present';
                $results[] = array(
                    "id" => $scholar->id,
                    "name" => $scholar->last_name . ', ' . $scholar->first_name . ' ' . $scholar->middle_name,
                    "barangay" => $scholar->name,
                    'months' => $months_array[intval($months->month_from) - 1] . ' ' . $months->year_from . ' - ' . $months_to
                );
            }
        }
        return $results;
    }
}
