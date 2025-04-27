<?php

namespace App\Http\Controllers\Api\Employer;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // ✅ Import correct ici

class EmployerController extends Controller
{
    public function index()
    {
        $employer = Auth::user();
        Log::info('Tentative d\'accès au tableau de bord par l\'utilisateur :', [
            'id' => $employer->id,
            'email' => $employer->email
        ]);

        if ($employer->role !== 'employee') {
            Log::warning('Accès refusé : rôle non autorisé.', [
                'id' => $employer->id,
                'role' => $employer->role
            ]);
            return response()->json(['error' => 'Accès non autorisé.'], 403);
        }

        $company = $employer->company;

        if (!$company) {
            Log::error('L\'utilisateur n\'est associé à aucune entreprise.', [
                'id' => $employer->id
            ]);
            return response()->json(['error' => 'Vous n\'êtes pas associé à une entreprise.'], 404);
        }

        $colleagues = User::where('company_id', $company->id)
                          ->where('id', '!=', $employer->id)
                          ->get();

        Log::info('Données récupérées avec succès pour l\'employeur.', [
            'employer_id' => $employer->id,
            'company_id' => $company->id,
            'colleagues_count' => $colleagues->count()
        ]);

        return response()->json([
            'employer' => $employer,
            'company' => $company,
            'colleagues' => $colleagues
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ]);

        $employer = Auth::user();
        $employer->update($request->all());

        Log::info('Profil mis à jour avec succès.', [
            'employer_id' => $employer->id
        ]);

        return response()->json(['message' => 'Profil mis à jour avec succès.']);
    }
}
