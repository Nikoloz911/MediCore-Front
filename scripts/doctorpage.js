document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has doctor role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    const role = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.toLowerCase();
    
    if (role !== 'doctor') {
        window.location.href = 'login.html';
        return;
    }
    
    // Set welcome message with doctor's name
    const userWelcome = document.getElementById('userWelcome');
    if (userWelcome && user.name) {
        userWelcome.textContent = `Welcome, Dr. ${user.name}`;
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
    
    // Initialize doctor dashboard functionality
    initDashboard();
});

function initDashboard() {
    // Here you would initialize any doctor dashboard specific functionality
    fetchTodaysAppointments();
    
    // Add event listeners to dashboard cards
    const dashboardButtons = document.querySelectorAll('.dashboard-card .btn');
    dashboardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.parentElement.querySelector('h3').textContent;
            
            switch(cardTitle) {
                case 'My Patients':
                    // Handle my patients click
                    console.log('My patients clicked');
                    // window.location.href = 'patients.html';
                    break;
                case 'Appointments':
                    // Handle appointments click
                    console.log('Appointments clicked');
                    // window.location.href = 'appointments.html';
                    break;
                case 'Medical Records':
                    // Handle medical records click
                    console.log('Medical records clicked');
                    // window.location.href = 'records.html';
                    break;
                case 'Prescriptions':
                    // Handle prescriptions click
                    console.log('Prescriptions clicked');
                    // window.location.href = 'prescriptions.html';
                    break;
            }
        });
    });
    
    // Add event listeners to appointment action buttons
    const appointmentViewButtons = document.querySelectorAll('.appointment-actions .btn:not(.primary)');
    appointmentViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentItem = this.closest('.appointment-item');
            const patientName = appointmentItem.querySelector('.appointment-details strong').textContent;
            const appointmentType = appointmentItem.querySelector('.appointment-details span').textContent;
            
            console.log(`View appointment for ${patientName}: ${appointmentType}`);
            // In a real application, you would redirect to the appointment details page
            // window.location.href = `appointment-details.html?patient=${encodeURIComponent(patientName)}`;
        });
    });
    
    const appointmentStartButtons = document.querySelectorAll('.appointment-actions .btn.primary');
    appointmentStartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const appointmentItem = this.closest('.appointment-item');
            const patientName = appointmentItem.querySelector('.appointment-details strong').textContent;
            
            console.log(`Start appointment with ${patientName}`);
            // In a real application, you would redirect to the appointment session page
            // window.location.href = `appointment-session.html?patient=${encodeURIComponent(patientName)}`;
        });
    });
}

function fetchTodaysAppointments() {
    // In a real application, you would fetch appointment data from your API
    // This is just a placeholder
    const apiBaseUrl = window.__env?.API_BASE_URL || "https://localhost:7291";
    const token = localStorage.getItem('token');
    
    // Example of how you would fetch appointment data
    /*
    fetch(`${apiBaseUrl}/api/doctor/appointments/today`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }
        return response.json();
    })
    .then(data => {
        // Update the appointment list with real data
        updateAppointmentList(data);
    })
    .catch(error => {
        console.error('Error fetching appointments:', error);
    });
    */
}

function updateAppointmentList(appointments) {
    // Function to update the appointment list with data from the API
    const appointmentList = document.querySelector('.appointment-list');
    
    if (!appointmentList || !appointments || !appointments.length) {
        return;
    }
    
    // Clear existing appointments
    appointmentList.innerHTML = '';
    
    // Add new appointments
    appointments.forEach(appointment => {
        const appointmentItem = document.createElement('div');
        appointmentItem.className = 'appointment-item';
        
        appointmentItem.innerHTML = `
            <div class="appointment-time">${appointment.time}</div>
            <div class="appointment-details">
                <strong>${appointment.patientName}</strong>
                <span>${appointment.type}</span>
            </div>
            <div class="appointment-actions">
                <button class="btn small">View</button>
                <button class="btn small primary">Start</button>
            </div>
        `;
        
        appointmentList.appendChild(appointmentItem);
    });
}