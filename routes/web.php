<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClassScheduleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DonorMemberController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GeneralMemberController;
use App\Http\Controllers\HolidayController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LeaveController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\RosterController;
use App\Http\Controllers\SchoolClassController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\StudentAttendanceController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\StudentFeeController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

//Frontend Route

// Route::get('/about', function () {
//     return Inertia::render('AboutPage');
// })->name('about');

// Route::get('/mikrotik', function () {
//     return Inertia::render('Mikrotik/View');
// })->name('mikrotik');

// Route::get('/test-env', function () {
//     return env('MIKROTIK_HOST');
// });


// Route::resource('/mikrotik/interfaces', MikrotikController::class);
// Route::get('/check/env', [MikrotikController::class, 'checkEnv']);
// Route::post('/mikrotik/firewall', MikroTikController::class);

Route::resource('employees', EmployeeController::class);
Route::resource('rosters', RosterController::class);

// school management
Route::resource('students', StudentController::class);
Route::resource('classes', SchoolClassController::class);
Route::resource('sections', SectionController::class);
Route::resource('class-schedule', ClassScheduleController::class);
Route::resource('holidays', HolidayController::class);
Route::resource('leaves', LeaveController::class);

// সব ফি লিস্ট
Route::get('/student-fees', [StudentFeeController::class, 'index'])
    ->name('student-fees.index');


// খালি ফর্ম
Route::get('/student-fees/create', [StudentFeeController::class, 'create'])
    ->name('student-fees.create');

// Student সার্চ দিয়ে ডাটা ফেচ
Route::get('/student-fees/fetch/{studentId}', [StudentFeeController::class, 'fetch'])
    ->name('student-fees.fetch');

// ফি স্টোর
Route::post('/student-fees/store', [StudentFeeController::class, 'store'])
    ->name('student-fees.store');

// Student Fee show route
Route::get('/student-fees/{studentId}', [StudentFeeController::class, 'show'])->name('student-fees.show');

// খালি ফর্ম
Route::get('/student-fees/create/edit', [StudentFeeController::class, 'createEdit'])
    ->name('student-fees.create-edit');

// Student সার্চ দিয়ে ডাটা ফেচ
Route::get('/student-fees/fetch-edit/{studentId}', [StudentFeeController::class, 'fetchEdit'])
    ->name('student-fees.fetch-edit');
    
// সব ফি এডিট
Route::get('/student-fees/{student}/edit-all', [StudentFeeController::class, 'editAll'])
    ->name('student-fees.edit-all');

// সব ফি আপডেট
Route::put('/student-fees/{student}/update-all', [StudentFeeController::class, 'updateAll'])
    ->name('student-fees.update-all');

// Route::resource('student-fees', StudentAttendanceController::class);

// Show the page
Route::get('/attendance/sync/create', [StudentAttendanceController::class, 'syncCreate']);

// Sync device and save to student_attendances table
Route::get('/attendance/sync', [StudentAttendanceController::class, 'sync'])->name('attendance.sync');
Route::resource('/attendance', StudentAttendanceController::class);

Route::resource('general/members', GeneralMemberController::class);

Route::resource('donors', DonorMemberController::class);

// Route::resource('payroll', PayrollController::class);

// Route::inertia('/', 'Home')->name('home');

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::resource('users', UserController::class);
Route::get('product-view/{id}', [ProductController::class, 'getProducts'])->name('product-view');
Route::resource('orders', OrderController::class);
Route::get('order/invoice/{order_id}', [OrderController::class, 'getInvoice'])->name('order.invoice');
Route::get('/thanks/{orderId}', [OrderController::class, 'thanks'])->name('thanks');

//Super admin route
Route::middleware(['auth', 'check_user_status', 'check_roles:super-admin'])->group(function () {
    Route::resource('roles', RoleController::class);
    Route::resource('permissions', PermissionController::class);
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('products', ProductController::class);
    Route::put('/users/{id}/toggle-active', [UserController::class, 'toggleActiveInactiveUser'])->name('users.toggleActive');
    Route::resource('sliders', SliderController::class);
    Route::resource('categories', CategoryController::class);
});




Route::inertia('/whoweare', 'WhoWeAre')->name('whoweare');

Route::inertia('/about', 'AboutPage')->name('about');

Route::inertia('/events', 'EventPage')->name('events');


Route::inertia('/gallery', 'GalleryPage')->name('gallery');

Route::inertia('/executive/members', 'ExecutiveMemberPage')->name('executive.members');



Route::inertia('/notice', 'NoticeBoardPage')->name('notice');


Route::get('registers', [RegisteredUserController::class, 'index'])->middleware(['auth', 'verified'])->name('registers');

Route::get('register', [RegisteredUserController::class, 'create'])->middleware(['auth', 'verified'])->name('register');

Route::post('register', [RegisteredUserController::class, 'store'])->middleware(['auth', 'verified']);


Route::get('contacts/create', [ContactController::class, 'create'])->name('contacts.create');
Route::resource('contacts', ContactController::class)->middleware(['auth', 'verified'])->except('create');

Route::middleware(['auth'])->group(function () {});

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
