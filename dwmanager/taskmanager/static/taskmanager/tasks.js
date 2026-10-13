const pendingList = document.querySelector('#pending-tasks');
const completedList = document.querySelector('#completed-tasks');
const newTaskInput = document.querySelector('#new-task-input');

console.log("tasks.js loaded");

function getCookie(name){
    const cookies = document.cookie.split(';');
    for (let cookie of cookies){
        const [key, value] = cookie.trim().split('=');
        if (key === name){
            return decodeURIComponent(value);
        }
    }
    return null;
}

function attachTaskCheckboxListeners(checkbox){
    checkbox.addEventListener("change", async() => {
        const taskItem = checkbox.closest(".task-item");
        const taskId = taskItem.dataset.taskId;
        const csrfToken = getCookie('csrftoken');

        try {
            const response = await fetch(`/tasks/toggle/${taskId}/`, {
                method: "POST",
                headers:{
                    "X-CSRFToken": csrfToken,
                },
            });
            if (!response.ok){
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            if (data.status.toLowerCase() === "completed"){
                taskItem.classList.add("completed");
                completedList.prepend(taskItem);
            }else{
                taskItem.classList.remove("completed");
                pendingList.appendChild(taskItem);
            }
                
            // updateEmptyPendingMessage();
                
            
        }catch (error){
            checkbox.checked = !checkbox.checked;
            console.warn("Error toggling task status:");
            return;
        }

    });
}
document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
    attachTaskCheckboxListeners(checkbox);
});

// document.querySelectorAll(".task-checkbox").forEach((checkbox) => {
//     checkbox.addEventListener("change", async() => {
//         const taskItem = checkbox.closest(".task-item");
//         const taskId = taskItem.dataset.taskId;
//         const csrfToken = getCookie('csrftoken');

//         try {
//             const response = await fetch(`/tasks/toggle/${taskId}/`, {
//                 method: "POST",
//                 headers:{
//                     "X-CSRFToken": csrfToken,
//                 },
//             });
//             if (!response.ok){
//                 throw new Error("Network response was not ok");
//             }
//             const data = await response.json();
//             if (data.status.toLowerCase() === "completed"){
//                 taskItem.classList.add("completed");
//                 completedList.prepend(taskItem);
//             }else{
//                 taskItem.classList.remove("completed");
//                 pendingList.appendChild(taskItem);
//             }
                
//             // updateEmptyPendingMessage();
                
            
//         }catch (error){
//             checkbox.checked = !checkbox.checked;
//             console.warn("Error toggling task status:");
//             return;
//         }

//     });
// });

// function updateEmptyPendingMessage() {
//   const existingMessage = pendingList.querySelector(".no-pending-tasks");
//   const pendingTasks = pendingList.querySelectorAll(".task-item:not(.no-pending-tasks)");

//   if (pendingTasks.length === 0 && !existingMessage) {
//     const emptyItem = document.createElement("li");
//     emptyItem.className = "task-item no-pending-tasks";
//     emptyItem.innerHTML = "<p>No pending tasks.</p>";

//     pendingList.appendChild(emptyItem);
//   }

//   if (pendingTasks.length > 0 && existingMessage) {
//     existingMessage.remove();
//   }
// }

function createTaskElement(task){
    const taskItem = document.createElement("li");
    taskItem.className = "task-item";
    taskItem.dataset.taskId = task.id;
    taskItem.innerHTML = `
     <input
      type="checkbox"
      class="task-list task-checkbox"
      id="task-${task.id}"
    ><label class="task-title" for="task-${task.id}">
      ${task.title}
    </label>
    `.trim();
    return taskItem;
}

newTaskInput.addEventListener("keydown", async(event) => {
    if (event.key === "Enter" && newTaskInput.value.trim() !== ""){
        const title = newTaskInput.value.trim();
        const csrfToken = getCookie('csrftoken');
        console.log("Creating task with title:", title);
        try {
            const response = await fetch("/tasks/create/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                },
                body: JSON.stringify({ title: title }),
            });

            if (!response.ok){
                console.warn("Failed to create task");
                return;
            }
            const task = await response.json();
            const taskItem = createTaskElement(task);
            attachTaskCheckboxListeners(taskItem.querySelector(".task-checkbox"));
            newTaskInput.value = "";
            const addTaskItem = newTaskInput.closest(".add-item");
            addTaskItem.insertAdjacentElement("afterend", taskItem);

        }catch (error){
            console.warn("Error creating task:", error);
        }
    }
    
});