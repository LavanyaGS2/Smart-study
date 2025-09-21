// Smart Study Planner - JavaScript
class StudyPlanner {
    constructor() {
        this.tasks = this.loadFromStorage('tasks') || [];
        this.goals = this.loadFromStorage('goals') || [];
        this.currentFilter = 'all';
        this.currentWeek = new Date();
        this.editingTaskId = null;
        this.editingGoalId = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDashboard();
        this.renderTasks();
        this.renderGoals();
        this.renderTimeline();
        this.setupModals();
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Task management
        document.getElementById('addTaskBtn').addEventListener('click', () => this.openTaskModal());
        document.getElementById('addGoalBtn').addEventListener('click', () => this.openGoalModal());
        document.getElementById('taskForm').addEventListener('submit', (e) => this.handleTaskSubmit(e));
        document.getElementById('goalForm').addEventListener('submit', (e) => this.handleGoalSubmit(e));

        // Task filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterTasks(e.target.dataset.filter));
        });

        // Timeline controls
        document.getElementById('prevWeek').addEventListener('click', () => this.changeWeek(-1));
        document.getElementById('nextWeek').addEventListener('click', () => this.changeWeek(1));

        // Modal controls
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => this.closeModals());
        });

        document.getElementById('cancelTask').addEventListener('click', () => this.closeModals());
        document.getElementById('cancelGoal').addEventListener('click', () => this.closeModals());

        // Close modals when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });
    }

    // Tab Management
    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active content
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        // Update content based on tab
        if (tabName === 'dashboard') {
            this.updateDashboard();
        } else if (tabName === 'timeline') {
            this.renderTimeline();
        }
    }

    // Task Management
    openTaskModal(taskId = null) {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const title = document.getElementById('taskModalTitle');
        
        this.editingTaskId = taskId;
        
        if (taskId) {
            const task = this.tasks.find(t => t.id === taskId);
            title.textContent = 'Edit Task';
            this.populateTaskForm(task);
        } else {
            title.textContent = 'Add New Task';
            form.reset();
        }
        
        modal.style.display = 'block';
    }

    populateTaskForm(task) {
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description || '';
        document.getElementById('taskDueDate').value = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '';
        document.getElementById('taskPriority').value = task.priority;
        document.getElementById('taskSubject').value = task.subject || '';
    }

    handleTaskSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const taskData = {
            title: formData.get('taskTitle'),
            description: formData.get('taskDescription'),
            dueDate: formData.get('taskDueDate'),
            priority: formData.get('taskPriority'),
            subject: formData.get('taskSubject'),
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (this.editingTaskId) {
            // Update existing task
            const taskIndex = this.tasks.findIndex(t => t.id === this.editingTaskId);
            this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...taskData };
        } else {
            // Add new task
            taskData.id = Date.now().toString();
            this.tasks.push(taskData);
        }

        this.saveToStorage('tasks', this.tasks);
        this.renderTasks();
        this.updateDashboard();
        this.closeModals();
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveToStorage('tasks', this.tasks);
            this.renderTasks();
            this.updateDashboard();
        }
    }

    toggleTaskComplete(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            this.saveToStorage('tasks', this.tasks);
            this.renderTasks();
            this.updateDashboard();
        }
    }

    filterTasks(filter) {
        this.currentFilter = filter;
        
        // Update filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTasks();
    }

    renderTasks() {
        const tasksList = document.getElementById('tasksList');
        let filteredTasks = this.tasks;

        // Apply filters
        switch (this.currentFilter) {
            case 'pending':
                filteredTasks = this.tasks.filter(t => !t.completed);
                break;
            case 'completed':
                filteredTasks = this.tasks.filter(t => t.completed);
                break;
            case 'overdue':
                const now = new Date();
                filteredTasks = this.tasks.filter(t => 
                    !t.completed && t.dueDate && new Date(t.dueDate) < now
                );
                break;
        }

        // Sort tasks by due date and priority
        filteredTasks.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
            }
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        });

        if (filteredTasks.length === 0) {
            tasksList.innerHTML = '<p class="text-center text-muted">No tasks found</p>';
            return;
        }

        tasksList.innerHTML = filteredTasks.map(task => this.createTaskHTML(task)).join('');
    }

    createTaskHTML(task) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const isOverdue = dueDate && dueDate < new Date() && !task.completed;
        const isToday = dueDate && this.isSameDay(dueDate, new Date());
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}">
                <div class="task-header">
                    <div>
                        <div class="task-title">${task.title}</div>
                        <span class="task-priority priority-${task.priority}">${task.priority}</span>
                    </div>
                    <div class="task-actions">
                        <button class="btn btn-success btn-sm" onclick="planner.toggleTaskComplete('${task.id}')">
                            <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                            ${task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button class="btn btn-warning btn-sm" onclick="planner.openTaskModal('${task.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="planner.deleteTask('${task.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
                ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                <div class="task-meta">
                    ${task.subject ? `<span><i class="fas fa-book"></i> ${task.subject}</span>` : ''}
                    ${dueDate ? `<span><i class="fas fa-calendar"></i> ${this.formatDate(dueDate)} ${isToday ? '(Today)' : ''}</span>` : ''}
                    <span><i class="fas fa-clock"></i> ${this.formatTime(new Date(task.createdAt))}</span>
                </div>
            </div>
        `;
    }

    // Goal Management
    openGoalModal(goalId = null) {
        const modal = document.getElementById('goalModal');
        const form = document.getElementById('goalForm');
        const title = document.getElementById('goalModalTitle');
        
        this.editingGoalId = goalId;
        
        if (goalId) {
            const goal = this.goals.find(g => g.id === goalId);
            title.textContent = 'Edit Goal';
            this.populateGoalForm(goal);
        } else {
            title.textContent = 'Add New Goal';
            form.reset();
        }
        
        modal.style.display = 'block';
    }

    populateGoalForm(goal) {
        document.getElementById('goalTitle').value = goal.title;
        document.getElementById('goalDescription').value = goal.description || '';
        document.getElementById('goalTargetDate').value = goal.targetDate ? new Date(goal.targetDate).toISOString().slice(0, 10) : '';
        document.getElementById('goalSubject').value = goal.subject || '';
    }

    handleGoalSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const goalData = {
            title: formData.get('goalTitle'),
            description: formData.get('goalDescription'),
            targetDate: formData.get('goalTargetDate'),
            subject: formData.get('goalSubject'),
            progress: 0,
            completed: false,
            createdAt: new Date().toISOString()
        };

        if (this.editingGoalId) {
            // Update existing goal
            const goalIndex = this.goals.findIndex(g => g.id === this.editingGoalId);
            this.goals[goalIndex] = { ...this.goals[goalIndex], ...goalData };
        } else {
            // Add new goal
            goalData.id = Date.now().toString();
            this.goals.push(goalData);
        }

        this.saveToStorage('goals', this.goals);
        this.renderGoals();
        this.updateDashboard();
        this.closeModals();
    }

    deleteGoal(goalId) {
        if (confirm('Are you sure you want to delete this goal?')) {
            this.goals = this.goals.filter(g => g.id !== goalId);
            this.saveToStorage('goals', this.goals);
            this.renderGoals();
            this.updateDashboard();
        }
    }

    updateGoalProgress(goalId, progress) {
        const goal = this.goals.find(g => g.id === goalId);
        if (goal) {
            goal.progress = Math.max(0, Math.min(100, progress));
            goal.completed = goal.progress === 100;
            if (goal.completed) {
                goal.completedAt = new Date().toISOString();
            }
            this.saveToStorage('goals', this.goals);
            this.renderGoals();
            this.updateDashboard();
        }
    }

    renderGoals() {
        const goalsList = document.getElementById('goalsList');
        
        if (this.goals.length === 0) {
            goalsList.innerHTML = '<p class="text-center text-muted">No goals set yet. Create your first study goal!</p>';
            return;
        }

        goalsList.innerHTML = this.goals.map(goal => this.createGoalHTML(goal)).join('');
    }

    createGoalHTML(goal) {
        const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
        const isOverdue = targetDate && targetDate < new Date() && !goal.completed;
        
        return `
            <div class="goal-item">
                <div class="goal-header">
                    <div>
                        <div class="goal-title">${goal.title}</div>
                        ${goal.subject ? `<div class="text-muted"><i class="fas fa-book"></i> ${goal.subject}</div>` : ''}
                    </div>
                    <div class="goal-actions">
                        <button class="btn btn-warning btn-sm" onclick="planner.openGoalModal('${goal.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="planner.deleteGoal('${goal.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                ${goal.description ? `<div class="mb-3">${goal.description}</div>` : ''}
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${goal.progress}%"></div>
                    </div>
                    <div class="progress-text">${goal.progress}% Complete</div>
                </div>
                <div class="goal-meta">
                    <div>
                        <input type="range" min="0" max="100" value="${goal.progress}" 
                               onchange="planner.updateGoalProgress('${goal.id}', this.value)"
                               class="w-100">
                    </div>
                    <div class="text-muted">
                        ${targetDate ? `Target: ${this.formatDate(targetDate)}` : 'No target date'}
                    </div>
                </div>
            </div>
        `;
    }

    // Timeline Management
    changeWeek(direction) {
        this.currentWeek.setDate(this.currentWeek.getDate() + (direction * 7));
        this.renderTimeline();
    }

    renderTimeline() {
        const timelineView = document.getElementById('timelineView');
        const weekStart = this.getWeekStart(this.currentWeek);
        const weekEnd = this.getWeekEnd(this.currentWeek);
        
        document.getElementById('currentWeek').textContent = 
            `${this.formatDate(weekStart)} - ${this.formatDate(weekEnd)}`;

        const days = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            days.push(day);
        }

        const timelineHTML = `
            <div class="timeline-week">
                ${days.map(day => this.createDayHTML(day)).join('')}
            </div>
        `;

        timelineView.innerHTML = timelineHTML;
    }

    createDayHTML(day) {
        const dayTasks = this.tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return this.isSameDay(taskDate, day);
        });

        return `
            <div class="timeline-day">
                <div class="day-header">
                    ${day.toLocaleDateString('en-US', { weekday: 'short' })}
                    <br>
                    ${day.getDate()}
                </div>
                <div class="day-tasks">
                    ${dayTasks.map(task => `
                        <div class="day-task" onclick="planner.openTaskModal('${task.id}')">
                            ${task.title}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Dashboard Updates
    updateDashboard() {
        const today = new Date();
        const todayTasks = this.tasks.filter(task => {
            if (!task.dueDate) return false;
            return this.isSameDay(new Date(task.dueDate), today);
        });

        const completedGoals = this.goals.filter(goal => goal.completed).length;
        
        // Calculate study streak (simplified - based on completed tasks)
        const studyStreak = this.calculateStudyStreak();
        
        const upcomingDeadlines = this.tasks.filter(task => {
            if (task.completed || !task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
            return daysUntilDue >= 0 && daysUntilDue <= 7;
        }).length;

        document.getElementById('todayTasks').textContent = todayTasks.length;
        document.getElementById('completedGoals').textContent = completedGoals;
        document.getElementById('studyStreak').textContent = `${studyStreak} days`;
        document.getElementById('upcomingDeadlines').textContent = upcomingDeadlines;

        this.updateRecentActivity();
    }

    updateRecentActivity() {
        const activityList = document.getElementById('recentActivityList');
        const recentActivities = [];

        // Add recent task completions
        this.tasks
            .filter(task => task.completed && task.completedAt)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .slice(0, 5)
            .forEach(task => {
                recentActivities.push({
                    text: `Completed task: ${task.title}`,
                    time: task.completedAt,
                    icon: 'fas fa-check-circle'
                });
            });

        // Add recent goal completions
        this.goals
            .filter(goal => goal.completed && goal.completedAt)
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .slice(0, 3)
            .forEach(goal => {
                recentActivities.push({
                    text: `Achieved goal: ${goal.title}`,
                    time: goal.completedAt,
                    icon: 'fas fa-trophy'
                });
            });

        // Sort all activities by time
        recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));

        if (recentActivities.length === 0) {
            activityList.innerHTML = '<p class="no-activity">No recent activity</p>';
            return;
        }

        activityList.innerHTML = recentActivities.slice(0, 10).map(activity => `
            <div class="activity-item">
                <i class="${activity.icon}"></i>
                <span>${activity.text}</span>
                <span class="text-muted ml-auto">${this.formatTime(new Date(activity.time))}</span>
            </div>
        `).join('');
    }

    calculateStudyStreak() {
        // Simplified streak calculation based on completed tasks
        const completedTasks = this.tasks.filter(task => task.completed && task.completedAt);
        if (completedTasks.length === 0) return 0;

        const sortedTasks = completedTasks.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let i = 0; i < sortedTasks.length; i++) {
            const taskDate = new Date(sortedTasks[i].completedAt);
            taskDate.setHours(0, 0, 0, 0);
            
            if (taskDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (taskDate.getTime() < currentDate.getTime()) {
                break;
            }
        }

        return streak;
    }

    // Modal Management
    setupModals() {
        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    closeModals() {
        document.getElementById('taskModal').style.display = 'none';
        document.getElementById('goalModal').style.display = 'none';
        this.editingTaskId = null;
        this.editingGoalId = null;
    }

    // Utility Functions
    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    getWeekStart(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day;
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    }

    getWeekEnd(date) {
        const end = this.getWeekStart(date);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        return end;
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTime(date) {
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours}h ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays}d ago`;
        }
    }

    // Local Storage
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return null;
        }
    }
}

// Initialize the application
let planner;
document.addEventListener('DOMContentLoaded', () => {
    planner = new StudyPlanner();
});

// Add some sample data for demonstration
function addSampleData() {
    if (planner.tasks.length === 0 && planner.goals.length === 0) {
        const sampleTasks = [
            {
                id: '1',
                title: 'Complete Math Assignment',
                description: 'Solve calculus problems from chapter 5',
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'high',
                subject: 'Mathematics',
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Read Physics Chapter 3',
                description: 'Study quantum mechanics fundamentals',
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
                priority: 'medium',
                subject: 'Physics',
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];

        const sampleGoals = [
            {
                id: '1',
                title: 'Master Calculus',
                description: 'Complete all calculus assignments and achieve 90%+ grades',
                targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                subject: 'Mathematics',
                progress: 25,
                completed: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Improve Study Habits',
                description: 'Study for 2 hours daily for 30 consecutive days',
                targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
                subject: 'General',
                progress: 60,
                completed: false,
                createdAt: new Date().toISOString()
            }
        ];

        planner.tasks = sampleTasks;
        planner.goals = sampleGoals;
        planner.saveToStorage('tasks', planner.tasks);
        planner.saveToStorage('goals', planner.goals);
        planner.updateDashboard();
        planner.renderTasks();
        planner.renderGoals();
    }
}

// Add sample data button (for demonstration)
document.addEventListener('DOMContentLoaded', () => {
    // Add a button to load sample data if no data exists
    setTimeout(() => {
        if (planner.tasks.length === 0 && planner.goals.length === 0) {
            const dashboard = document.getElementById('dashboard');
            const sampleButton = document.createElement('button');
            sampleButton.className = 'btn btn-primary';
            sampleButton.innerHTML = '<i class="fas fa-download"></i> Load Sample Data';
            sampleButton.onclick = addSampleData;
            sampleButton.style.marginTop = '20px';
            dashboard.appendChild(sampleButton);
        }
    }, 1000);
});
