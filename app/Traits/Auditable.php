<?php

namespace App\Traits;

use App\Models\AuditLog;

trait Auditable
{
    /**
     * Boot the trait
     */
    protected static function bootAuditable()
    {
        // Log when model is created
        static::created(function ($model) {
            AuditLog::log(
                'created',
                $model,
                static::getAuditDescription('created', $model),
                null,
                $model->getAttributes()
            );
        });

        // Log when model is updated
        static::updated(function ($model) {
            AuditLog::log(
                'updated',
                $model,
                static::getAuditDescription('updated', $model),
                $model->getOriginal(),
                $model->getChanges()
            );
        });

        static::deleted(function ($model) {
            AuditLog::log(
                'deleted',
                $model,
                static::getAuditDescription('deleted', $model),
                $model->getAttributes(),
                null
            );
        });

        // Log when model is restored (only if SoftDeletes is used)
        if (in_array(\Illuminate\Database\Eloquent\SoftDeletes::class , class_uses_recursive(static::class))) {
            static::restored(function ($model) {
                AuditLog::log(
                    'restored',
                    $model,
                    static::getAuditDescription('restored', $model),
                    null,
                    $model->getAttributes()
                );
            });

            // Log when model is force deleted
            static::forceDeleted(function ($model) {
                AuditLog::log(
                    'forceDeleted',
                    $model,
                    static::getAuditDescription('forceDeleted', $model),
                    $model->getAttributes(),
                    null
                );
            });
        }
    }

    /**
     * Generate audit description
     */
    protected static function getAuditDescription(string $action, $model): string
    {
        $modelName = class_basename($model);
        $identifier = $model->title ?? $model->name ?? $model->id;

        return ucfirst($action) . " {$modelName}: {$identifier}";
    }

    /**
     * Get audit logs for this model
     */
    public function auditLogs()
    {
        return $this->morphMany(AuditLog::class , 'auditable');
    }
}
