<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accomplishment extends Model
{
    CONST NO_ACCOMPLISHMENT = 0;
    CONST WITH_ERROR = 2;
    CONST COMPLETED = 1;
    protected $table = 'tbl_accomplishments';
}
