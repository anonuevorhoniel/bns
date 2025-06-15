<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

use App\Models\Municipality;
use App\Models\ServicePeriod;
use Carbon\Carbon;

class Volunteer extends Model
{
    // use Notifiable, SoftDeletes;
	use SoftDeletes;
    protected $table = 'tbl_volunteers';

    public static function totalVolunteer(){
    	$breakdowns = Municipality::countVolunteers();
    	$total = 0;
    	foreach ($breakdowns as $key => $breakdown) {
    		$total += $breakdown['count'];
    	}
    	return $total;
    }

	public static function getServicePeriodPerRange($parameters){
		
		// Parameters From and To Format = yyyy-mm , from input type month
		$service_periods = ServicePeriod::where("volunteer_id", $parameters['volunteer_id'])
			->where("year_from", explode('-', $parameters['from'])[0])
			->get();
		
		$result = array();
		$month_from = explode('-', $parameters['from'])[1];
		$month_to = explode('-', $parameters['to'])[1];
		
		if($service_periods->count() > 0){
			
			$get_months = array();
			foreach ($service_periods as  $service_period) {
				$length = ($service_period->status == "present") ? Carbon::now()->month : $service_period->month_to;
				$x[] = $length;
				for ($i=$service_period->month_from; $i <= $length ; $i++) {
					if($i){ array_push($get_months, (int)$i);}
				}
			}

			foreach ($get_months as $key => $month) {
				if($month >= $month_from && $month <= $month_to){
					$result[] = $month;
				}
			}
		}
		
		
		return $result;

	}
}
