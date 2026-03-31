<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Brand;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Requests\UploadDesignRequest;
use App\Services\ClientService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_clients')) {
            abort(403, 'Unauthorized access to client index.');
        }

        $query = Client::query();
        $query->withCount('projects');

        if ($request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('id', $search)
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('industry', 'like', "%{$search}%");
            });
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        if ($request->from_date) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->to_date) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        if ($request->project_filter === 'has_projects') {
            $query->has('projects');
        } elseif ($request->project_filter === 'no_projects') {
            $query->doesntHave('projects');
        } elseif ($request->project_filter === 'recent_projects') {
            $query->whereHas('projects', function($q) {
                $q->where('created_at', '>=', now()->subMonths(3));
            });
        } elseif ($request->project_filter === 'old_projects') {
            $query->whereHas('projects', function($q) {
                $q->where('created_at', '<', now()->subMonths(6));
            });
        }

        // Project Date Filters
        if ($request->project_year) {
            $query->whereHas('projects', function($q) use ($request) {
                $q->whereYear('start_date', $request->project_year);
            });
        }
        if ($request->project_from_date) {
            $query->whereHas('projects', function($q) use ($request) {
                $q->whereDate('start_date', '>=', $request->project_from_date);
            });
        }
        if ($request->project_to_date) {
            $query->whereHas('projects', function($q) use ($request) {
                $q->whereDate('start_date', '<=', $request->project_to_date);
            });
        }

        return Inertia::render('Clients/Index', [
            'clients' => $query->latest()->paginate(12)->appends(request()->query()),
            'filters' => $request->only(['search', 'status', 'from_date', 'to_date', 'project_filter', 'project_year', 'project_from_date', 'project_to_date']),
            'stats' => [
                'total' => Client::count(),
                'active' => Client::where('status', 'active')->count(),
                'prospective' => Client::where('status', 'prospective')->count(),
            ]
        ]);
    }

    public function create(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_clients')) {
            abort(403, 'Unauthorized operation: Create Client.');
        }
        return Inertia::render('Clients/Create');
    }

    public function store(StoreClientRequest $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_clients')) {
            abort(403, 'Unauthorized operation: Create Client.');
        }
        $this->clientService->createClient(
            $request->validated(),
            $request->file('avatar'),
            $request->file('logo')
        );

        if ($request->input('stay_on_page')) {
            return back()->with('success', 'Client created successfully.');
        }

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    public function show(Request $request, Client $client)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_clients')) {
            abort(403, 'Unauthorized access to client profile.');
        }
        $client->load(['projects.expenses', 'projects.designs', 'payments', 'brands', 'designs', 'inventoryItems.brand']);

        // Aggregate ALL designs (Directly linked to client + Linked to client's projects)
        $projectDesigns = $client->projects->flatMap->designs;
        $allDesigns = $client->designs->concat($projectDesigns);

        // Calculate financial summary
        $total_contract_value = $client->projects->sum('budget');
        $total_paid = $client->payments->where('status', 'completed')->sum('amount');
        $total_due = max(0, $total_contract_value - $total_paid);

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'allDesigns' => $allDesigns,
            'projects' => $client->projects,
            'stats' => [
                'total_projects' => $client->projects->count(),
                'contract_value' => $total_contract_value,
                'total_paid' => $total_paid,
                'total_due' => $total_due,
            ],
            'available_brands' => Brand::all(['id', 'name']),
            'paymentMethods' => \App\Models\PaymentMethod::where('is_active', true)->get(),
        ]);
    }

    public function edit(Request $request, Client $client)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_clients')) {
            abort(403, 'Unauthorized operation: Edit Client.');
        }
        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_clients')) {
            abort(403, 'Unauthorized operation: Update Client.');
        }
        $this->clientService->updateClient(
            $client,
            $request->validated(),
            $request->file('avatar'),
            $request->file('logo')
        );

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }

    public function destroy(Request $request, Client $client)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('delete_clients')) {
            abort(403, 'Unauthorized operation: Delete Client.');
        }
        $this->clientService->deleteClient($client);

        return redirect()->route('clients.index')->with('success', 'Client deleted successfully.');
    }

    public function addBrand(Request $request, Client $client)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_clients')) {
            abort(403, 'Unauthorized operation: Link Brand.');
        }
        $request->validate(['brand_id' => 'required|exists:brands,id']);
        $client->brands()->syncWithoutDetaching([$request->brand_id]);
        return back()->with('success', 'Brand linked to client.');
    }

    public function removeBrand(Request $request, Client $client, Brand $brand)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_clients')) {
            abort(403, 'Unauthorized operation: Remove Brand.');
        }
        $client->brands()->detach($brand->id);
        return back()->with('success', 'Brand removed from client.');
    }

    public function bulkUploadDesign(Request $request, Client $client)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_clients')) {
            abort(403, 'Unauthorized operation: Bulk Upload.');
        }
        $request->validate([
            'files.*' => 'required|file|max:30720',
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                // Use clientService to store if available, or just implement directly for speed
                $path = $file->store('clients/designs/' . $client->id, 'public');
                $isImage = in_array(strtolower($file->getClientOriginalExtension()), ['jpg', 'jpeg', 'png', 'gif', 'webp']);

                $design = $client->designs()->create([
                    'title'       => $file->getClientOriginalName(),
                    'file_path'   => $path,
                    'thumbnail'   => $isImage ? $path : null,
                    'type'        => 'Bulk Asset',
                    'description' => 'Quick upload from portal',
                ]);

                // Also create initial version for consistency
                \App\Models\DesignVersion::create([
                    'design_id'      => $design->id,
                    'user_id'        => auth()->id(),
                    'version_number' => 1,
                    'file_path'      => $path,
                    'file_size'      => $file->getSize(),
                    'file_hash'      => md5_file($file->getRealPath()),
                    'is_current'     => true,
                ]);
            }
        }

        return back()->with('success', 'Designs uploaded successfully.');
    }

    public function uploadDesign(UploadDesignRequest $request, Client $client)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_clients')) {
            abort(403, 'Unauthorized operation: Upload Design.');
        }
        $this->clientService->uploadDesign(
            $client,
            $request->validated(),
            $request->file('file')
        );

        return back()->with('success', 'Design uploaded successfully.');
    }

    public function exportToExcel(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_clients')) {
            abort(403, 'Unauthorized operation: Export Data.');
        }
        $query = Client::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('company_name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        $clients = $query->latest()->get();

        // Create CSV content
        $csvData = [];
        $csvData[] = ['Company Name', 'Primary Contact', 'Email', 'Phone', 'Industry', 'Website', 'Status', 'Registered Date'];

        foreach ($clients as $client) {
            $csvData[] = [
                $client->company_name,
                $client->name,
                $client->email,
                $client->phone ?? 'N/A',
                $client->industry ?? 'N/A',
                $client->website ?? 'N/A',
                ucfirst($client->status),
                $client->created_at->format('Y-m-d'),
            ];
        }

        // Generate CSV
        $filename = 'clients_dossier_' . date('Y-m-d_His') . '.csv';
        $handle = fopen('php://temp', 'r+');

        foreach ($csvData as $row) {
            fputcsv($handle, $row);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return \Illuminate\Support\Facades\Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    public function destroyDesign(Request $request, \App\Models\Design $design)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_clients')) {
            abort(403, 'Unauthorized operation: Delete Design File.');
        }

        if ($design->file_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($design->file_path);
        }
        $design->delete();

        return redirect()->back()->with('success', 'Design file deleted successfully.');
    }

    public function replaceDesign(Request $request, \App\Models\Design $design)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_clients')) {
            abort(403, 'Unauthorized operation: Replace Design File.');
        }

        $request->validate([
            'file' => 'required|file|max:30720',
        ]);

        // Delete old file from storage
        if ($design->file_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($design->file_path);
        }

        $file = $request->file('file');
        $path = $file->store('client-designs', 'public');

        $design->update([
            'file_path' => $path,
            'file_name' => substr($file->getClientOriginalName(), 0, 255),
            'file_size' => $file->getSize(),
            'file_type' => substr($file->getClientMimeType(), 0, 100),
        ]);

        return redirect()->back()->with('success', 'Design file replaced successfully.');
    }
}

