<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\UploadedFile;

class ProjectService
{
    /**
     * Store a newly created project.
     */
    public function createProject(array $data, $designFiles = [], $docFiles = [])
    {
        return DB::transaction(function () use ($data, $designFiles, $docFiles) {
            // Handle field mappings
            if (isset($data['deadline']) && !isset($data['end_date'])) {
                $data['end_date'] = $data['deadline'];
            }
            unset($data['deadline']);

            if (isset($data['contract_amount']) && !isset($data['budget'])) {
                $data['budget'] = $data['contract_amount'];
            }
            unset($data['contract_amount']);

            // Handle contract_details
            if (isset($data['contract_details'])) {
                if (is_string($data['contract_details'])) {
                    $details = json_decode($data['contract_details'], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $data['contract_details'] = $details;
                    } else {
                        unset($data['contract_details']); // Invalid JSON
                    }
                }
                // If it's already an array, leave it as is
            }

            // Remove non-fillable fields
            unset($data['designs'], $data['documents'], $data['image'], $data['_method']);

            $project = Project::create($data);

            // Handle Designs
            if ($designFiles && is_array($designFiles)) {
                foreach ($designFiles as $file) {
                    if ($file instanceof UploadedFile) {
                        $path = $file->store('project-designs', 'public');
                        $project->designs()->create([
                            'file_path' => $path,
                            'file_name' => $file->getClientOriginalName(),
                            'file_size' => $file->getSize(),
                            'file_type' => $file->getClientMimeType(),
                        ]);
                    }
                }
            }

            // Handle Documents
            if ($docFiles && is_array($docFiles)) {
                foreach ($docFiles as $file) {
                    if ($file instanceof UploadedFile) {
                        $path = $file->store('project-documents', 'public');
                        $project->documents()->create([
                            'file_path' => $path,
                            'file_name' => $file->getClientOriginalName(),
                            'file_size' => $file->getSize(),
                            'file_type' => $file->getClientMimeType(),
                        ]);
                    }
                }
            }

            return $project;
        });
    }
    /**
     * Update the specified project.
     */
    public function updateProject(Project $project, array $data, $image = null, $designFiles = [], $docFiles = [])
    {
        return DB::transaction(function () use ($project, $data, $image, $designFiles, $docFiles) {
            // Map form field names to DB column names
            if (isset($data['deadline']) && !isset($data['end_date'])) {
                $data['end_date'] = $data['deadline'];
            }
            unset($data['deadline']);

            if (isset($data['contract_amount']) && !isset($data['budget'])) {
                $data['budget'] = $data['contract_amount'];
            }
            unset($data['contract_amount']);

            // Remove non-fillable / file fields
            unset($data['_method'], $data['designs'], $data['documents']);

            if ($image) {
                if ($project->image) {
                    Storage::disk('public')->delete($project->image);
                }
                if ($image instanceof UploadedFile) {
                    $path = $image->store('projects', 'public');
                    $data['image'] = $path;
                }
            }

            if (isset($data['contract_details'])) {
                if (is_string($data['contract_details'])) {
                    $details = json_decode($data['contract_details'], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $data['contract_details'] = $details;
                    } else {
                        unset($data['contract_details']);
                    }
                }
            }

            $project->update($data);

            // Handle Designs
            if ($designFiles && is_array($designFiles)) {
                foreach ($designFiles as $file) {
                    if ($file instanceof UploadedFile) {
                        $path = $file->store('project-designs', 'public');
                        $project->designs()->create([
                            'file_path' => $path,
                            'file_name' => $file->getClientOriginalName(),
                            'file_size' => $file->getSize(),
                            'file_type' => $file->getClientMimeType(),
                        ]);
                    }
                }
            }

            // Handle Documents
            if ($docFiles && is_array($docFiles)) {
                foreach ($docFiles as $file) {
                    if ($file instanceof UploadedFile) {
                        $path = $file->store('project-documents', 'public');
                        $project->documents()->create([
                            'file_path' => $path,
                            'file_name' => $file->getClientOriginalName(),
                            'file_size' => $file->getSize(),
                            'file_type' => $file->getClientMimeType(),
                        ]);
                    }
                }
            }

            return $project;
        });
    }

    /**
     * Remove the specified project.
     */
    public function deleteProject(Project $project)
    {
        return DB::transaction(function () use ($project) {
            // Cascade delete related entities
            \App\Models\InventoryItem::where('project_id', $project->id)->delete();
            \App\Models\Payment::where('project_id', $project->id)->delete();
            \App\Models\ProjectMaterial::where('project_id', $project->id)->delete();
            \App\Models\Expense::where('project_id', $project->id)->delete();
            \App\Models\ProjectDesign::where('project_id', $project->id)->delete();
            \App\Models\Design::where('project_id', $project->id)->delete();

            if ($project->image) {
                Storage::disk('public')->delete($project->image);
            }
            
            return $project->delete();
        });
    }

    /**
     * Add material to project.
     */
    public function addMaterial(Project $project, array $data)
    {
        return $project->projectMaterials()->create($data);
    }

    /**
     * Update project material.
     */
    public function updateMaterial(\App\Models\ProjectMaterial $material, array $data)
    {
        return $material->update($data);
    }

    /**
     * Remove project material.
     */
    public function removeMaterial(\App\Models\ProjectMaterial $material)
    {
        return $material->delete();
    }
}
