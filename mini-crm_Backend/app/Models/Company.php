<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;
    protected $fillable = [
        'name', 'logo', 'website', 'email', 'phone', 'description',
    ];

    // Relation avec les employés via Invitations
    public function employees()
    {
        return $this->belongsToMany(User::class, 'invitations');
    }

    // Relation avec les invitations
    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }
}
