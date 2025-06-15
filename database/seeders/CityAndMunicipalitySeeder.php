<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CityAndMunicipalitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $cities_and_municipalities = array(
			array('district_no' => 3,'code' => '043401','name' => 'Alaminos'),
			array('district_no' => 2,'code' => '043402','name' => 'Bay'),
			array('district_no' => 1,'code' => '043403','name' => 'Biñan City'),
			array('district_no' => 2,'code' => '043404','name' => 'Cabuyao City'),
			array('district_no' => 2,'code' => '043405','name' => 'Calamba City'),
			array('district_no' => 3,'code' => '043406','name' => 'Calauan'),
			array('district_no' => 4,'code' => '043407','name' => 'Cavinti'),
			array('district_no' => 4,'code' => '043408','name' => 'Famy'),
			array('district_no' => 4,'code' => '043409','name' => 'Kalayaan'),
			array('district_no' => 3,'code' => '043410','name' => 'Liliw'),
			array('district_no' => 2,'code' => '043411','name' => 'Los Baños'),
			array('district_no' => 4,'code' => '043412','name' => 'Luisiana'),
			array('district_no' => 4,'code' => '043413','name' => 'Lumban'),
			array('district_no' => 4,'code' => '043414','name' => 'Mabitac'),
			array('district_no' => 4,'code' => '043415','name' => 'Magdalena'),
			array('district_no' => 4,'code' => '043416','name' => 'Majayjay'),
			array('district_no' => 3,'code' => '043417','name' => 'Nagcarlan'),
			array('district_no' => 4,'code' => '043418','name' => 'Paete'),
			array('district_no' => 4,'code' => '043419','name' => 'Pagsanjan'),
			array('district_no' => 4,'code' => '043420','name' => 'Pakil'),
			array('district_no' => 4,'code' => '043421','name' => 'Pangil'),
			array('district_no' => 4,'code' => '043422','name' => 'Pila'),
			array('district_no' => 3,'code' => '043423','name' => 'Rizal'),
			array('district_no' => 3,'code' => '043424','name' => 'San Pablo City'),
			array('district_no' => 1,'code' => '043425','name' => 'San Pedro City'),
			array('district_no' => 4,'code' => '043426','name' => 'Santa Cruz'),
			array('district_no' => 4,'code' => '043427','name' => 'Santa Maria'),
			array('district_no' => 1,'code' => '043428','name' => 'Santa Rosa City'),
			array('district_no' => 4,'code' => '043429','name' => 'Siniloan'),
			array('district_no' => 3,'code' => '043430','name' => 'Victoria')
		);

		DB::table('tbl_municipalities')->insert($cities_and_municipalities);
    }
}
