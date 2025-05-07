document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has admin role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    const role = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.toLowerCase();
    
    if (role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Set welcome message with user's name
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
    
    // Initialize admin dashboard functionality
    initDashboard();
});

function initDashboard() {
    // Here you would initialize any admin dashboard specific functionality
    // For example, loading user management data, system reports, etc.
    fetchRecentActivity();
    
    // Add event listeners to dashboard cards
    const dashboardButtons = document.querySelectorAll('.dashboard-card .btn');
    dashboardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.parentElement.querySelector('h3').textContent;
            
            switch(cardTitle) {
                case 'User Management':
                    // Handle user management click
                    console.log('User management clicked');
                    // window.location.href = 'users.html';
                    break;
                case 'Department Settings':
                    // Handle department settings click
                    console.log('Department settings clicked');
                    // window.location.href = 'departments.html';
                    break;
                case 'System Reports':
                    // Handle system reports click
                    console.log('System reports clicked');
                    // window.location.href = 'reports.html';
                    break;
                case 'Staff Directory':
                    // Handle staff directory click
                    console.log('Staff directory clicked');
                    // window.location.href = 'staff.html';
                    break;
            }
        });
    });
}

function fetchRecentActivity() {
    // In a real application, you would fetch recent activity data from your API
    const apiBaseUrl = window.__env?.API_BASE_URL || "https://localhost:7291";
    const token = localStorage.getItem('token');
    
    fetch(`${apiBaseUrl}/api/admin/activity`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch activity data');
        }
        return response.json();
    })
    .then(data => {
        // Update the activity list with real data
        updateActivityList(data);
    })
    .catch(error => {
        console.error('Error fetching activity data:', error);
    });
}

function updateActivityList(activities) {
    // Function to update the activity list with data from the API
    const activityList = document.querySelector('.activity-list');
    
    if (!activityList || !activities || !activities.length) {
        return;
    }
    
    // Clear existing activities
    activityList.innerHTML = '';
    
    // Add new activities
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        
        activityItem.innerHTML = `
            <div class="activity-time">${activity.time}</div>
            <div class="activity-details">
                <strong>${activity.type}</strong>: ${activity.description}
            </div>
        `;
        
        activityList.appendChild(activityItem);
    });
}