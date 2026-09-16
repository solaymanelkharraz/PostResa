<?php

namespace App\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait ScopedToAdmin
{
    protected static function bootScopedToAdmin()
    {
        static::addGlobalScope('admin_id', function (Builder $builder) {
            if (auth()->check()) {
                $user = auth()->user();
                
                // Super Admin sees everything
                if ($user->role === 'super_admin') {
                    return;
                }
                
                // Admin sees their own data
                if ($user->role === 'admin') {
                    if ($builder->getModel() instanceof \App\Models\User) {
                        $builder->where(function ($q) use ($user) {
                            $q->where('admin_id', $user->id)
                              ->orWhere('id', $user->id);
                        });
                    } else {
                        $builder->where('admin_id', $user->id);
                    }
                } 
                // Profs and Stagiaires see their admin's data
                else {
                    if ($builder->getModel() instanceof \App\Models\User) {
                        $builder->where(function ($q) use ($user) {
                            $q->where('admin_id', $user->admin_id)
                              ->orWhere('id', $user->admin_id); // allow seeing their admin
                        });
                    } else {
                        $builder->where('admin_id', $user->admin_id);
                    }
                }
            }
        });

        static::creating(function ($model) {
            if (auth()->check() && empty($model->admin_id)) {
                $user = auth()->user();
                if ($user->role === 'admin') {
                    $model->admin_id = $user->id;
                } else if ($user->admin_id) {
                    $model->admin_id = $user->admin_id;
                }
            }
        });
    }

    public function admin()
    {
        return $this->belongsTo(\App\Models\User::class, 'admin_id');
    }
}
