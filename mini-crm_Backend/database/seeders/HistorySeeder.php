<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\History;
class HistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $histories = [
            [
                'admin_id' => 1,
                'action' => 'Envoi d\'invitation',
                'description' => 'L\'administrateur a invité Employee Two à rejoindre l\'entreprise XYZ.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'admin_id' => 2,
                'action' => 'Annulation d\'invitation',
                'description' => 'L\'administrateur a annulé l\'invitation pour Alice Martin.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'admin_id' => 1,
                'action' => 'Validation d\'invitation',
                'description' => 'L\'administrateur a validé l\'invitation pour Karim El Fassi.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'admin_id' => 3,
                'action' => 'Compléter le profil',
                'description' => 'L\'employé Employee One a complété son profil.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($histories as $history) {
            History::create($history);
        }
    }
}
