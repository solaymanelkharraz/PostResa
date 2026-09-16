<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class PlanningFile extends Model {
    use \App\Models\Traits\ScopedToAdmin;
    protected $guarded = [];
}
