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
    public function createProject(array $data, $files = [])
    {
        return DB::transaction(function () use ($data, $files) {
            // Handle contract_details by appending to description
            if (isset($data['contract_details'])) {
                $details = json_decode($data['contract_details'], true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $data['contract_details'] = $details;
                } else {
                    unset($data['contract_details']); // Invalid JSON
                }
            }

            // Remove designs from data if present
            if (isset($data['designs'])) {
                unset($data['designs']); // designs are handled via $files
            }

            // Remove image from data if present (old code artifact)
            if (isset($data['image'])) {
                unset($data['image']);
            }

            $project = Project::create($data);

            if ($files && is_array($files)) {
                foreach ($files as $file) {
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

            return $project;
        });
    }
    /**
     * Update the specified project.
     */
    public function updateProject(Project $project, array $data, $image = null)
    {
        return DB::transaction(function () use ($project, $data, $image) {
            if ($image) {
                if ($project->image) {
                    Storage::disk('public')->delete($project->image);
                }
                // Handle image update correctly if needed, but for now we focus on create
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
            return $project;
        });
    }

    /**
     * Remove the specified project.
     */
    public function deleteProject(Project $project)
    {
        return DB::transaction(function () use ($project) {
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
