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
        $users = array(
            array(
                'name' => 'Kian Paulo C. Talubo',
                'username' => 'keykkian@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'System Administrator',
                'position' => 'AO'
            ),
            array(
                'name' => 'Zaldy B. Ybardolaza II',
                'username' => 'zaldyybardolazaii.lccao@gmail.com',
                'password' => Hash::make('12345'),
                'mobile' => '(049) 557-1531',
                'classification' => 'Office Administrator',
                'position' => 'Casual'
            ),
            array(
                'name' => 'Rhoniel L. Añonuevo',
                'username' => 'rhon2692@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'System Administrator',
                'position' => 'CAA-II'
            ),
            array(
                'name' => 'santacruz',
                'username' => 'santacruz@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'alaminos',
                'username' => 'alaminos@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'bay',
                'username' => 'bay@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'binan',
                'username' => 'binan@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'cabuyao',
                'username' => 'cabuyao@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'calamba',
                'username' => 'calamba@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'calauan',
                'username' => 'calauan@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'cavinti',
                'username' => 'cavinti@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'kalayaan',
                'username' => 'kalayaan@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'liliw',
                'username' => 'liliw@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'losbanos',
                'username' => 'losbanos@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'luisiana',
                'username' => 'luisiana@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'lumban',
                'username' => 'lumban@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'mabitac',
                'username' => 'mabitac@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'magdalena',
                'username' => 'magdalena@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'majayjay',
                'username' => 'majayjay@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'nagcarlan',
                'username' => 'nagcarlan@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'paete',
                'username' => 'paete@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'pagsanjan',
                'username' => 'pagsanjan@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'pakil',
                'username' => 'pakil@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'pangil',
                'username' => 'pangil@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'pila',
                'username' => 'pila@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'rizal',
                'username' => 'rizal@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'sanpablo',
                'username' => 'sanpablo@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'sanpedro',
                'username' => 'sanpedro@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'santamaria',
                'username' => 'santamaria@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'santarosa',
                'username' => 'santarosa@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'siniloan',
                'username' => 'siniloan@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
            array(
                'name' => 'victoria',
                'username' => 'victoria@gmail.com',
                'password' => Hash::make('userpass'),
                'mobile' => '+639123456789',
                'classification' => 'user',
                'position' => 'user'
            ),
        );

        DB::table('tbl_users')->insert($users);
    }
}
