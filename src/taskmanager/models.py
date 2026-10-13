from django.db import models
from django.utils import timezone
from django.conf import settings
from django.db.models import Case, When, Value, F, IntegerField
# Create your models here.
class NonCompletedTaskManager(models.Manager):
    def get_queryset(self):
        return (
            super().get_queryset().filter(status__in=[Task.Status.PENDING, Task.Status.IN_PROGRESS])
        )
class Task(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        COMPLETED = 'COMPLETED', 'Completed'
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tasks', null=True, blank=True ## Mean users are created, keep this field nullable.
    )
    title = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    expected_number_of_sessions = models.IntegerField(default=1)
    taken_time = models.DurationField(null=True, blank=True)
    parent_task = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subtasks')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    objects = models.Manager()
    non_completed_tasks = NonCompletedTaskManager()
    was_updated = models.BooleanField(default=False)
    class Meta:
        ordering = ['updated_at', 'created_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['updated_at']),
        ]
    def mark_as_completed(self):
        self.status = self.Status.COMPLETED
        self.completed_at = timezone.now()
        self.was_updated = True
        self.save()
    def mark_as_non_completed(self):
        self.status = self.Status.PENDING
        self.completed_at = None
        self.was_updated = True
        self.save()

    def __str__(self):
        return self.title

