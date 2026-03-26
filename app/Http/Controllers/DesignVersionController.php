<?php

namespace App\Http\Controllers;

use App\Models\Design;
use App\Models\DesignVersion;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DesignVersionController extends Controller
{
    /**
     * Get version history for a design
     */
    public function index(Design $design)
    {
        $versions = $design->versions()->with('user')->get();

        return Inertia::render('Designs/Versions', [
            'design' => $design,
            'versions' => $versions,
        ]);
    }

    /**
     * Upload a new version of a design
     */
    public function store(Request $request, Design $design)
    {
        $request->validate([
            'file' => 'required|file|max:102400', // 100MB
            'change_description' => 'nullable|string|max:1000',
        ]);

        // Get the next version number
        $latestVersion = $design->versions()->max('version_number') ?? 0;
        $newVersionNumber = $latestVersion + 1;

        // Store the file
        $file = $request->file('file');
        $fileName = time() . '_v' . $newVersionNumber . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs('designs/versions', $fileName, 'public');

        // Mark all previous versions as not current
        $design->versions()->update(['is_current' => false]);

        // Create new version
        $version = DesignVersion::create([
            'design_id' => $design->id,
            'user_id' => auth()->id(),
            'version_number' => $newVersionNumber,
            'file_path' => $filePath,
            'file_size' => $file->getSize(),
            'file_hash' => md5_file($file->getRealPath()),
            'change_description' => $request->change_description,
            'is_current' => true,
        ]);

        // Update the design's main file path to point to the new version
        $design->update([
            'file_path' => $filePath,
        ]);

        // Log the activity
        AuditLog::log(
            'version_created',
            $design,
            "Created version {$newVersionNumber} of design: {$design->title}",
            null,
            ['version_number' => $newVersionNumber, 'file_name' => $fileName]
        );

        return redirect()->back()->with('success', 'New version uploaded successfully.');
    }

    /**
     * Restore a previous version
     */
    public function restore(Design $design, DesignVersion $version)
    {
        // Verify the version belongs to this design
        if ($version->design_id !== $design->id) {
            abort(403, 'Version does not belong to this design.');
        }

        // Mark all versions as not current
        $design->versions()->update(['is_current' => false]);

        // Mark this version as current
        $version->update(['is_current' => true]);

        // Update the design's main file path
        $design->update([
            'file_path' => $version->file_path,
        ]);

        // Log the activity
        AuditLog::log(
            'version_restored',
            $design,
            "Restored version {$version->version_number} of design: {$design->title}",
            null,
            ['version_number' => $version->version_number]
        );

        return redirect()->back()->with('success', "Version {$version->version_number} restored successfully.");
    }

    /**
     * Download a specific version
     */
    public function download(Design $design, DesignVersion $version)
    {
        // Verify the version belongs to this design
        if ($version->design_id !== $design->id) {
            abort(403, 'Version does not belong to this design.');
        }

        // Log the download
        AuditLog::log(
            'version_downloaded',
            $design,
            "Downloaded version {$version->version_number} of design: {$design->title}",
            null,
            ['version_number' => $version->version_number]
        );

        $filePath = storage_path('app/public/' . $version->file_path);

        if (!file_exists($filePath)) {
            abort(404, 'File not found.');
        }

        return response()->download($filePath);
    }

    /**
     * Delete a version (soft delete - keep file but mark as deleted)
     */
    public function destroy(Design $design, DesignVersion $version)
    {
        // Verify the version belongs to this design
        if ($version->design_id !== $design->id) {
            abort(403, 'Version does not belong to this design.');
        }

        // Prevent deleting the current version
        if ($version->is_current) {
            return redirect()->back()->with('error', 'Cannot delete the current version. Restore another version first.');
        }

        // Prevent deleting if it's the only version
        if ($design->versions()->count() <= 1) {
            return redirect()->back()->with('error', 'Cannot delete the only version.');
        }

        // Delete the file
        Storage::disk('public')->delete($version->file_path);

        // Delete the version record
        $version->delete();

        // Log the activity
        AuditLog::log(
            'version_deleted',
            $design,
            "Deleted version {$version->version_number} of design: {$design->title}",
            null,
            ['version_number' => $version->version_number]
        );

        return redirect()->back()->with('success', 'Version deleted successfully.');
    }

    /**
     * Compare two versions
     */
    public function compare(Design $design, Request $request)
    {
        $request->validate([
            'version1' => 'required|exists:design_versions,id',
            'version2' => 'required|exists:design_versions,id',
        ]);

        $version1 = DesignVersion::findOrFail($request->version1);
        $version2 = DesignVersion::findOrFail($request->version2);

        // Verify both versions belong to this design
        if ($version1->design_id !== $design->id || $version2->design_id !== $design->id) {
            abort(403, 'Versions do not belong to this design.');
        }

        return Inertia::render('Designs/CompareVersions', [
            'design' => $design,
            'version1' => $version1,
            'version2' => $version2,
        ]);
    }
}
