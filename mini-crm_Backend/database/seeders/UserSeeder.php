<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'), // mot de passe encrypté
            'role' => 'admin',
            'address' => 'Casablanca',
            'phone_number' => '+212600000000',
            'birth_date' => '1990-01-01',
            'is_verified' => true,
            'company_id' => 1, // lié à Tech Innovators
        ]);

        User::create([
            'name' => 'Employee One',
            'email' => 'employee1@example.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'address' => 'Rabat',
            'phone_number' => '+212600000001',
            'birth_date' => '1995-05-05',
            'is_verified' => false,
            'company_id' => 1, // lié à Tech Innovators
        ]);

        User::create([
            'name' => 'Employee Two',
            'email' => 'employee2@example.com',
            'password' => Hash::make('password'),
            'role' => 'employee',
            'address' => 'Tanger',
            'phone_number' => '+212600000002',
            'birth_date' => '1997-08-10',
            'is_verified' => true,
            'company_id' => 2, // lié à Green Energy Solutions
        ]);
    }
}
