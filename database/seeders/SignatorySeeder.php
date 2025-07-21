<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SignatorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $signatories = array(
            array(
            	'name' => 'TERESITA S. RAMOS',
                'description' => 'Provincial Nutrition Action Officer',
                'designation_id' => '1',
                'status' => '1'
            ),
            array(
            	'name' => 'Marisol "Sol" Castillo Aragones-Sampelo',
                'description' => 'Governor',
                'designation_id' => '3',
                'status' => '1'
            ),
            array(
            	'name' => 'JOIPHYLEN C. BACANTO',
                'description' => 'OIC - Provincial Accounting Office',
                'designation_id' => '4',
                'status' => '1'
            ),
            array(
            	'name' => 'Marisol "Sol" Castillo Aragones-Sampelo',
                'description' => 'Chairman-Provincial Nutrition Comittee',
                'designation_id' => '5',
                'status' => '1'
            ),
        );  


        DB::table('tbl_signatories')->insert($signatories);
    }
}
