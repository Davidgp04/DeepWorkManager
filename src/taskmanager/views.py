from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import json
from django.db.models import Case, When, Value, F, IntegerField

from .models import Task

def task_list(request):
    # tasks = Task.non_completed_tasks.all()
    tasks = Task.non_completed_tasks.annotate(
        priority = Case(
            When(was_updated=False, then=Value(1)),
            default=Value(2),
            output_field=IntegerField()
        )
    ).order_by(
        'priority',
        Case(
            When(priority=1, then=F('updated_at'))).desc()
        ,
        Case(
            When(priority=2, then=F('updated_at'))).asc()
        )
    
    completed_tasks = Task.objects.filter(status=Task.Status.COMPLETED).order_by('-completed_at')
    return render(
        request, 
        'taskmanager/tasks/list.html', 
        {'non_completed_tasks': tasks,
          'completed_tasks': completed_tasks}
        )

def toggle_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    if request.method == 'POST':
        if task.status == Task.Status.COMPLETED:
            task.mark_as_non_completed()
        else:
            task.mark_as_completed()
    return JsonResponse({
        "id": task.id,
        "status": task.status,
        "response_status": "success",
    })

@require_POST
def create_task(request):
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data."}, status=400)

    title = data.get("title", "").strip()
    if not title:
        print("Title is empty")
        return JsonResponse({"error": "Title cannot be empty."}, status=400)

    task = Task.objects.create(title=title,
                               # user = request.user,
                               )
    return JsonResponse({
        "id": task.id,
        "title": task.title,
        "status": task.status,
        "response_status": "success",
    })

@require_POST
def delete_task(request, task_id):
    task = get_object_or_404(Task, id=task_id)
    task.delete()
    return JsonResponse({"response_status": "success"})
