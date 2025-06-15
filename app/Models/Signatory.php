<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Signatory extends Model
{      
    use SoftDeletes;
    
    const HEAD = 1;
    const ADMINISTRATOR = 2;
    const GOVERNOR = 3;
    const ACCOUNTANT = 4;
	const CHAIRMAN = 5;

    const DESIGNATION = array(
    	array(
    		'id' => '1',
    		'designation' => 'Provincial Nutrition Action Officer',
    	),
    	array(
    		'id' => '3',
    		'designation' => 'Governor',
    	),
    	array(
    		'id' => '4',
    		'designation' => 'Provincial Accountant',
    	),
		array(
    		'id' => '5',
    		'designation' => 'Chairman-Provincial Nutrition Comittee',
    	),
    );
    protected $table = 'tbl_signatories';
}
