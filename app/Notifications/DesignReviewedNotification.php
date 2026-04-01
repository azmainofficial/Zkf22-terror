<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DesignReviewedNotification extends Notification
{
    use Queueable;

    protected $design;
    protected $project;
    protected $user;

    /**
     * Create a new notification instance.
     */
    public function __construct($design, $project, $user)
    {
        $this->design = $design;
        $this->project = $project;
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'design_id' => $this->design->id,
            'file_name' => $this->design->file_name,
            'project_id' => $this->project->id,
            'project_title' => $this->project->title,
            'status' => $this->design->status,
            'user_name' => $this->user->name,
            'message' => "{$this->user->name} reviewed '{$this->design->file_name}' in project '{$this->project->title}'",
            'link' => route('projects.show', $this->project->id) . '?tab=designs',
        ];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return $this->toDatabase($notifiable);
    }
}
