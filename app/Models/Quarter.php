<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Quarter extends Model
{	
    use SoftDeletes;
    protected $table = 'tbl_quarters';

    CONST QUARTERS = array(
    	array('id' => '1',  'quarter' => "First Quarter"),
    	array('id' => '2',  'quarter' => "Second Quarter"),
    	array('id' => '3',  'quarter' => "Third Quarter"),
    	array('id' => '4',  'quarter' => "Fourth Quarter"),
    );

    public static function isActive() {
        $quarter = Quarter::where('status', 1)->get();
        $quarter_id = ($quarter->count() > 0) ? $quarter[0]->id : 0;
        return $quarter_id;
    }
    public static function years()
    {
        $current = date("Y");
        $previous = $current - 10;
        $next     = $current + 10;
        $years = range($previous, $next);
        return $years;
    }

    public static function currentYear()
    {
        $year = date("Y");
        return $year;
    }

    public static function currentMonth()
    {
        $month = date("M");
        return $month;
    }

    public static function currentMonthNum()
    {
        $month = date("m");
        return $month;
    }

    public static function currentQuarter()
    {
        $month = date("M");
        if($month == "Jan" || $month == "Feb" || $month == "Mar"){
            $quarter = "First Quarter";
        }elseif ($month == "Apr" || $month == "May" || $month == "Jun") {
            $quarter = "Second Quarter";
        }elseif ($month == "Jul" || $month == "Aug" || $month == "Sep") {
            $quarter = "Third Quarter";
        }else{
            $quarter = "Fourth Quarter";
        }

        return $quarter;
    }

    public static function quarterMonths($quarter){

        if($quarter == 'First Quarter'){
            $months = array('01', '02', '03');   
        }elseif($quarter == 'Second Quarter'){
            $months = array('04', '05', '06');   
        }elseif($quarter == 'Third Quarter'){
            $months = array('07', '08', '09');   
        }else{
            $months = array('10', '11', '12');   
        }

        return $months;
    }

    public static function quarterMonthsName($quarter){

        if($quarter == 'First Quarter'){
            $months = array(
                array('value' => '01', 'month' => 'January'),
                array('value' => '02', 'month' => 'February'),
                array('value' => '03', 'month' => 'March'),
            ); 
        }elseif($quarter == 'Second Quarter'){
            $months = array(
                array('value' => '04', 'month' => 'April'),
                array('value' => '05', 'month' => 'May'),
                array('value' => '06', 'month' => 'June'),
            );   
        }elseif($quarter == 'Third Quarter'){
            $months = array(
                array('value' => '07', 'month' => 'July'),
                array('value' => '08', 'month' => 'August'),
                array('value' => '09', 'month' => 'September'),
            );     
        }else{
            $months = array(
                array('value' => '10', 'month' => 'October'),
                array('value' => '11', 'month' => 'November'),
                array('value' => '12', 'month' => 'December'),
            );      
        }

        return $months;
    }


    public static function months(){
        $months = array(
            1 => "January",
            2 => "February",
            3 => "March",
            4 => "April",
            5 => "May",
            6 => "June",
            7 => "July",
            8 => "August",
            9 => "September",
            10 => "October",
            11 => "November",
            12 => "December"

        );

        return $months;
    }

    public static function getQuarterIdOfMonth($month){
        if($month >= 1 && $month <= 3){
            $quarter = "First Quarter";
        }elseif($month >= 4 && $month <= 6){
            $quarter = "Second Quarter";
        }elseif($month >= 7 && $month <= 9){
            $quarter = "Third Quarter";
        }elseif($month >= 10 && $month <= 12){
            $quarter = "Fourth Quarter";
        }

        $quarter = Quarter::where('quarter', $quarter)
        ->where('year', Carbon::now()->year)->first();

        return $quarter;
    }
}
