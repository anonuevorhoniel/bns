<?php

namespace Database\Seeders;

use App\Models\EducationalAttainment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // \App\Models\User::factory(10)->create();
        $this->call([
            UserSeeder::class,
            DistrictSeeder::class,
            CityAndMunicipalitySeeder::class,
            BarangaySeeder::class,
            PositionSeeder::class,
            // VolunteerSeeder::class,
            EducationalAttainmentSeeder::class,
            SignatorySeeder::class,
            ClassificationSeeder::class,
            FundSeeder::class,
            RateSeeder::class,
        ]);
    }
}
