<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasFactory, Notifiable;
    use HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        'address',
        'birth_date',
        'is_verified',
        'company_id',
    ];


    protected $hidden = [
        'password', 'remember_token',
    ];


    // Relation avec les invitations
    public function invitations()
    {
        return $this->hasMany(Invitation::class);
    }

    // Relation avec les entreprises via Invitations
    public function companies()
    {
        return $this->belongsToMany(Company::class, 'invitations');
    }

    // Relation avec l'historique des actions (pour les admins)
    public function history()
    {
        return $this->hasMany(History::class, 'admin_id');
    }
    public function company()
{
    return $this->belongsTo(Company::class);
}
}
