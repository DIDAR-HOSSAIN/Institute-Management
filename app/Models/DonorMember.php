<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonorMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'donor_id',
        'name',
        'father_name',
        'mother_name',
        'image',
        'date_of_birth',
        'gender',
        'mobile_no',
        'nid_no',
        'email',
        'blood_group',
        'occupation',
        'reg_date',
        'approval_date',
        'dakhil_year',
        'alim_year',
        'fazil_year',
        'district',
        'upazila',
        'union_or_pourshava',
        'post_office',
        'ward_no',
        'house_no_or_name',
        'present_address',
        'amount',
        'transaction_no',
        'status',
        'user_name',
    ];
}
