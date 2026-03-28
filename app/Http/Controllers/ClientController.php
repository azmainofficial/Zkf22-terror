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
        $query = Client::query();

        if ($request->search) {
            $query->where('name', 'like', '%' . $request->search . '%')
                ->orWhere('company_name', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%');
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        return Inertia::render('Clients/Index', [
            'clients' => $query->latest()->paginate(12)->appends(request()->query()),
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => Client::count(),
                'active' => Client::where('status', 'active')->count(),
                'prospective' => Client::where('status', 'prospective')->count(),
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    public function store(StoreClientRequest $request)
    {
        $this->clientService->createClient(
            $request->validated(),
            $request->file('avatar'),
            $request->file('logo')
        );

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    public function show(Client $client)
    {
        $client->load(['projects.expenses', 'payments', 'brands', 'designs', 'inventoryItems.brand']);

        // Calculate financial summary
        $total_contract_value = $client->projects->sum('budget');
        $total_paid = $client->payments->where('status', 'completed')->sum('amount');
        $total_due = max(0, $total_contract_value - $total_paid);

        return Inertia::render('Clients/Show', [
            'client' => $client,
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

    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $this->clientService->updateClient(
            $client,
            $request->validated(),
            $request->file('avatar'),
            $request->file('logo')
        );

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }

    public function destroy(Client $client)
    {
        $this->clientService->deleteClient($client);

        return redirect()->route('clients.index')->with('success', 'Client deleted successfully.');
    }

    public function addBrand(Request $request, Client $client)
    {
        $request->validate(['brand_id' => 'required|exists:brands,id']);
        $client->brands()->syncWithoutDetaching([$request->brand_id]);
        return back()->with('success', 'Brand linked to client.');
    }

    public function removeBrand(Client $client, Brand $brand)
    {
        $client->brands()->detach($brand->id);
        return back()->with('success', 'Brand removed from client.');
    }

    public function uploadDesign(UploadDesignRequest $request, Client $client)
    {
        $this->clientService->uploadDesign(
            $client,
            $request->validated(),
            $request->file('file')
        );

        return back()->with('success', 'Design uploaded successfully.');
    }

    public function exportToExcel(Request $request)
    {
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
}
