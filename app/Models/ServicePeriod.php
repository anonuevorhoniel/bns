<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ServicePeriod extends Model
{	
	use SoftDeletes;
    protected $table = 'tbl_service_periods';
}
