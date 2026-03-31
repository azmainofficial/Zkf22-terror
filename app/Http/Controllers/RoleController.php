<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Permission;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display roles
     */
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_roles')) {
            abort(403, 'Unauthorized access to role matrix.');
        }

        $roles = Role::withCount(['users', 'permissions'])->get();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
        ]);
    }

    /**
     * Show role details and permissions
     */
    public function show(Request $request, Role $role)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_roles')) {
            abort(403, 'Unauthorized access to role detail.');
        }

        $role->load(['permissions', 'users']);
        $allPermissions = Permission::all()->groupBy('group');

        return Inertia::render('Roles/Show', [
            'role' => $role,
            'allPermissions' => $allPermissions,
        ]);
    }

    /**
     * Create new role
     */
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_roles')) {
            abort(403, 'Unauthorized operation: Establish Access Role.');
        }

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name|max:255',
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'display_name' => $validated['display_name'],
            'description' => $validated['description'] ?? null,
            'is_system' => false,
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    /**
     * Update role
     */
    public function update(Request $request, Role $role)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_roles')) {
            abort(403, 'Unauthorized operation: Modify Role Permissions.');
        }

        // Prevent editing system roles
        if ($role->is_system && !$request->user()->isAdmin()) {
            abort(403, 'Cannot modify system roles.');
        }

        $validated = $request->validate([
            'display_name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'display_name' => $validated['display_name'],
            'description' => $validated['description'] ?? null,
        ]);

        if (isset($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    /**
     * Delete role
     */
    public function destroy(Request $request, Role $role)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('delete_roles')) {
            abort(403, 'Unauthorized operation: Disestablish Role.');
        }

        // Prevent deleting system roles
        if ($role->is_system) {
            abort(403, 'Cannot delete system roles.');
        }

        // Check if role has users
        if ($role->users()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete role with assigned users.');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }

    /**
     * Assign role to user
     */
    public function assignToUser(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_users')) {
            abort(403, 'Unauthorized operation: Modify User Access.');
        }
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $user->assignRole($validated['role_id']);

        return redirect()->back()->with('success', 'Role assigned to user successfully.');
    }

    /**
     * Remove role from user
     */
    public function removeFromUser(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_users')) {
            abort(403, 'Unauthorized operation: Revoke User Access.');
        }
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role_id' => 'required|exists:roles,id',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $user->removeRole($validated['role_id']);

        return redirect()->back()->with('success', 'Role removed from user successfully.');
    }
}
