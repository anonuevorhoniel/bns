<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayrollDetails extends Model
{
    use SoftDeletes;
    protected $table = 'tbl_payroll_details';

    public function scholar()
    {
        return $this->belongsTo(Scholar::class, 'scholar_id', 'id');
    }

    public function payroll()
    {
        return $this->belongsTo(Payroll::class, 'payroll_id', 'id');
    }

}
