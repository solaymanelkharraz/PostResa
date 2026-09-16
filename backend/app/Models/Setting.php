<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory, \App\Models\Traits\ScopedToAdmin;
    
    protected $fillable = ['key', 'value', 'admin_id'];
}
