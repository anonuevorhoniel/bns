<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $users = array(
            array(
                'name' => 'Kian Paulo C. Talubo',
                'email' => 'keykkian',
                'password' => Hash::make('password'),
                'mobile' => '+639123456789',
                'classification' => 'System Administrator',
                'position' => 'AO'
            ),
            array(
                'name' => 'Zaldy B. Ybardolaza II',
                'email' => 'zaldyybardolazaii.lccao@gmail.com',
                'password' => Hash::make('12345'),
                'mobile' => '(049) 557-1531',
                'classification' => 'Office Administrator',
                'position' => 'Casual'
            ),
            array(
                'name' => 'Rhoniel L. Añonuevo',
                'email' => 'rhon2692@gmail.com',
                'password' => Hash::make('password'),
                'mobile' => '+639123456789',
                'classification' => 'System Administrator',
                'position' => 'CAA-II'
            ),
        );

        DB::table('tbl_users')->insert($users);
    }
}
