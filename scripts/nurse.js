document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has nurse role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    const role = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.toLowerCase();
    
    if (role !== 'nurse') {
        window.location.href = 'login.html';
        return;
    }
    
    // Set welcome message with nurse's name
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome && user.name) {
        userWelcome.textContent = `Welcome, ${user.name}`;
    }
    
    // Handle logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'login.html';
        });
    }
    
    // Initialize nurse dashboard functionality
    initDashboard();
});

function initDashboard() {
    // Here you would initialize any nurse dashboard specific functionality
    fetchTasks();
    fetchDepartmentStatus();
    
    // Add event listeners to dashboard cards
    const dashboardButtons = document.querySelectorAll('.dashboard-card .btn');
    dashboardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.parentElement.querySelector('h3').textContent;
            
            switch(cardTitle) {
                case 'Patient Care':
                    // Handle patient care click
                    console.log('Patient care clicked');
                    // window.location.href = 'nurse-patients.html';
                    break;
                case 'Vitals & Monitoring':
                    // Handle vitals click
                    console.log('Vitals clicked');
                    // window.location.href = 'vitals.html';
                    break;
                case 'Medication Administration':
                    // Handle medication click
                    console.log('Medication clicked');
                    // window.location.href = 'medication-admin.html';
                    break;
                case 'Patient Documentation':
                    // Handle documentation click
                    console.log('Documentation clicked');
                    // window.location.href = 'nurse-documentation.html';
                    break;
            }
        });
    });
    
    // Add event listeners to task complete buttons
    const taskCompleteButtons = document.querySelectorAll('.task-actions .btn');
    taskCompleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskItem = this.closest('.task-item');
            const roomNumber = taskItem.querySelector('.task-details strong').textContent;
            const taskDescription = taskItem.querySelector('.task-details span').textContent;
            
            // In a real application, you would send a request to mark the task as complete
            console.log(`Task completed: ${roomNumber} - ${taskDescription}`);
            taskItem.classList.add('completed');
            
            // After a delay, remove the task from the list
            setTimeout(() => {
                taskItem.style.opacity = '0';
                setTimeout(() => {
                    taskItem.remove();
                }, 300);
            }, 1000);
        });
    });
}

function fetchTasks() {
    // In a real application, you would fetch task data from your API
    // This is just a placeholder
    const apiBaseUrl = window.__env?.API_BASE_URL || "https://localhost:7291";
    const token = localStorage.getItem('token');
    
    // Example of how you would fetch task data
    /*
    fetch(`${apiBaseUrl}/api/nurse/tasks`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        return response.json();
    })
    .then(data => {
        // Update the task list with real data
        updateTaskList(data);
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
    });
    */
}

function updateTaskList(tasks) {
    // Function to update the task list with data from the API
    const taskList = document.querySelector('.task-list');
    
    if (!taskList || !tasks || !tasks.length) {
        return;
    }
    
    // Clear existing tasks
    taskList.innerHTML = '';
    
    // Add new tasks
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        // Determine priority class
        let priorityClass = 'low';
        if (task.priority === 'high') {
            priorityClass = 'high';
        } else if (task.priority === 'medium') {
            priorityClass = 'medium';
        }
        
        taskItem.innerHTML = `
            <div class="task-priority ${priorityClass}">${task.priority}</div>
            <div class="task-details">
                <strong>${task.roomNumber}</strong>
                <span>${task.patientName} - ${task.description}</span>
            </div>
            <div class="task-actions">
                <button class="btn small primary">Complete</button>
            </div>
        `;
        
        taskList.appendChild(taskItem);
    });
}

function fetchDepartmentStatus() {
    // In a real application, you would fetch department status data from your API
    // This is just a placeholder
    const apiBaseUrl = window.__env?.API_BASE_URL || "https://localhost:7291";
    const token = localStorage.getItem('token');
    
    // Example of how you would fetch department status data
    /*
    fetch(`${apiBaseUrl}/api/nurse/department-status`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch department status');
        }
        return response.json();
    })
    .then(data => {
        // Update the department status with real data
        updateDepartmentStatus(data);
    })
    .catch(error => {
        console.error('Error fetching department status:', error);
    });
    */
}

function updateDepartmentStatus(status) {
    // Function to update the department status with data from the API
    if (!status) {
        return;
    }
    
    const statusItems = document.querySelectorAll('.status-item');
    
    if (statusItems.length === 0) {
        return;
    }
    
    // Update occupied beds
    if (status.occupiedBeds !== undefined && status.totalBeds !== undefined) {
        const occupiedBedsElement = statusItems[0].querySelector('.status-value');
        if (occupiedBedsElement) {
            occupiedBedsElement.textContent = `${status.occupiedBeds}/${status.totalBeds}`;
        }
    }
    
    // Update critical patients
    if (status.criticalPatients !== undefined) {
        const criticalPatientsElement = statusItems[1].querySelector('.status-value');
        if (criticalPatientsElement) {
            criticalPatientsElement.textContent = status.criticalPatients;
        }
    }
    
    // Update pending admissions
    if (status.pendingAdmissions !== undefined) {
        const pendingAdmissionsElement = statusItems[2].querySelector('.status-value');
        if (pendingAdmissionsElement) {
            pendingAdmissionsElement.textContent = status.pendingAdmissions;
        }
    }
    
    // Update staff on duty
    if (status.staffOnDuty !== undefined) {
        const staffOnDutyElement = statusItems[3].querySelector('.status-value');
        if (staffOnDutyElement) {
            staffOnDutyElement.textContent = status.staffOnDuty;
        }
    }
}