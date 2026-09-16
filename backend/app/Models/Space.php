<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Space extends Model
{
    use HasFactory, \App\Models\Traits\ScopedToAdmin;

    protected $fillable = ['name', 'type', 'capacity', 'status', 'metadata', 'admin_id'];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}
