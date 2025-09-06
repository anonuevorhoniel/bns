<?php

namespace App\Services\Scholars;

use App\Models\AuditTrail;
use App\Models\Eligibility;
use App\Models\Scholar;
use App\Models\ScholarTraining;
use App\Models\ServicePeriod;
use Exception;
use Illuminate\Support\Facades\DB;

class ScholarStoreService
{
    public function main($request) {}

    public function eligibilityStore($eligibilities, $scholar)
    {
        foreach ($eligibilities as $el) {
            $eligibility = new Eligibility();
            $eligibility->scholar_id = $scholar->id;
            $eligibility->name = $el["value"];
            $eligibility->save();
        }
    }

    public function trainingStore($trainings, $scholar)
    {
        foreach ($trainings as $t) {
            $training = new ScholarTraining();
            $training->scholar_id = $scholar->id;
            $training->name = $t['name'];
            $training->date = $t['date'];
            $training->trainor = $t['trainor'];
            $training->save();
        }
    }

    public function servicePeriodStore($scholar, $request)
    {
        $sp = new ServicePeriod();
        $sp->volunteer_id = $scholar->id;
        $sp->month_from = date('m', strtotime($request->first_employment_date));
        $sp->year_from = date('Y', strtotime($request->first_employment_date));
        $sp->month_to = 0;
        $sp->year_to = 0;
        $sp->status = 'present';
        $sp->save();
    }

    public function storeScholar($request)
    {
        $scholar = new Scholar();
        $scholar->first_name = $request->first_name ?? null;
        $scholar->middle_name = $request->middle_name ?? null;
        $scholar->last_name = $request->last_name ?? null;
        $scholar->name_extension = $request->name_extension ?? null;
        $scholar->name_on_id = $request->name_on_id ?? null;
        $scholar->id_no = $request->id_no ?? null;
        $scholar->sex = $request->sex ?? null;
        $scholar->bns_type = $request->bns_type ?? null;
        $scholar->birth_date = $request->birth_date ?? null;
        $scholar->civil_status = $request->civil_status ?? null;
        $scholar->contact_number = $request->contact_number ?? null;
        $scholar->fund = $request->fund ?? null;
        $scholar->educational_attainment = $request->educational_attainment ?? null;
        $scholar->benificiary_name = $request->benificiary_name ?? null;
        $scholar->relationship = $request->relationship ?? null;
        $scholar->district_id = $request->district_id ?? null;
        $scholar->citymuni_id = $request->citymuni_id ?? null;
        $scholar->barangay_id = $request->barangay_id ?? null;
        $scholar->complete_address = $request->complete_address ?? null;
        $scholar->classification = $request->classification ?? null;
        $scholar->philhealth_no = $request->philhealth_no ?? null;
        $scholar->status = $request->status ?? null;
        $scholar->replaced_scholar_id = $replaced_scholar_id ?? null;
        $scholar->replacement_date = $request->replacement_date ?? null;
        $scholar->place_of_assignment = $this->placeOfAssignment($request, $scholar);
        $scholar->first_employment_date = $request->first_employment_date ?? null;
        $scholar->incentive_prov  = $request->incentive_prov ?? null;
        $scholar->incentive_mun = $request->incentive_mun ?? null;
        $scholar->incentive_brgy = $request->incentive_brgy ?? null;
        $scholar->save();

        return $scholar;
    }

    public function updateScholarReplaced($replaced_scholar_id, $scholar)
    {
        if ($replaced_scholar_id) {
            DB::table('tbl_scholars')
                ->where('id', $replaced_scholar_id)
                ->update([
                    'tbl_scholars.replaced' => 1,
                ]);
        }
    }

    public function placeOfAssignment($request)
    {
        if ($request->place_of_assignment == 'Same as Barangay') {
            $barangay = DB::table('tbl_barangays')
                ->where('code', $request->barangay_id)
                ->first();

            if (!$barangay) {
                return response()->json(['message' => 'Error in barangay_name'], 422);
            }
            return $barangay->name;
        }
        return 'BNS Coordinator';
    }
}
