let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById('taskInput');
    const priority = document.getElementById('prioritySelect').value;
    const text = input.value.trim();
    
    if (!text) return;
    
    tasks.push({
        id: Date.now(),
        text,
        completed: false,
        priority,
        createdAt: new Date().toISOString()
    });
    
    input.value = '';
    saveTasks();
    renderTasks();
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const newText = prompt('Edit task:', task.text);
    if (newText && newText.trim()) {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function filterTasks(filter) {
    currentFilter = filter;
    renderTasks();
}

function searchTasks() {
    renderTasks();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredTasks = tasks.filter(task => {
        const matchesSearch = task.text.toLowerCase().includes(searchQuery);
        const matchesFilter = 
            currentFilter === 'all' ||
            (currentFilter === 'active' && !task.completed) ||
            (currentFilter === 'completed' && task.completed) ||
            (currentFilter === 'high' && task.priority === 'high');
        return matchesSearch && matchesFilter;
    });
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    taskList.innerHTML = filteredTasks.map(task => {
        const priorityColors = {
            high: 'border-l-4 border-primary bg-red-900/20',
            medium: 'border-l-4 border-yellow-500 bg-yellow-900/10',
            low: 'border-l-4 border-gray-600 bg-gray-800/50'
        };
        
        const priorityBadges = {
            high: '<span class="px-2 py-1 bg-primary text-white text-xs rounded-full">High</span>',
            medium: '<span class="px-2 py-1 bg-yellow-600 text-white text-xs rounded-full">Medium</span>',
            low: '<span class="px-2 py-1 bg-gray-600 text-white text-xs rounded-full">Low</span>'
        };
        
        return `
            <div class="bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition ${priorityColors[task.priority]} ${task.completed ? 'opacity-60' : ''}">
                <div class="flex items-center gap-3">
                    <input 
                        type="checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        onchange="toggleTask(${task.id})"
                        class="w-5 h-5 accent-primary cursor-pointer"
                    >
                    <span class="flex-1 text-white ${task.completed ? 'line-through text-gray-500' : ''}">${task.text}</span>
                    ${priorityBadges[task.priority]}
                    <button 
                        onclick="editTask(${task.id})" 
                        class="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded transition text-sm"
                    >
                        Edit
                    </button>
                    <button 
                        onclick="deleteTask(${task.id})" 
                        class="px-3 py-1 bg-primary hover:bg-secondary text-white rounded transition text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

renderTasks();
