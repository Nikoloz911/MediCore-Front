document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and has patient role
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    const role = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.toLowerCase();
    
    if (role !== 'patient') {
        window.location.href = 'login.html';
        return;
    }
    
    // Set welcome message with patient's name
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
    
    // Initialize patient portal functionality
    initPortal();
});

function initPortal() {
    // Here you would initialize any patient portal specific functionality
    fetchHealthSummary();
    
    // Add event listeners to dashboard cards
    const dashboardButtons = document.querySelectorAll('.dashboard-card .btn');
    dashboardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardTitle = this.parentElement.querySelector('h3').textContent;
            
            switch(cardTitle) {
                case 'My Appointments':
                    // Handle my appointments click
                    console.log('My appointments clicked');
                    // window.location.href = 'patient-appointments.html';
                    break;
                case 'Medical Records':
                    // Handle medical records click
                    console.log('Medical records clicked');
                    // window.location.href = 'patient-records.html';
                    break;
                case 'Prescriptions':
                    // Handle prescriptions click
                    console.log('Prescriptions clicked');
                    // window.location.href = 'patient-prescriptions.html';
                    break;
                case 'Billing & Insurance':
                    // Handle billing click
                    console.log('Billing clicked');
                    // window.location.href = 'patient-billing.html';
                    break;
            }
        });
    });
    
    // Add event listeners to summary items
    const summaryItems = document.querySelectorAll('.summary-item');
    summaryItems.forEach(item => {
        item.addEventListener('click', function() {
            const parentCard = this.closest('.summary-card');
            const cardTitle = parentCard.querySelector('h3').textContent;
            
            switch(cardTitle) {
                case 'Upcoming Appointments':
                    // Handle appointment click
                    console.log('Appointment details clicked');
                    // window.location.href = 'appointment-details.html';
                    break;
                case 'Recent Medications':
                    // Handle medication click
                    const medicationName = this.querySelector('strong').textContent;
                    console.log(`Medication details clicked: ${medicationName}`);
                    // window.location.href = `medication-details.html?name=${encodeURIComponent(medicationName)}`;
                    break;
                case 'Recent Test Results':
                    // Handle test results click
                    const testName = this.querySelector('strong').textContent;
                    console.log(`Test results clicked: ${testName}`);
                    // window.location.href = `test-results.html?name=${encodeURIComponent(testName)}`;
                    break;
            }
        });
    });
}

function fetchHealthSummary() {
    // In a real application, you would fetch health summary data from your API
    // This is just a placeholder
    const apiBaseUrl = window.__env?.API_BASE_URL || "https://localhost:7291";
    const token = localStorage.getItem('token');
    
    // Example of how you would fetch health summary data
    /*
    fetch(`${apiBaseUrl}/api/patient/health-summary`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch health summary');
        }
        return response.json();
    })
    .then(data => {
        // Update the health summary with real data
        updateHealthSummary(data);
    })
    .catch(error => {
        console.error('Error fetching health summary:', error);
    });
    */
}

function updateHealthSummary(data) {
    // Function to update the health summary with data from the API
    if (!data) {
        return;
    }
    
    // Update upcoming appointments
    if (data.appointments && data.appointments.length > 0) {
        const appointmentsContainer = document.querySelector('.summary-card:nth-child(1)');
        if (appointmentsContainer) {
            const appointmentsHTML = data.appointments.map(appointment => `
                <div class="summary-item">
                    <div class="summary-date">${appointment.date}</div>
                    <div class="summary-details">
                        <strong>Dr. ${appointment.doctorName}</strong>
                        <span>${appointment.reason} - ${appointment.time}</span>
                    </div>
                </div>
            `).join('');
            
            appointmentsContainer.querySelector('.summary-item').parentNode.innerHTML = `
                <h3>Upcoming Appointments</h3>
                ${appointmentsHTML}
            `;
        }
    }
    
    // Update medications
    if (data.medications && data.medications.length > 0) {
        const medicationsContainer = document.querySelector('.summary-card:nth-child(2)');
        if (medicationsContainer) {
            const medicationsHTML = data.medications.map(medication => `
                <div class="summary-item">
                    <div class="summary-details">
                        <strong>${medication.name}</strong>
                        <span>${medication.dosage}, ${medication.frequency}</span>
                        <span class="refill-status">Refills: ${medication.refillsRemaining} remaining</span>
                    </div>
                </div>
            `).join('');
            
            medicationsContainer.querySelector('.summary-item').parentNode.innerHTML = `
                <h3>Recent Medications</h3>
                ${medicationsHTML}
            `;
        }
    }
    
    // Update test results
    if (data.testResults && data.testResults.length > 0) {
        const testResultsContainer = document.querySelector('.summary-card:nth-child(3)');
        if (testResultsContainer) {
            const testResultsHTML = data.testResults.map(test => `
                <div class="summary-item">
                    <div class="summary-date">${test.date}</div>
                    <div class="summary-details">
                        <strong>${test.name}</strong>
                        <span>${test.status}</span>
                    </div>
                </div>
            `).join('');
            
            testResultsContainer.querySelector('.summary-item').parentNode.innerHTML = `
                <h3>Recent Test Results</h3>
                ${testResultsHTML}
            `;
        }
    }
}