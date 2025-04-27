<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Invitation;
use Illuminate\Support\Str;
class InvitationSeeder extends Seeder
{
    public function run(): void
    {
        Invitation::create([
            'company_id' => 1,
            'user_id' => 2, // Employee One
            'name' => 'Employee One',
            'email' => 'employee1@example.com',
            'token' => Str::random(32),
            'status' => 'accepted',
        ]);

        Invitation::create([
            'company_id' => 2,
            'user_id' => 3, // Employee Two
            'name' => 'Employee Two',
            'email' => 'employee2@example.com',
            'token' => Str::random(32),
            'status' => 'pending',
        ]);
    }
}
