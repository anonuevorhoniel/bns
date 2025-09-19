<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payroll extends Model
{
	use SoftDeletes;
	protected $table = 'tbl_payrolls';

	protected $fillable = [
		'rate_id',
		'municipality_code',
		'year_from',
		'year_to',
		'month_from',
		'month_to',
		'grand_total',
		'signatories',
		'fund',
		'status',
	];

	public function payrollDetails()
	{
		return $this->hasMany(PayrollDetails::class, 'payroll_id');
	}
	public static function numberToWords($num)
	{
		$ones = array(
			0 => "ZERO",
			1 => "ONE",
			2 => "TWO",
			3 => "THREE",
			4 => "FOUR",
			5 => "FIVE",
			6 => "SIX",
			7 => "SEVEN",
			8 => "EIGHT",
			9 => "NINE",
			10 => "TEN",
			11 => "ELEVEN",
			12 => "TWELVE",
			13 => "THIRTEEN",
			14 => "FOURTEEN",
			15 => "FIFTEEN",
			16 => "SIXTEEN",
			17 => "SEVENTEEN",
			18 => "EIGHTEEN",
			19 => "NINETEEN",
			"014" => "FOURTEEN"
		);

		$tens = array(
			0 => "ZERO",
			1 => "TEN",
			2 => "TWENTY",
			3 => "THIRTY",
			4 => "FORTY",
			5 => "FIFTY",
			6 => "SIXTY",
			7 => "SEVENTY",
			8 => "EIGHTY",
			9 => "NINETY"
		);

		$hundreds = array(
			"HUNDRED",
			"THOUSAND",
			"MILLION",
			"BILLION",
			"TRILLION",
			"QUARDRILLION"
		); /*limit t quadrillion */

		$num = number_format($num, 2, ".", ",");
		$number_array = explode(".", $num);
		$whole_number = $number_array[0];
		$decimal = $number_array[1];
		$whole_array = array_reverse(explode(",", $whole_number));
		krsort($whole_array, 1);
		$text = "";

		foreach ($whole_array as $key => $i) {
			while (substr($i, 0, 1) == "0")
				$i = substr($i, 1, 5);

			if ($i < 20) {
				if (isset($ones[$i])) {
					$text .= $ones[$i];
				}
			} elseif ($i < 100) {
				if (substr($i, 0, 1) != "0")  $text .= $tens[substr($i, 0, 1)];
				if (substr($i, 1, 1) != "0") $text .= " " . $ones[substr($i, 1, 1)];
			} else {
				if (substr($i, 0, 1) != "0") $text .= $ones[substr($i, 0, 1)] . " " . $hundreds[0];
				if (substr($i, 1, 1) != "0") $text .= " " . $tens[substr($i, 1, 1)];
				if (substr($i, 2, 1) != "0") $text .= " " . $ones[substr($i, 2, 1)];
			}
			if ($key > 0) {
				$text .= " " . $hundreds[$key] . " ";
			}
		}
		if ($decimal > 0) {
			$text .= " and ";
			if ($decimal < 20) {
				$text .= $ones[$decimal];
			} elseif ($decimal < 100) {
				$text .= $tens[substr($decimal, 0, 1)];
				$text .= " " . $ones[substr($decimal, 1, 1)];
			}
		}
		return $text;
	}
}
