<?php

namespace App\Http\Controllers;

use App\Models\GeneralMember;
use App\Http\Requests\StoreGeneralMemberRequest;
use App\Http\Requests\UpdateGeneralMemberRequest;
use App\Models\District;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Intervention\Image\Drivers\Gd\Driver;
use Intervention\Image\ImageManager;

class GeneralMemberController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('permission:general-member-list|general-member-create|general-member-edit|general-member-delete', ['only' => ['index', 'store']]);
    //     $this->middleware('permission:general-member-create', ['only' => ['create', 'store']]);
    //     $this->middleware('permission:general-member-edit', ['only' => ['edit', 'update']]);
    //     $this->middleware('permission:general-member-delete', ['only' => ['destroy']]);
    //     $this->middleware('permission:general-member-money-receipt', ['only' => ['moneyReceipt']]);
    //     $this->middleware('permission:general-member-summary-report', ['only' => ['summaryReport']]);
    //     $this->middleware('permission:general-member-summary-details', ['only' => ['summaryDetails']]);
    //     $this->middleware('permission:general-member-due-check', ['only' => ['duesCheck']]);
    // }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $query = GeneralMember::query();

        if ($startDate && $endDate) {
            // Make sure to convert the string dates to DateTime objects
            $startDate = \Carbon\Carbon::createFromFormat('Y-m-d', $startDate)->startOfDay();
            $endDate = \Carbon\Carbon::createFromFormat('Y-m-d', $endDate)->endOfDay();

            $query->whereBetween('reg_date', [$startDate, $endDate]);
        }

        $members = $query->orderBy('id', 'desc')->latest()->get();

        return inertia::render('Bm-Ex-Students/ViewBmExStudents', ['members' => $members]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $districts = District::with('thanas')->get();
        return inertia::render('Bm-Ex-Students/CreateBmExStudents', ['districts' => $districts,  'message' => session('message'),]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGeneralMemberRequest $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'father_name' => 'required|string|max:55',
                'mother_name' => 'required|string|max:55',
                'image' => [
                    'nullable',
                    'image',
                    'mimes:jpeg,png,jpg,gif',
                    'max:80',
                    'required_if:gender,Male',
                ],
                'date_of_birth' => 'required|date|before:today',
                'gender' => 'required|string|in:Male,Female',
                'mobile_no' => 'required|string|max:15',
                'nid_no' => 'nullable|string|max:17|unique:general_members,nid_no',
                'email' => 'nullable|email|max:55|unique:general_members,email',
                'blood_group' => 'nullable|string|in:A+,A-,B+,B-,O+,O-,AB+,AB-',
                'occupation' => 'nullable|string|max:55',
                'reg_date' => 'nullable|date',
                'approval_date' => 'nullable|date',
                'dakhil_year' => 'nullable|digits:4|integer|before_or_equal:' . now()->year,
                'alim_year' => 'nullable|digits:4|integer|before_or_equal:' . now()->year,
                'fazil_year' => 'nullable|digits:4|integer|before_or_equal:' . now()->year,
                'district' => 'required|string|max:55',
                'upazila' => 'required|string|max:55',
                'union_or_pourshava' => 'nullable|string|max:55',
                'post_office' => 'nullable|string|max:55',
                'ward_no' => 'nullable|integer|min:1|max:9',
                'house_no_or_name' => 'nullable|string|max:255',
                'present_address' => 'nullable|string|max:1000',
                'membership_fee' => 'required|numeric|min:300',
                'transaction_no' => 'required|string|max:17|unique:general_members,transaction_no',
                'status' => 'nullable|in:Pending,Approved',
            ]);

            // Ensure at least one of the education fields is filled
            if (!$request->dakhil_year && !$request->alim_year && !$request->fazil_year) {
                $validator->after(function ($validator) {
                    $validator->errors()->add('education_year', 'At least one of Dakhil Year, Alim Year, or Fazil Year is required.');
                });
            }

            if ($validator->fails()) {
                return redirect()->back()
                    ->withErrors($validator) // Pass validation errors
                    ->withInput(); // Keep old input values
            }

            $data = $request->all();
            $data['member_id'] = $this->generateExStudentsId();
            $data['reg_date'] = $data['reg_date'] ?? now()->toDateString();
            $data['status'] = $data['status'] ?? 'Pending';

            // Handle authenticated user
            if ($user = Auth::user()) {
                $data['user_name'] = $user->name;
            } else {
                return redirect()->back()->with('error', 'User not authenticated');
            }

            $imagePath = public_path('images/students/');

            // Check if the directory exists, if not, create it
            if (!File::exists($imagePath)) {
                File::makeDirectory($imagePath, 0755, true);
            }

            // Initialize ImageManager without specifying the driver
            $manager = new ImageManager(new Driver());

            // Handle image1
            if ($request->hasFile('image')) {
                $name_gen = hexdec(uniqid()) . '.' . $request->file('image')->getClientOriginalExtension();
                $img = $manager->read($request->file('image')->getRealPath())->resize(300, 300);
                $img->save($imagePath . $name_gen, 80);
                $data['image'] = $name_gen;
            }

            // Create the member
            GeneralMember::create($data);

            return redirect()->route('members.create')
                ->with('message', 'Member Registration successfully!');
        } catch (Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Registration failed. Please try again.'])
                ->withInput();
        }
    }

    private function generateExStudentsId()
    {
        $prefix = 'MID';
        $currentDate = now()->format('ymd');

        DB::beginTransaction();

        try {
            // Get the latest member ID for today
            $latestMember = DB::table('general_members')
                ->where('member_id', 'like', "$prefix-$currentDate-%")
                ->lockForUpdate()
                ->orderBy('member_id', 'desc')
                ->first();

            // Extract serial number
            $serialNumber = $latestMember ? intval(substr($latestMember->member_id, -3)) + 1 : 1;
            $serialNumberFormatted = str_pad($serialNumber, 3, '0', STR_PAD_LEFT);

            $newMemberId = "$prefix-$currentDate-$serialNumberFormatted";

            DB::commit();

            return $newMemberId;
        } catch (Exception $e) {
            DB::rollBack();
            throw new Exception('Error generating member ID: ' . $e->getMessage());
        }
    }


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $member = GeneralMember::findOrFail($id);
        return inertia::render('Bm-Ex-Students/ShowBmExStudents', [
            'member' => $member,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $generalMember = GeneralMember::findOrFail($id);

        if (!$generalMember) {
            abort(404); // Or handle the error as needed
        }

        $districts = District::with('thanas')->get();

        return Inertia::render('Bm-Ex-Students/EditBmExStudents', [
            'member' => $generalMember,
            'districts' => $districts,
            'message' => session('message'),
        ]);
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGeneralMemberRequest $request, $id)
    {
        try {
            // Validate incoming data
            $validatedData = $request->validate([
                'name' => 'required|string|max:55',
                'father_name' => 'required|string|max:55',
                'mother_name' => 'required|string|max:55',
                'date_of_birth' => 'nullable|date',
                'gender' => 'required|string|in:Male,Female',
                'mobile_no' => 'required|string|max:15',
                'nid_no' => 'nullable|string|max:17',
                'email' => 'nullable|email|max:55',
                'blood_group' => 'nullable|string|in:A+,A-,B+,B-,O+,O-,AB+,AB-',
                'occupation' => 'nullable|string|max:55',
                'reg_date' => 'nullable|date',
                'approval_date' => 'nullable|date',
                'dakhil_year' => 'nullable|digits:4|integer|before_or_equal:' . now()->year,
                'alim_year' => 'nullable|digits:4|integer|before_or_equal:' . now()->year,
                'fazil_year' => 'nullable|digits:4|integer|before_or_equal:' . now()->year,
                'district' => 'nullable|string|max:55',
                'upazila' => 'nullable|string|max:55',
                'union_or_pourshava' => 'nullable|string|max:255',
                'post_office' => 'nullable|string|max:55',
                'ward_no' => 'nullable|string|max:10',
                'house_no_or_name' => 'nullable|string|max:255',
                'present_address' => 'nullable|string|max:255',
                'membership_fee' => 'nullable|numeric',
                'transaction_no' => 'nullable|string|max:255',
                'status' => 'nullable|in:Pending,Approved',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);


            $member = GeneralMember::findOrFail($id);

            // Update fields using null coalescing to keep the existing value if not provided
            $member->name = $validatedData['name'] ?? $member->name;
            $member->father_name = $validatedData['father_name'] ?? $member->father_name;
            $member->mother_name = $validatedData['mother_name'] ?? $member->mother_name;
            $member->date_of_birth = $validatedData['date_of_birth'] ?? $member->date_of_birth;
            $member->gender = $validatedData['gender'] ?? $member->gender;
            $member->mobile_no = $validatedData['mobile_no'] ?? $member->mobile_no;
            $member->nid_no = $validatedData['nid_no'] ?? $member->nid_no;
            $member->email = $validatedData['email'] ?? $member->email;
            $member->blood_group = $validatedData['blood_group'] ?? $member->blood_group;
            $member->occupation = $validatedData['occupation'] ?? $member->occupation;
            $member->reg_date = $validatedData['reg_date'] ?? $member->reg_date;
            $member->approval_date = $validatedData['approval_date'] ?? $member->approval_date;
            $member->dakhil_year = $validatedData['dakhil_year'] ?? $member->dakhil_year;
            $member->alim_year = $validatedData['alim_year'] ?? $member->alim_year;
            $member->fazil_year = $validatedData['fazil_year'] ?? $member->fazil_year;
            $member->district = $validatedData['district'] ?? $member->district;
            $member->upazila = $validatedData['upazila'] ?? $member->upazila;
            $member->union_or_pourshava = $validatedData['union_or_pourshava'] ?? $member->union_or_pourshava;
            $member->post_office = $validatedData['post_office'] ?? $member->post_office;
            $member->ward_no = $validatedData['ward_no'] ?? $member->ward_no;
            $member->house_no_or_name = $validatedData['house_no_or_name'] ?? $member->house_no_or_name;
            $member->present_address = $validatedData['present_address'] ?? $member->present_address;
            $member->membership_fee = $validatedData['membership_fee'] ?? $member->membership_fee;
            $member->transaction_no = $validatedData['transaction_no'] ?? $member->transaction_no;
            $member->status = $validatedData['status'] ?? $member->status;

            // Handle image update
            if ($request->hasFile('image')) {
                $imagePath = public_path('images/students/');

                if (!File::exists($imagePath)) {
                    File::makeDirectory($imagePath, 0755, true);
                }

                if ($member->image && file_exists($imagePath . $member->image)) {
                    unlink($imagePath . $member->image);
                }

                $imageName = time() . '_' . uniqid() . '.' . $request->file('image')->getClientOriginalExtension();
                $request->file('image')->move($imagePath, $imageName);

                $member->image = $imageName;
            }

            $member->save();

            return redirect()->route('members.index')
                ->with('flash', ['type' => 'success', 'message' => 'Member updated successfully!']);
        } catch (Exception $e) {
            return redirect()->back()
                ->with('flash', ['type' => 'error', 'message' => 'Member update failed. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GeneralMember $generalMember)
    {
        GeneralMember::findOrFail($generalMember)->delete();
        return redirect()->route('members.index')->with('success', 'Student deleted successfully.');
    }
}
