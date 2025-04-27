<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Company;

use Illuminate\Support\Facades\Validator;

class CompanyController extends Controller
{
    public function index()
    {
        return Company::orderBy('name')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:companies,name',
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $company = Company::create($validated);
        return response()->json(['message' => 'Entreprise créée avec succès', 'data' => $company], 201);
    }

    public function show($id)
    {
        return Company::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $company = Company::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|unique:companies,name,' . $company->id,
            'logo' => 'nullable|string',
            'website' => 'nullable|url',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $company->update($validated);
        return response()->json(['message' => 'Entreprise mise à jour', 'data' => $company]);
    }

    public function destroy($id)
    {
        $company = Company::findOrFail($id);

        if ($company->employees()->count() > 0) {
            return response()->json(['message' => 'Impossible de supprimer une entreprise avec des employés'], 403);
        }

        $company->delete();
        return response()->json(['message' => 'Entreprise supprimée']);
    }
}
