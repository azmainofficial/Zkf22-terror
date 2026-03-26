<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Design extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'client_id',
        'project_id',
        'file_path',
        'thumbnail',
        'type',
        'description',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * All versions of this design
     */
    public function versions()
    {
        return $this->hasMany(DesignVersion::class)->orderBy('version_number', 'desc');
    }

    /**
     * Get the current/active version
     */
    public function currentVersion()
    {
        return $this->hasOne(DesignVersion::class)->where('is_current', true);
    }

    /**
     * Audit logs for this design
     */
    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class , 'auditable');
    }
}
