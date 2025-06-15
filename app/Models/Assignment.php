<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Auth;

class Assignment extends Model
{

    protected $table = 'tbl_assignments';

    public static function getMunicipalities()
    {

        // $classification = Auth::user()->classification;
        // switch ($classification) {
        //     case 'System Administrator':
        //         $municipalities = Municipality::all();
        //         break;
        //     case 'Office Administrator':
        //         $municipalities = Municipality::all();
        //         break;
        //     case 'Municipal Representative':
        //         $representative = MunicipalRepresentative::where('user_id', Auth::user()->id)->first();
        //         $volunteer = Volunteer::find($representative->volunteer_id);
        //         $municipalities = Municipality::where('code', $volunteer->municipality_code)->get();
        //         break;
        //     case 'Field Officer':
        //         $assignment = Assignment::select('municipality_code')
        //             ->where('user_id', Auth::user()->id)
        //             ->get();
        //         $ids = array();
        //         foreach ($assignment as $key => $row) {
        //             $ids[] = $row->municipality_code;
        //         }
        //         $municipalities = Municipality::whereIn('code', $ids)->get();
        //         break;
        //     default:
        //         $municipalities = array();
        //         break;
        // }
        $municipalities = Municipality::all();

        return $municipalities;
    }
}
