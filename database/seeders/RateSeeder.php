<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $rates = array(
            array(
            	'rate' => '500',
            	'month' => '01',
            	'year' => '2025'
            )
        );

         DB::table('tbl_rates')->insert($rates);
    }
}
