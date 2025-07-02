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
    //

    public function index()
    {
        Auth::logout();
        return view('auth.login');
    }

    public function store(Request $request)
    {
        $this->validate($request, [
            'username' => 'required',
            'password' => 'required'
        ]);

        $credentials = $request->only('username', 'password');

        if (! Auth::attempt($credentials)) {
            return back()->withErrors('Invalid credentials')->withInput($request->all);
        }

        return redirect('/');
    }



    public function account()
    {

        $page = [
            'name'  =>  'Accont',
            'title' =>  'Account Management',
            'crumb' =>  array('Account' => '/users', 'Change Password' => '')
        ];

        $user = Auth::user();
        return view('auth.account', compact('page', 'user'));
    }

    public function updatePassword(Request $request)
    {

        DB::beginTransaction();

        try {

            if ($request->password == $request->confirm_password) {

                $user = Auth::user();
                $user->password = Hash::make($request->password);
                $user->save();

                AuditTrail::createTrail("Update account password", $user);

                DB::commit();
                return back()->withSuccess('A new password has been set.');
            } else {
                return back()->withErrors('Password did not match.');
            }
        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }

    public function destroy(Request $request)
    {
        Cookie::queue(Cookie::forget('user_c'));
        return response()->json(['message' => 'logged out'])->withCookie(Cookie::forget('user_c'));
    }

    public function forbidden()
    {
        return view('auth.forbidden');
    }
}
