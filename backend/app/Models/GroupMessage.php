<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GroupMessage extends Model
{
    use HasFactory;

    protected $fillable = ['group_name',
        'sender_id',
        'content',
        'academic_year'];

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}