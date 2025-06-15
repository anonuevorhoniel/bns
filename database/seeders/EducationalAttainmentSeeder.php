<?php

namespace Database\Seeders;

use App\Models\EducationalAttainment;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EducationalAttainmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $e = new EducationalAttainment();
        $e->name = 'High School';
        $e->save();
    }
}
