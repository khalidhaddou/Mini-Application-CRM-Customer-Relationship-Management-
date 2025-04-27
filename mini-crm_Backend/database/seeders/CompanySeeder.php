<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Company::create([
            'name' => 'Tech Innovators',
            'logo' => 'logos/tech_innovators.png',
            'website' => 'https://www.techinnovators.com',
            'email' => 'contact@techinnovators.com',
            'phone' => '+212612345678',
            'description' => 'Une entreprise innovante dans la tech au Maroc.',
        ]);

        Company::create([
            'name' => 'Green Energy Solutions',
            'logo' => 'logos/green_energy.png',
            'website' => 'https://www.greenenergy.com',
            'email' => 'info@greenenergy.com',
            'phone' => '+212698745123',
            'description' => 'Spécialiste des énergies renouvelables.',
        ]);
    }
}
