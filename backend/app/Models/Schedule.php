<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory, \App\Models\Traits\ScopedToAdmin;
    
    protected $fillable = ['group_name', 'subject_id', 'teacher_id', 'space_id',
        'day', 'start_time', 'end_time', 'type', 'modality', 'admin_id'];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}
