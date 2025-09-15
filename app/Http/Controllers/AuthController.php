<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\AuditTrail;
use App\Models\User;
use Illuminate\Support\Facades\Cookie;

class AuthController extends Controller
{
    public function destroy(Request $request)
    {
        Cookie::queue(Cookie::forget('user_c'));
        Auth::guard('web')->logout();
        return response()->json(['message' => 'logged out'])->withCookie(Cookie::forget('user_c'));
    }

}
