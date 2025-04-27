<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{

    use HasFactory;

    protected $fillable = ['admin_id', 'action', 'description'];

    // Relation avec l'administrateur (User)
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
     // Ajout automatique des colonnes created_at et updated_at
     public $timestamps = true;
}
