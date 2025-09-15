<?php

namespace App\Services\Scholars;

use App\Models\Barangay;
use App\Models\Eligibility;
use App\Models\Scholar;
use App\Models\ScholarTraining;
use App\Models\ServicePeriod;
use Exception;
use Illuminate\Support\Facades\DB;

class ScholarUpdateService
{
    public function ifRep($request, $scholar)
    {
        if ($request->replacement_date != null && $request->replacement_date != "" &&  $request->replaced_scholar_id != null && $request->replaced_scholar_id != "") {
            Scholar::find($request->replaced_scholar_id)->update(['replaced' => 1]);

            //kapag iniba or wala ng replaced_scholar_id, hindi na replaced yung dati
            if ($scholar->replaced_scholar_id != $request->replaced_scholar_id) {
                Scholar::find($scholar->replaced_scholar_id)->update(['replaced' => 0]);
            }

            $scholar->update([
                'replacement_date' => $request->replacement_date,
                'replaced_scholar_id' => $request->replaced_scholar_id,
            ]);
        }
    }

    public function ifNotRep($scholar)
    {
        $replaced = Scholar::find($scholar->replaced_scholar_id);
        $replaced && $replaced->update(['replaced' => 0]);
        $scholar->update([
            'replacement_date' => null,
            'replaced_scholar_id' => null,
        ]);
    }

    public function servicePeriodStore($scholar, $request)
    {
        if ($request->service_period_status == "new_service_period") {
            $month_from =  date('m', strtotime($request->first_employment_date));
            $year_from =  date('Y', strtotime($request->first_employment_date));

            $sp = new ServicePeriod();
            $sp->scholar_id = $scholar->id;
            $sp->month_from = $month_from;
            $sp->year_from = $year_from;
            $sp->month_to = $request->replacement_date ?  date('m', strtotime($request->replacement_date)) : 0;
            $sp->year_to =  $request->replacement_date ?  date('Y', strtotime($request->replacement_date)) : 0;
            $sp->status =  $request->replacement_date ? 'specific' : 'present';
            $sp->save();
        }
    }

    public function updateServicePeriod($scholar, $request)
    {
        if ($request->service_period_status == "update_service_period") {
            $month_from =  date('m', strtotime($request->first_employment_date));
            $year_from =  date('Y', strtotime($request->first_employment_date));
            $max_id =  ServicePeriod::where('scholar_id', $request->replaced_scholar_id)->max('id');

            if ($max_id) {
                DB::table('tbl_service_periods')
                    ->where('scholar_id', $scholar->id)
                    ->where('id', $max_id)
                    ->update([
                        'month_from' => $month_from,
                        'year_from' => $year_from,
                        'month_to' => $request->replacement_date ?  date('m', strtotime($request->replacement_date)) : 0,
                        'year_to' =>  $request->replacement_date ?  date('Y', strtotime($request->replacement_date)) : 0,
                        'status' => $request->replacement_date ? 'specific' : 'present'
                    ]);
            }
        }
    }

    public function getBarangay($request)
    {
        $barangay = Barangay::where('code', $request->barangay_id)
            ->first();
        return $barangay;
    }

    public function updateScholar($scholar, $replacement, $place_of_assignment, $request)
    {
        $scholar->update([
            'first_name' => $request->first_name ?? null,
            'middle_name' => $request->middle_name ?? null,
            'last_name' => $request->last_name ?? null,
            'name_extension' => $request->name_extension ?? null,
            'name_on_id' => $request->name_on_id ?? null,
            'id_no' => $request->id_no ?? null,
            'citymuni_id' => $request->citymuni_id ?? null,
            'bns_type' => $request->bns_type ?? null,
            'barangay_id' => $request->barangay_id ?? null,
            'complete_address' => $request->complete_address ?? null,
            'sex' => $request->sex ?? null,
            'birth_date' => $request->birth_date ?? null,
            'civil_status' => $request->civil_status ?? null,
            'educational_attainment' => $request->educational_attainment ?? null,
            'benificiary_name' => $request->benificiary_name ?? null,
            'relationship' => $request->relationship ?? null,
            'district_id' => $request->district_id ?? null,
            'classification' => $request->classification ?? null,
            'philhealth_no' => $request->philhealth_no ?? null,
            'first_employment_date' => $request->first_employment_date ?? null,
            'replacement_date' => $replacement,
            'contact_number' => $request->contact_number ?? null,
            'status' => $request->status ?? null,
            'place_of_assignment' => $place_of_assignment,
            'fund' => $request->fund ?? null,
            'incentive_prov' => $request->incentive_prov ?? null,
            'incentive_mun' => $request->incentive_mun ?? null,
            'incentive_brgy' => $request->incentive_brgy ?? null,
        ]);
    }

    public function deleteEligibilityTraining($scholar)
    {
        DB::table('tbl_eligibilities')
            ->where('scholar_id', $scholar->id)
            ->delete();

        DB::table('tbl_scholar_trainings')
            ->where('scholar_id', $scholar->id)
            ->delete();
    }

    public function eligibilityStore($request, $scholar)
    {
        $eligibilities = $request->eligibilities;
        if ($eligibilities && count($eligibilities) > 0) {
            foreach ($eligibilities as $el) {
                $eligibility = new Eligibility();
                $eligibility->scholar_id = $scholar->id;
                $eligibility->date = $el["date"];
                $eligibility->name = $el["name"];
                $eligibility->number = $el["number"];
                $eligibility->save();
            }
        }
    }

    public function trainingStore($request, $scholar)
    {
        $trainings = $request->trainings;
        if ($trainings) {
            foreach ($trainings as $t) {
                $training = new ScholarTraining();
                $training->scholar_id = $scholar->id;
                $training->name = $t['name'];
                $training->from_date = $t['from_date'];
                $training->to_date = $t['to_date'];
                $training->trainor = $t['trainor'];
                $training->save();
            }
        }
    }
}
