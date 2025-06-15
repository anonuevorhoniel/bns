<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $districts = array(
			array('district_no' => 1,'description' => 'District 1'),
			array('district_no' => 2,'description' => 'District 2'),
			array('district_no' => 3,'description' => 'District 3'),
			array('district_no' => 4,'description' => 'District 4'),
		);

		DB::table('tbl_districts')->insert($districts);
    }
}
