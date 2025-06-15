<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Scholar extends Model
{
	use HasFactory, SoftDeletes;
	protected $table = 'tbl_scholars';


	public static function getServicePeriodPerRange($parameters)
	{

		// Parameters From and To Format = yyyy-mm , from input type month
		$service_periods = ServicePeriod::where("volunteer_id", $parameters['volunteer_id'])
			->where("year_from", explode('-', $parameters['from'])[0])
			->get();

		$result = array();
		//explode para mapaghiwalay yung for example '2025-03' maging ['2025', '03'] yung array 1 yung month na 03
		//request tong dalawang to
		$month_from = explode('-', $parameters['from'])[1];
		$month_to = explode('-', $parameters['to'])[1];

		if ($service_periods->count() > 0) {
			$get_months = array();
			foreach ($service_periods as  $service_period) {
				//ni-get yung month to na int
				$length = ($service_period->status == "present") ? Carbon::now()->month : $service_period->month_to;
				//nilagay sa loob ng array x parang walang purpose?
				$x[] = $length;
				//i = month from
				for ($i = $service_period->month_from; $i <= $length; $i++) {
				//if merong $i push lang sa get months yung range ng numbers na months
					if ($i) {
						array_push($get_months, (int)$i);
					}
				}
			}
			//iterate
			foreach ($get_months as $key => $month) {
			//if month na nasa loob ng array (galing database) is more than or equal to month_from (galing sa request)
			//and month is less than or equal to month_to, lagay sa array ng result
				if ($month >= $month_from && $month <= $month_to) {
					$result[] = $month;
				}
			}
		}
		return $result;
	}
}
