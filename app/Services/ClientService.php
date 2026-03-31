<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Design;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ClientService
{
    /**
     * Store a newly created client.
     */
    public function createClient(array $data, $avatar = null, $logo = null)
    {
        return DB::transaction(function () use ($data, $avatar, $logo) {
            if ($avatar) {
                $data['avatar'] = $avatar->store('clients/avatars', 'public');
            }
            if ($logo) {
                $data['logo'] = $logo->store('clients/logos', 'public');
            }

            return Client::create($data);
        });
    }

    /**
     * Update the specified client.
     */
    public function updateClient(Client $client, array $data, $avatar = null, $logo = null)
    {
        return DB::transaction(function () use ($client, $data, $avatar, $logo) {
            if ($avatar) {
                if ($client->avatar) {
                    Storage::disk('public')->delete($client->avatar);
                }
                $data['avatar'] = $avatar->store('clients/avatars', 'public');
            }
            if ($logo) {
                if ($client->logo) {
                    Storage::disk('public')->delete($client->logo);
                }
                $data['logo'] = $logo->store('clients/logos', 'public');
            }

            $client->update($data);
            return $client;
        });
    }

    /**
     * Remove the specified client.
     */
    public function deleteClient(Client $client)
    {
        return DB::transaction(function () use ($client) {
            // Cascade delete projects (which trigger their own cascade via ProjectService)
            $projectService = app(\App\Services\ProjectService::class);
            foreach ($client->projects as $project) {
                $projectService->deleteProject($project);
            }

            // Client-direct relations cascade
            \App\Models\InventoryItem::where('client_id', $client->id)->delete();
            \App\Models\Payment::where('client_id', $client->id)->delete();
            \App\Models\Design::where('client_id', $client->id)->delete();

            if ($client->avatar) {
                Storage::disk('public')->delete($client->avatar);
            }
            if ($client->logo) {
                Storage::disk('public')->delete($client->logo);
            }
            
            return $client->delete();
        });
    }

    /**
     * Upload design for client.
     */
    public function uploadDesign(Client $client, array $data, $file)
    {
        return DB::transaction(function () use ($client, $data, $file) {
            $path = $file->store('clients/designs/' . $client->id, 'public');

            // Simple check if it's an image to set as thumbnail
            $isImage = in_array(strtolower($file->getClientOriginalExtension()), ['jpg', 'jpeg', 'png', 'gif', 'webp']);
            $thumbnail = $isImage ? $path : null;

            $design = Design::create([
                'title' => $data['title'],
                'client_id' => $client->id,
                'project_id' => $data['project_id'] ?? null,
                'file_path' => $path,
                'thumbnail' => $thumbnail,
                'type' => $data['type'],
                'description' => $data['description'] ?? null,
            ]);

            // Create initial version (version 1)
            \App\Models\DesignVersion::create([
                'design_id' => $design->id,
                'user_id' => auth()->id(),
                'version_number' => 1,
                'file_path' => $path,
                'file_size' => $file->getSize(),
                'file_hash' => md5_file($file->getRealPath()),
                'change_description' => 'Initial upload',
                'is_current' => true,
            ]);

            // Log the activity
            \App\Models\AuditLog::log(
                'created',
                $design,
                "Uploaded new design: {$design->title}",
                null,
                ['file_name' => $file->getClientOriginalName()]
            );

            return $design;
        });
    }
}
