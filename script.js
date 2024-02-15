document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToList(task));

    // Add task form submission handler
    taskForm.addEventListener('submit', e => {
        e.preventDefault();
        const task = taskInput.value.trim();
        if (task) {
            addTask(task);
            taskInput.value = '';
        }
    });

    // Update the UI for completed tasks
    tasks.forEach(task => {
        const li = document.querySelector(`[data-id="${task.id}"]`);
        if (li && task.completed) {
            const completedText = document.createElement('span');
            completedText.textContent = ' Completed';
            completedText.style.color = 'green';
            li.insertBefore(completedText, li.firstChild);
        }
    });

    // Task list item click handlers
    taskList.addEventListener('click', e => {
        if (e.target.classList.contains('delete-button')) {
            const li = e.target.parentElement;
            const taskId = li.dataset.id;
            deleteTask(taskId);
            li.remove();
        } else if (e.target.classList.contains('complete-checkbox')) {
            const li = e.target.parentElement;
            const taskId = li.dataset.id;
            const task = tasks.find(task => task.id === parseInt(taskId));
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            li.classList.toggle('completed');

            // Create and append or remove the "Completed" text
            let completedText = li.querySelector('span');
            if (task.completed) {
                if (!completedText) {
                    completedText = document.createElement('span');
                    completedText.textContent = ' Completed';
                    completedText.style.color = 'green';
                    li.insertBefore(completedText, li.firstChild);
                }
            } else {
                if (completedText) {
                    li.removeChild(completedText);
                }
            }
        } else if (e.target.classList.contains('edit-button')) {
            const editButton = e.target;
            const parentLi = editButton.parentElement;
            const taskId = parentLi.dataset.id;
            const newTask = prompt('Enter the new task:');
            if (newTask) {
                editTask(taskId, newTask);
                parentLi.textContent = newTask;

                // Create and append the delete, checkbox, and edit buttons
                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.textContent = 'Delete';
                parentLi.appendChild(deleteButton);

                const completeCheckbox = document.createElement('input');
                completeCheckbox.type = 'checkbox';
                completeCheckbox.className = 'complete-checkbox';
                completeCheckbox.id = `complete-checkbox-${taskId}`;
                if (tasks.find(task => task.id === parseInt(taskId)).completed) {
                    completeCheckbox.checked = true;
                }
                parentLi.insertBefore(completeCheckbox, parentLi.firstChild);

                const editButton = document.createElement('button');
                editButton.className = 'edit-button';
                editButton.textContent = 'Edit';
                parentLi.insertBefore(editButton, parentLi.firstChild);

                // Remove the previous edit button
                parentLi.removeChild(editButton.previousSibling);
            }
        }
    });

    // Function to add a new task
    function addTask(task) {
        const taskObject = {
            id: Date.now(),
            task,
            completed: false
        };
        tasks.push(taskObject);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        addTaskToList(taskObject);
    }

    // Function to add a new task to the list
    function addTaskToList(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.textContent = task.task;
        if (task.completed) {
            li.classList.add('completed');
        }
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.textContent = 'Delete';
        li.appendChild(deleteButton);
        const completeCheckbox = document.createElement('input');
        completeCheckbox.type = 'checkbox';
        completeCheckbox.className = 'complete-checkbox';
        if (task.completed) {
            completeCheckbox.checked = true;
        }
        li.insertBefore(completeCheckbox, li.firstChild);

        // Adding the edit button
        const editButton = document.createElement('button');
        editButton.className = 'edit-button';
        editButton.textContent = 'Edit';
        li.insertBefore(editButton, li.firstChild);

        taskList.appendChild(li);
    }

    // Function to delete a task
    function deleteTask(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId));
        tasks.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to edit a task
    function editTask(taskId, newTask) {
        const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId));
        if (taskIndex !== -1) {
            tasks[taskIndex].task = newTask;
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }
});
