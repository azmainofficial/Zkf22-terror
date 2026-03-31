<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class UserManagementController extends Controller
{
    /**
     * Display users
     */
    public function index(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_users')) {
            abort(403, 'Unauthorized access to user directory.');
        }

        $query = User::with('roles');

        // Filter by role
        if ($request->filled('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        // Search
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->latest()->paginate(20)->withQueryString();
        $roles = Role::all();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['role', 'search']),
        ]);
    }

    /**
     * Show user details
     */
    public function show(Request $request, User $user)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('view_users')) {
            abort(403, 'Unauthorized access to user profile.');
        }

        $user->load([
            'roles.permissions',
            'auditLogs' => function ($query) {
                $query->latest()->take(10);
            }
        ]);

        $allRoles = Role::all();

        return Inertia::render('Users/Show', [
            'user' => $user,
            'allRoles' => $allRoles,
        ]);
    }

    /**
     * Create new user
     */
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('create_users')) {
            abort(403, 'Unauthorized operation: Register Portal User.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        if (!empty($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    /**
     * Update user
     */
    public function update(Request $request, User $user)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_users')) {
            abort(403, 'Unauthorized operation: Update User Authentication.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'roles' => 'array',
            'roles.*' => 'exists:roles,id',
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);
        }

        if (isset($validated['roles'])) {
            $user->roles()->sync($validated['roles']);
        }

        return redirect()->back()->with('success', 'User updated successfully.');
    }

    /**
     * Delete user
     */
    public function destroy(Request $request, User $user)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('delete_users')) {
            abort(403, 'Unauthorized operation: Terminate User Access.');
        }

        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    /**
     * Assign role to user
     */
    public function assignRole(Request $request, User $user)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_users')) {
            abort(403, 'Unauthorized operation: Modify Access Hierarchy.');
        }
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->assignRole($validated['role_id']);

        return redirect()->back()->with('success', 'Role assigned successfully.');
    }

    /**
     * Remove role from user
     */
    public function removeRole(Request $request, User $user)
    {
        if (!$request->user()->isAdmin() && !$request->user()->hasPermission('edit_users')) {
            abort(403, 'Unauthorized operation: Revoke Access Hierarchy.');
        }
        $validated = $request->validate([
            'role_id' => 'required|exists:roles,id',
        ]);

        $user->removeRole($validated['role_id']);

        return redirect()->back()->with('success', 'Role removed successfully.');
    }
}
