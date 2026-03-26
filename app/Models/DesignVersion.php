<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DesignVersion extends Model
{
    use HasFactory;

    protected $fillable = [
        'design_id',
        'user_id',
        'version_number',
        'file_path',
        'file_size',
        'file_hash',
        'change_description',
        'metadata',
        'is_current',
    ];

    protected $casts = [
        'metadata' => 'array',
        'is_current' => 'boolean',
    ];

    /**
     * The design this version belongs to
     */
    public function design()
    {
        return $this->belongsTo(Design::class);
    }

    /**
     * User who created this version
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get formatted file size
     */
    public function getFormattedFileSizeAttribute()
    {
        if (!$this->file_size) {
            return 'Unknown';
        }

        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = $this->file_size;
        $i = 0;

        while ($bytes >= 1024 && $i < count($units) - 1) {
            $bytes /= 1024;
            $i++;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}
