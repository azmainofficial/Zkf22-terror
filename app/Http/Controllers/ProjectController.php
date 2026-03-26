<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Client;
use App\Models\InventoryItem;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Requests\AddMaterialRequest;
use App\Models\ProjectMaterial;
use App\Services\ProjectService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(Request $request)
    {
        $query = Project::with(['client']);

        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%')
                ->orWhereHas('client', function ($q) use ($request) {
                    $q->where('name', 'like', '%' . $request->search . '%')
                        ->orWhere('company_name', 'like', '%' . $request->search . '%');
                });
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        return Inertia::render('Projects/Index', [
            'projects' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status']),
            'clients' => Client::all(['id', 'name', 'company_name']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Projects/Create', [
            'clients' => Client::all(['id', 'name', 'company_name']),
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        $this->projectService->createProject(
            $request->validated(),
            $request->file('designs', [])
        );

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function show(Project $project)
    {
        $project->load(['client', 'expenses', 'projectMaterials.inventoryItem.brand.supplier']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'designs' => $project->designs,
            'connectedInventory' => InventoryItem::where('project_id', $project->id)
                ->with(['brand', 'supplier'])
                ->get(),
        ]);
    }

    public function uploadDesign(Request $request, Project $project)
    {
        $request->validate([
            'files.*' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx,xls,xlsx|max:10240',
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('project-designs', 'public');

                $project->designs()->create([
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'file_type' => $file->getClientMimeType(),
                ]);
            }
        }

        return redirect()->back()->with('success', 'Designs uploaded successfully.');
    }

    public function edit(Project $project)
    {
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'clients' => Client::all(['id', 'name', 'company_name']),
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $this->projectService->updateProject(
            $project,
            $request->validated(),
            $request->file('image')
        );

        return redirect()->route('projects.show', $project->id)->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project)
    {
        $this->projectService->deleteProject($project);

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }

    public function addMaterial(AddMaterialRequest $request, Project $project)
    {
        $this->projectService->addMaterial($project, $request->validated());

        return redirect()->back()->with('success', 'Material added successfully.');
    }

    public function updateMaterial(Request $request, ProjectMaterial $projectMaterial)
    {
        $validated = $request->validate([
            'quantity_needed' => 'required|numeric|min:0',
            'quantity_used' => 'nullable|numeric|min:0',
            'unit_cost' => 'required|numeric|min:0',
        ]);

        $this->projectService->updateMaterial($projectMaterial, $validated);

        return redirect()->back()->with('success', 'Material updated successfully.');
    }

    public function removeMaterial(ProjectMaterial $projectMaterial)
    {
        $this->projectService->removeMaterial($projectMaterial);

        return redirect()->back()->with('success', 'Material removed successfully.');
    }
}
