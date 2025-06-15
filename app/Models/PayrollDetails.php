<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayrollDetails extends Model
{
    use SoftDeletes;
    protected $table = 'tbl_payroll_details';
}
