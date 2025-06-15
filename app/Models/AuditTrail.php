<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Auth;

class AuditTrail extends Model
{
    // use HasFactory;

    protected $table = "tbl_audit_trails";

    public static function createTrail($action, $description) {

        $trail = new AuditTrail;
        $trail->user_id = Auth::id();
        $trail->action = $action;
        $trail->description = $description;
        $trail->save();
    }
}
