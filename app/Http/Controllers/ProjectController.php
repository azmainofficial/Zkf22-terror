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
use App\Models\User;
use App\Notifications\DesignReviewedNotification;
use Illuminate\Support\Facades\Notification;

class ProjectController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_projects')) {
            abort(403, 'Unauthorized access to project portfolio.');
        }

        $query = Project::with(['client']);

        // Persist global counts regardless of filters/pagination
        $stats = [
            'all'       => Project::count(),
            'ongoing'   => Project::where('status', 'ongoing')->count(),
            'completed' => Project::where('status', 'completed')->count(),
            'pending'   => Project::where('status', 'pending')->count(),
            'on_hold'   => Project::where('status', 'on_hold')->count(),
            'cancelled' => Project::where('status', 'cancelled')->count(),
        ];

        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhereHas('client', function ($sq) use ($request) {
                      $sq->where('name', 'like', '%' . $request->search . '%')
                         ->orWhere('company_name', 'like', '%' . $request->search . '%');
                  });
            });
        }

        if ($request->status && $request->status !== 'All') {
            $query->where('status', strtolower($request->status));
        }

        return Inertia::render('Projects/Index', [
            'projects' => $query->latest()->paginate(10)->appends(request()->query()),
            'filters'  => $request->only(['search', 'status']),
            'stats'    => $stats,
            'clients'  => Client::all(['id', 'name', 'company_name']),
        ]);
    }

    public function create(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_projects')) {
            abort(403, 'Unauthorized operation: Create Project.');
        }
        return Inertia::render('Projects/Create', [
            'clients' => Client::all(['id', 'name', 'company_name']),
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_projects')) {
            abort(403, 'Unauthorized operation: Create Project.');
        }
        $this->projectService->createProject(
            $request->validated(),
            $request->file('designs'),
            $request->file('documents')
        );

        return redirect()->route('projects.index')->with('success', 'Project created successfully.');
    }

    public function show(Request $request, Project $project)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_projects')) {
            abort(403, 'Unauthorized access to project details.');
        }
        $project->load(['client', 'expenses', 'projectMaterials.inventoryItem.brand.supplier', 'designs', 'clientDesigns', 'payments', 'documents']);

        $allDesigns = $project->designs->concat($project->clientDesigns);

        // Calculate project totals
        $contract_amount = $project->budget ?? 0;
        $paid_amount = $project->payments->where('status', 'completed')->sum('amount');
        $due_amount = max(0, $contract_amount - $paid_amount);

        // Automated progress calculation (Financial Progress)
        $calculated_progress = $contract_amount > 0 ? min(100, round(($paid_amount / $contract_amount) * 100)) : 0;

        // Sync local progress if status is not 'completed' or 'cancelled' or manually set to 100%
        if (!in_array($project->status, ['completed', 'cancelled'])) {
            $project->update(['progress' => $calculated_progress]);
        }

        $slipDesign = \App\Models\SlipDesign::where('is_active', true)
            ->whereIn('type', ['project', 'report'])
            ->first() ?? \App\Models\SlipDesign::where('is_active', true)->first();

        return Inertia::render('Projects/Show', [
            'project' => $project,
            'slipDesign' => $slipDesign,
            'designs' => $allDesigns,
            'connectedInventory' => InventoryItem::where('project_id', $project->id)
                ->with(['brand', 'supplier'])
                ->get(),
            'stats' => [
                'contract_amount' => $contract_amount,
                'paid_amount' => $paid_amount,
                'due_amount' => $due_amount,
                'calculated_progress' => $calculated_progress,
            ]
        ]);
    }

    public function uploadDesign(Request $request, Project $project)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Upload Design.');
        }

        $request->validate([
            'files.*' => 'required|file|max:102400', // 100MB for large CAD/DWG files
        ]);

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('project-designs', 'public');

                $project->designs()->create([
                    'file_path' => $path,
                    'file_name' => substr($file->getClientOriginalName(), 0, 255),
                    'file_size' => $file->getSize(),
                    'file_type' => substr($file->getClientMimeType(), 0, 100),
                ]);
            }
        }

        return redirect()->back()->with('success', 'Designs uploaded successfully.');
    }

    public function uploadDocument(Request $request, Project $project)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Upload Documentation.');
        }

        $request->validate([
            'documents.*' => 'required|file|max:102400',
        ]);

        if ($request->hasFile('documents')) {
            foreach ($request->file('documents') as $file) {
                $path = $file->store('project-documents', 'public');

                $project->documents()->create([
                    'file_path' => $path,
                    'file_name' => substr($file->getClientOriginalName(), 0, 255),
                    'file_size' => $file->getSize(),
                    'file_type' => substr($file->getClientMimeType(), 0, 100),
                ]);
            }
        }

        return redirect()->back()->with('success', 'Formal documentation uploaded successfully.');
    }

    public function edit(Request $request, Project $project)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Edit Project.');
        }
        return Inertia::render('Projects/Edit', [
            'project' => $project,
            'clients' => Client::all(['id', 'name', 'company_name']),
        ]);
    }

    public function updateStatus(Request $request, Project $project)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Update Status.');
        }

        $validated = $request->validate([
            'status'   => 'nullable|in:pending,ongoing,on_hold,completed,cancelled',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $project->update(array_filter($validated, fn($v) => $v !== null));

        return back()->with('success', 'Project updated.');
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Edit Project.');
        }
        $this->projectService->updateProject(
            $project,
            $request->validated(),
            $request->file('image'),
            $request->file('designs'),
            $request->file('documents')
        );

        return redirect()->route('projects.show', $project->id)->with('success', 'Project updated successfully.');
    }

    public function destroy(Request $request, Project $project)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('delete_projects')) {
            abort(403, 'Unauthorized operation: Delete Project.');
        }
        $this->projectService->deleteProject($project);

        return redirect()->route('projects.index')->with('success', 'Project deleted successfully.');
    }

    public function addMaterial(AddMaterialRequest $request, Project $project)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Add Material.');
        }
        $this->projectService->addMaterial($project, $request->validated());

        return redirect()->back()->with('success', 'Material added successfully.');
    }

    public function updateMaterial(Request $request, ProjectMaterial $projectMaterial)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Update Material.');
        }
        $validated = $request->validate([
            'quantity_needed' => 'required|numeric|min:0',
            'quantity_used' => 'nullable|numeric|min:0',
            'unit_cost' => 'required|numeric|min:0',
        ]);

        $this->projectService->updateMaterial($projectMaterial, $validated);

        return redirect()->back()->with('success', 'Material updated successfully.');
    }

    public function removeMaterial(Request $request, ProjectMaterial $projectMaterial)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Remove Material.');
        }
        $this->projectService->removeMaterial($projectMaterial);

        return redirect()->back()->with('success', 'Material removed successfully.');
    }

    public function destroyDesign(Request $request, Project $project, \App\Models\ProjectDesign $design)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Delete Design File.');
        }

        if ($design->project_id !== $project->id) {
            abort(403, 'This file does not belong to the specified project.');
        }

        if ($design->file_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($design->file_path);
        }
        $design->delete();

        return redirect()->back()->with('success', 'Design file deleted successfully.');
    }

    public function replaceDesign(Request $request, Project $project, \App\Models\ProjectDesign $design)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Replace Design File.');
        }

        if ($design->project_id !== $project->id) {
            abort(403, 'This file does not belong to the specified project.');
        }

        $request->validate([
            'file'    => 'required|file|max:102400',
            'status'  => 'required|in:pending,approved,modification_required',
            'remarks' => 'nullable|string|max:1000',
        ]);

        // Delete old file from storage
        if ($design->file_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($design->file_path);
        }

        $file = $request->file('file');
        $path = $file->store('project-designs', 'public');

        $design->update([
            'file_path' => $path,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'file_type' => $file->getClientMimeType(),
            'status'    => $request->status,
            'remarks'   => $request->remarks,
        ]);

        // Notify other permitted users
        $usersToNotify = User::where('id', '!=', $request->user()->id)
            ->where(function ($query) {
                $query->whereHas('roles', function ($q) { $q->where('name', 'admin'); })
                ->orWhereHas('roles.permissions', function ($q) {
                    $q->whereIn('name', ['edit_projects', 'view_project_designs']);
                });
            })->get();

        \Illuminate\Support\Facades\Notification::send($usersToNotify, new \App\Notifications\DesignReviewedNotification($design, $project, $request->user()));

        return redirect()->back()->with('success', 'Design file replaced and updated successfully.');
    }

    public function updateReviewStatus(Request $request, Project $project, \App\Models\ProjectDesign $design)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Update Review Status.');
        }

        if ($design->project_id !== $project->id) {
            abort(403, 'This design does not belong to the specified project.');
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,modification_required',
            'remarks' => 'nullable|string|max:1000',
        ]);

        $design->update($validated);
        
        // Notify other permitted users
        $usersToNotify = User::where('id', '!=', $request->user()->id)
            ->where(function ($query) {
                // Admins
                $query->whereHas('roles', function ($q) { $q->where('name', 'admin'); })
                // Or users with specific design view/edit permissions
                ->orWhereHas('roles.permissions', function ($q) {
                    $q->whereIn('name', ['edit_projects', 'view_project_designs']);
                });
            })->get();

        Notification::send($usersToNotify, new DesignReviewedNotification($design, $project, $request->user()));

        return redirect()->back()->with('success', 'Design status updated successfully.');
    }

    public function destroyDocument(Request $request, Project $project, \App\Models\ProjectDocument $document)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Delete Document.');
        }

        if ($document->project_id !== $project->id) {
            abort(403, 'This document does not belong to the specified project.');
        }

        if ($document->file_path) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($document->file_path);
        }
        
        $document->delete();

        return redirect()->back()->with('success', 'Document deleted successfully.');
    }

    public function renameDocument(Request $request, Project $project, \App\Models\ProjectDocument $document)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_projects')) {
            abort(403, 'Unauthorized operation: Rename Document.');
        }

        $validated = $request->validate([
            'file_name' => 'required|string|max:255',
        ]);

        $document->update($validated);

        return redirect()->back()->with('success', 'Document renamed successfully.');
    }
}
