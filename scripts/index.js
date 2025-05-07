document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
        try {
            const userData = JSON.parse(user);
            redirectUserBasedOnRole(userData);
            return;
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    loginBtn?.addEventListener('click', () => {
        window.location.href = './pages/login.html';
    });

    registerBtn?.addEventListener('click', () => {
        window.location.href = './pages/register.html';
    });

    loadDoctors();
});

function redirectUserBasedOnRole(userData) {
    const role = userData.role?.toLowerCase();
    const rolePages = {
        admin: 'admin.html',
        doctor: 'doctor.html',
        patient: 'patient.html',
        nurse: 'nurse.html'
    };

    const page = rolePages[role] || 'index.html';
    window.location.href = `./dashboard/${page}`;
}

function renderDoctors(doctors) {
    const container = document.getElementById('doctorsList');
    if (!container) return;

    container.innerHTML = ''; // Clear existing

    doctors.forEach(doctor => {
        const link = document.createElement('a');
        link.href = `./pages/doctor.html?id=${doctor.id}`;
        link.className = 'doctor-card';

        link.innerHTML = `
            <h3>Dr. ${doctor.firstName} ${doctor.lastName}</h3>
            <p><strong>Specialty:</strong> ${doctor.specialty}</p>
        `;

        container.appendChild(link);
    });
}

function loadDoctors() {
    const baseUrl = window.__env?.API_BASE_URL ?? 'http://localhost:5000'; ///
    const apiUrl = `${baseUrl}/api/doctors`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .then(result => {
            if (result.status === 200 && Array.isArray(result.data)) {
                renderDoctors(result.data);
            } else {
                console.error('Failed to load doctors:', result.message);
            }
        })
        .catch(error => {
            console.error('Error fetching doctors:', error);
        });
}
