<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory, \App\Models\Traits\ScopedToAdmin;
    
    protected $fillable = ['user_id', 'action', 'details', 'type', 'ip_address', 'admin_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
