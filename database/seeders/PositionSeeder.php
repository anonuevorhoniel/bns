<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $positions = array(
			array('position' => 'Volunteer'),
			array('position' => 'Representative'),
		);

		DB::table('tbl_positions')->insert($positions);
    }
}
