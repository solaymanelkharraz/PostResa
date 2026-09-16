<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory, \App\Models\Traits\ScopedToAdmin;

    protected $fillable = ['user_id', 'title', 'content', 'type', 'status', 'image_url', 'target_audience', 'likes', 'comments', 'admin_id'];

    protected $casts = [
        'target_audience' => 'array',
        'likes' => 'array',
        'comments' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
