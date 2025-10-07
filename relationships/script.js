// Relationship & Giving Back Task Manager JavaScript
console.log("Relationship & Giving Back Task Manager loaded!");

// Get references to HTML elements
const taskInput = document.getElementById('taskInput');
const addButton = document.getElementById('addButton');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');
const clearSection = document.getElementById('clearSection');
const clearAllButton = document.getElementById('clearAllButton');
const taskStats = document.getElementById('taskStats');
const statsText = document.getElementById('statsText');

// Array to store our tasks
let tasks = [];

// Functions for saving and loading tasks
function saveTasks() {
    localStorage.setItem('relationshipTaskManagerTasks', JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem('relationshipTaskManagerTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// Function to update task statistics
function updateStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    if (totalTasks === 0) {
        taskStats.classList.add('hidden');
        return;
    }
    
    taskStats.classList.remove('hidden');
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    let emoji = '💝';
    if (completionRate === 100) emoji = '💖';
    else if (completionRate >= 75) emoji = '🤝';
    else if (completionRate >= 50) emoji = '💕';
    else if (completionRate >= 25) emoji = '🫶';
    
    statsText.textContent = `${emoji} ${totalTasks} relationship tasks • ${completedTasks} completed • ${pendingTasks} pending • ${completionRate}% complete`;
}

// Function to create a new task
function addTask() {
    const taskText = taskInput.value.trim();
    
    // Check if input is not empty
    if (taskText === '') {
        alert('Please enter a relationship or giving back task!');
        return;
    }
    
    // Create task object
    const task = {
        id: Date.now(), // Simple unique ID
        text: taskText,
        completed: false
    };
    
    // Add to tasks array
    tasks.push(task);
    
    // Clear input
    taskInput.value = '';
    
    // Save to localStorage
    saveTasks();
    
    // Update the display
    renderTasks();
    updateStats();
}

// Function to display all tasks
function renderTasks() {
    // Clear the task list
    taskList.innerHTML = '';
    
    // Show/hide empty state and clear button
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        clearSection.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
        clearSection.style.display = 'block';
    }
    
    // Create HTML for each task
    tasks.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

// Function to create HTML element for a task
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-task-id', task.id);
    
    li.innerHTML = `
        <div class="task-content">
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
        </div>
        <div class="task-actions">
            <button class="complete-btn" onclick="toggleTask(${task.id})">
                ${task.completed ? 'Undo' : 'Done'}
            </button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">
                Delete
            </button>
        </div>
    `;
    
    return li;
}

// Function to toggle task completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Function to delete a task with animation
function deleteTask(taskId) {
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    if (taskElement) {
        taskElement.classList.add('removing');
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasks();
            renderTasks();
            updateStats();
        }, 300);
    }
}

// Function to clear all tasks
function clearAllTasks() {
    // Ask for confirmation before clearing
    if (confirm('Are you sure you want to clear all relationship tasks? This cannot be undone.')) {
        tasks = [];
        saveTasks();
        renderTasks();
        updateStats();
    }
}

// Event listeners
addButton.addEventListener('click', addTask);
clearAllButton.addEventListener('click', clearAllTasks);

// Allow pressing Enter to add task
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initialise the app
loadTasks();
renderTasks();
updateStats();
