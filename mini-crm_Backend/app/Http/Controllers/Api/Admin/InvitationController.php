<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Invitation;
use App\Models\User;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\InvitationEmail;

class InvitationController extends Controller
{
    // ➕ Inviter un employé
    public function invite(Request $request)
    {
        $validated = $request->validate(
            [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email|unique:invitations,email',
                'company_id' => 'required|exists:companies,id',
                'user_id' => 'required|exists:users,id',
            ],
            [
                'name.required' => 'Le nom est obligatoire.',
                'email.required' => 'L\'email est obligatoire.',
                'email.email' => 'L\'email doit être valide.',
                'email.unique' => 'L\'email existe déjà dans les utilisateurs ou les invitations.',
                'company_id.required' => 'L\'ID de l\'entreprise est obligatoire.',
                'company_id.exists' => 'L\'ID de l\'entreprise est invalide.',
                'user_id.required' => 'L\'ID de l\'utilisateur est obligatoire.',
                'user_id.exists' => 'L\'ID de l\'utilisateur est invalide.',
            ],
        );

        $token = Str::uuid(); // Générer un token unique

        // Créer l'invitation dans la base de données
        $invitation = Invitation::create([
            'user_id' => $validated['user_id'],
            'company_id' => $validated['company_id'],
            'name' => $validated['name'],
            'email' => $validated['email'],
            'token' => $token,
            'status' => 'pending', // L'invitation est en attente
        ]);

        // Envoyer un email avec le lien d'invitation
        Mail::to($validated['email'])->send(new InvitationEmail($invitation));
        // Ajouter l'historique
        History::create([
            'admin_id' => auth()->user()->id, // L'admin qui envoie l'invitation
            'action' => 'Envoi d\'invitation',
            'description' => "L'administrateur a invité {$validated['name']} à rejoindre l'entreprise {$invitation->company->name}.",
        ]);
        return response()->json($invitation);
    }

    public function getAllInv()
    {
        return Invitation::all();
    }
    // 📜 Voir les invitations en attente
    public function pending()
    {
        $invitations = Invitation::where('status', 'pending')->get();
        return response()->json($invitations);
    }

    // ❌ Annuler une invitation
    public function cancel($id)
    {
        $invitation = Invitation::findOrFail($id);

        if ($invitation->status !== 'pending') {
            return response()->json(['error' => 'Impossible d’annuler une invitation déjà traitée.'], 403);
        }

        $invitation->update(['status' => 'cancelled']);
        // Ajouter l'historique
        History::create([
            'admin_id' => auth()->user()->id,
            'action' => 'Annulation d\'invitation',
            'description' => "L'administrateur a annulé l'invitation pour {$invitation->name}.",
        ]);

        return response()->json(['message' => 'Invitation annulée.']);
    }

    // 📝 Valider le lien d'invitation
    public function validateInvitation($token)
    {
        $invitation = Invitation::where('token', $token)->first();

        if (!$invitation || $invitation->status != 'pending') {
            return response()->json(['error' => 'Lien invalide ou expiré.'], 400);
        }
        // Ajouter l'historique
        History::create([
            'admin_id' => $invitation->user_id ,
            'action' => 'Validation d\'invitation',
            'description' => "L'administrateur a validé l'invitation pour {$invitation->name}.",
        ]);
        return response()->json([
            'name' => $invitation->name,
            'email' => $invitation->email,
        ]);
    }

    // ✅ Compléter le profil de l'employé
    public function completeProfile(Request $request, $token)
    {
        $invitation = Invitation::where('token', $token)->first();

        if (!$invitation || $invitation->status != 'pending') {
            return response()->json(['error' => 'Lien invalide ou expiré.'], 400);
        }

        // Valider et mettre à jour les informations de l'utilisateur
        $validated = $request->validate([
            'password' => 'required|min:6',
            'phone' => 'required|string',
            'address' => 'required|string',
            'birthdate' => 'required|date',
        ]);

        // Créer l'utilisateur et compléter son profil
        $user = User::create([
            'name' => $invitation->name,
            'email' => $invitation->email,
            'password' => bcrypt($validated['password']),
            'phone_number' => $validated['phone'],
            'address' => $validated['address'],
            'birth_date' => $validated['birthdate'],
            'is_verified' => true,
            'company_id' => $invitation->company_id,
        ]);

        // Marquer l'invitation comme "validée"
        $invitation->update(['status' => 'accepted']);

        // Ajouter l'historique
        History::create([
            'admin_id' =>1,
            'action' => 'Compléter le profil',
            'description' => "L'employé {$invitation->name} a complété son profil.",
        ]);
        return response()->json(['message' => 'Profil complété avec succès.']);
    }

}
