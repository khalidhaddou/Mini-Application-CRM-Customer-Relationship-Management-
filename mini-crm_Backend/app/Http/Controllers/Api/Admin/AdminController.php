<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Company;
use App\Models\Invitation;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminController extends Controller
{
    // 🔄 Lister tous les administrateurs
    public function index()
    {
        return response()->json(User::where('role', 'admin')->get());
    }

    // ➕ Créer un administrateur
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $admin = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
        ]);

        return response()->json(['message' => 'Administrateur créé avec succès.', 'admin' => $admin], 201);
    }

    // ✏️ Mettre à jour un administrateur
    public function update(Request $request, $id)
    {
        $admin = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', 'max:255', Rule::unique('users')->ignore($admin->id)],
            'password' => 'nullable|string|min:6|confirmed',
        ]);

        $admin->update([
            'name' => $validated['name'] ?? $admin->name,
            'email' => $validated['email'] ?? $admin->email,
            'password' => isset($validated['password']) ? Hash::make($validated['password']) : $admin->password,
        ]);

        return response()->json(['message' => 'Administrateur mis à jour avec succès.', 'admin' => $admin]);
    }

    // ❌ Supprimer un administrateur
    public function destroy($id)
    {
        $admin = User::findOrFail($id);

        if ($admin->role !== 'admin') {
            return response()->json(['error' => 'Ce compte n’est pas un administrateur.'], 403);
        }

        $admin->delete();

        return response()->json(['message' => 'Administrateur supprimé avec succès.']);
    }
    public function dashboard()
    {
        // Vérifier si l'utilisateur est authentifié
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $admin = auth()->user(); // L'admin connecté

        // Vérifier si l'utilisateur est un administrateur
        if ($admin->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // Récupérer les statistiques des invitations
        $invitationStats = Invitation::selectRaw('
            COUNT(*) as total,
            SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
            SUM(CASE WHEN status = "cancelled" THEN 1 ELSE 0 END) as cancelled
        ')->first();

      

        // Récupérer les 5 dernières entreprises créées
        $latestCompanies = Company::latest()->take(5)->get();

        return response()->json([
            'name' => $admin->name,
            'email' => $admin->email,
            'total_companies' => Company::count(),
            'total_invitations' => $invitationStats->total,
            'pending_invitations' => $invitationStats->pending,
            'cancelled_invitations' => $invitationStats->cancelled,
            'history' => $admin->history()->latest()->take(5)->get()->map(function ($history) {
                // Optionnel : formater la date
                $history->created_at = $history->created_at->format('d-m-Y H:i');
                return $history;
            }),
            'latest_companies' => $latestCompanies,


        ]);
    }

}
