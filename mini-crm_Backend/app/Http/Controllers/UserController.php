<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Ajouter un utilisateur
    public function store(Request $request)
    {
        // Validation des données de l'utilisateur
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|in:admin,employee', // Rôle doit être 'admin' ou 'employee'
        ]);

        // Retourner les erreurs si la validation échoue
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Créer un nouvel utilisateur
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Retourner une réponse avec le nouvel utilisateur créé
        return response()->json(['message' => 'Utilisateur ajouté avec succès', 'user' => $user], 201);
    }

    // Modifier un utilisateur
    public function update(Request $request, $id)
    {
        // Validation des données de l'utilisateur
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id, // Validation de l'email en tenant compte de l'ID pour les mises à jour
            'phone_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'birth_date' => 'nullable|date',
        ]);

        // Trouver l'utilisateur par son ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Mettre à jour l'utilisateur
        $user->name = $request->name;
        $user->email = $request->email;

        // Mettre à jour le numéro de téléphone et l'adresse si fournis
        if ($request->has('phone_number')) {
            $user->phone_number = $request->phone_number;
        }
        if ($request->has('address')) {
            $user->address = $request->address;
        }
        if ($request->has('birth_date')) {
            $user->birth_date = $request->birth_date;
        }

        // Si un mot de passe est fourni, le mettre à jour
        if ($request->password) {
            $user->password = Hash::make($request->password);
        }

        // Sauvegarder les modifications
        $user->save();

        return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'user' => $user], 200);
    }
    // Changer le mot de passe d'un utilisateur
    public function changePassword(Request $request, $id)
    {
        // Validation des données
        $request->validate([
            'current_password' => 'required|string', // Mot de passe actuel
            'new_password' => 'required|string', // Nouveau mot de passe
        ]);

        // Trouver l'utilisateur par son ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Vérifier si le mot de passe actuel est correct
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Le mot de passe actuel est incorrect'], 400);
        }

        // Mettre à jour le mot de passe
        $user->password = Hash::make($request->new_password);

        // Sauvegarder les modifications
        $user->save();

        return response()->json(['message' => 'Mot de passe mis à jour avec succès'], 200);
    }

    // Supprimer un utilisateur
    public function destroy($id)
    {
        // Trouver l'utilisateur par son ID
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'Utilisateur non trouvé'], 404);
        }

        // Supprimer l'utilisateur
        $user->delete();

        return response()->json(['message' => 'Utilisateur supprimé avec succès'], 200);
    }
    public function allEmplyee()
    {
        // Filtrer les utilisateurs avec le rôle 'employe' et charger également les entreprises associées
        $users = User::where('role', 'employee')->with('company')->get();

        return response()->json($users);
    }
}
