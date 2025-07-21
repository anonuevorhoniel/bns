<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Models\User;
use App\Models\AuditTrail;
use App\Models\Municipality;
use App\Models\Assignment;
use Exception;
use Illuminate\Support\Facades\Cookie;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        if (Auth::user()->classification == "Field Officer") {
            return back()->withErrors('Permission Denied!');
        } else {
            $users_data = User::whereNot('id', Auth::id());
            $page = $request->page;
            $limit = 8;
            $total = (clone $users_data)->get()->count();
            $total_page = ceil($total / $limit);
            $offset = ($page - 1) * $limit;
            $users = (clone $users_data)->offset($offset)->limit($limit)->get();
            return response()->json(compact('users', 'total_page'));
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {

        $page = [
            'name'  =>  'Users',
            'title' =>  'Create New User',
            'crumb' =>  array('Users' => '/users', 'Create' => '')
        ];

        $municipalities = Municipality::all();
        return view('users.create', compact('page',  'municipalities'));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {

        $this->validate($request, [
            'name' => 'required',
            'username' => 'required|unique:tbl_users',
            'mobile' => 'required',
            'classification' => 'required'
        ]);


        DB::beginTransaction();
        try {

            $user = new User;
            $user->name = $request->name;
            $user->username = $request->username;
            $user->password = Hash::make('12345');
            $user->classification = $request->classification;
            $user->mobile = $request->mobile;
            $user->save();

            if ($request->classification === "Field Officer") {

                foreach ($request->municipalities as $code) {
                    // dd($code);
                    $assignment = new Assignment;
                    $assignment->user_id = $user->id;
                    $assignment->municipality_code = $code;
                    $assignment->save();
                }
            }

            AuditTrail::createTrail("Create user account", $user);

            DB::commit();
            return back()->withSuccess('A new user has been added.');
        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        //
        $page = [
            'name'  =>  'Users',
            'title' =>  'View User',
            'crumb' =>  array('Users' => '/users', 'View' => '')
        ];

        $assignments = DB::table('tbl_assignments')
            ->select('tbl_assignments.id as id', 'name')
            ->leftJoin('tbl_municipalities', 'tbl_assignments.municipality_code', 'tbl_municipalities.code')
            ->where('user_id', $user->id)
            ->get();
        $municipalities = Municipality::all();

        $classification = $user->classification;
        return view('users.show', compact('page', 'user', 'assignments', 'municipalities', 'classification', 'assignments'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($user)
    {
        if (Auth::user()->classification == "System Administrator") {

            $user = User::find($user);
            $user->delete();

            AuditTrail::createTrail("Deleted User Account.", $user);
            return back()->withSuccess("User Account Successfully Deleted.");
        } else {
            return back()->withErrors("Permission Denied. You are not allowed to delete user account.");
        }
    }

    public function reset(User $user)
    {
        if (Auth::user()->classification == "System Administrator") {
            $user->password = Hash::make('12345');
            $user->save();
            AuditTrail::createTrail("Reset Password", $user);
            return back()->withSuccess("User password reset");
        } else {

            return back()->withErrors("Permission Denied. You are not allowed to reset user's password.");
        }
    }

    public function updatePassword(Request $request, User $user)
    {
        $this->validate($request, [
            'current_password' => [
                'required',
                function ($attribute, $value, $fail) use ($user) {
                    if (!Hash::check($value, $user->password)) {
                        return $fail(__('The current password is incorrect.'));
                    }
                }
            ],
            'new_password' => 'required|confirmed'
        ]);

        DB::beginTransaction();

        try {

            $user->password = Hash::make($request->new_password);
            $user->save();
            AuditTrail::createTrail("Update account password", $user);

            DB::commit();
            return back()->withSuccess('A new password has been set.');
        } catch (\Exception $e) {

            DB::rollBack();
            return back()->withErrors($e->getMessage());
        }
    }

    public function authenticate(Request $request)
    {
        $request->validate([
            'email' => 'required|exists:tbl_users,email',
            'password' => 'required'
        ]);

        $auth = Auth::attempt(['email' => $request->email, 'password' => $request->password]);

        if (!$auth) {
            return response()->json(['message' => 'Incorrect Credentials'], 422);
        }
        $user = Auth::user();
        $token = $user->createToken('user_c')->plainTextToken;
        $cookie = Cookie('user_c', $token);
        $message = "Logged In!";
        $data = compact('user', 'token', 'message');

        return response()->json($data)->withCookie($cookie);
    }

    public function check_auth(Request $request)
    {
        return response()->json($request->user());
    }

    public function change_email(Request $request)
    {
        $user_id = Auth::user()->id;
        $request->validate([
            'newEmail' => 'required|unique:tbl_users,email,' . $user_id,
            'confirmNewEmail' => 'required|unique:tbl_users,email,' . $user_id,
            'password' => 'required'
        ]);

        if (!Hash::check($request->password, Auth::user()->password)) {
            return response()->json(['message' => 'Incorrect Password!'], 422);
        }

        try {
            User::find($user_id)->update([
                'email' => $request->newEmail,
            ]);
            return response()->noContent();
        } catch (Exception $e) {
            return response()->json($e->getMessage(), 422);
        }
    }
}
