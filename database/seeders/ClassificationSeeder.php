<?php

namespace Database\Seeders;

use App\Models\Classification;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $class = ['Individually Paying', 'Funded by LGU', '4Ps Member', 'Senior Citizen', 'Benificiary'];
        foreach ($class as $cl) {
            $class = new Classification();
            $class->name = $cl;
            $class->save();
        }
    }
}
