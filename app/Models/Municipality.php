<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Models\Volunteer;
use App\Models\Quarter;

class Municipality extends Model
{
    const DISTRICTS = array(
        '0' => array(
            'district_no' => "1",
            'description' => "District 1"
        ),
        '1' => array(
            'district_no' => "2",
            'description' => "District 2"
        ),
        '2' => array(
            'district_no' => "3",
            'description' => "District 3"
        ),
        '3' => array(
            'district_no' => "4",
            'description' => "District 4"
        ),
    );

    protected $table = 'tbl_municipalities';

    public static function assignments()
    {
        $municipalities = Municipality::all();
        return $municipalities;
    }

    public function scholars() {
        return $this->hasMany(Scholar::class, 'citymuni_id', 'code');
    }

    public static function code($key)
    {
        $key = (int)$key;
        $codes = array(
            "43401" => "ALA",
            "43402" => "BAY",
            "43403" => "BNN",
            "43404" => "CAB",
            "43405" => "CAL",
            "43406" => "CLN",
            "43407" => "CAV",
            "43408" => "FMY",
            "43409" => "KAL",
            "43410" => "LLW",
            "43411" => "LB",
            "43412" => "LSN",
            "43413" => "LUM",
            "43414" => "MBC",
            "43415" => "MAG",
            "43416" => "MJY",
            "43417" => "NAG",
            "43418" => "PAE",
            "43419" => "PAK",
            "43421" => "PNL",
            "43423" => "RZL",
            "43424" => "SPC",
            "43425" => "SPL",
            "43426" => "STC",
            "43427" => "STM",
            "43428" => "STR",
            "43429" => "SIN",
            "43430" => "VIC"
        );

        return $codes[$key];
    }
}
