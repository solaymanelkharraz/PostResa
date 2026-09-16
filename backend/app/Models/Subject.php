<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory, \App\Models\Traits\ScopedToAdmin;
    
    protected $fillable = ['name', 'description', 'admin_id'];
}
