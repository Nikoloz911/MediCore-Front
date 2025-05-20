document.addEventListener('DOMContentLoaded', () => {
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('user');

    if (token && user) {
        try {
            let userData = JSON.parse(user);
            redirectUserBasedOnRole(userData);
            return; 
        } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }

    let loginBtn = document.getElementById('loginBtn');
    let registerBtn = document.getElementById('registerBtn');

    loginBtn?.addEventListener('click', () => {
        window.location.href = './pages/login.html';
    });

    registerBtn?.addEventListener('click', () => {
        window.location.href = './pages/register.html';
    });

    loadDoctors();
});

function redirectUserBasedOnRole(userData) {
    let role = userData.role?.toLowerCase();
    let rolePages = {
        admin: 'admin.html',
        doctor: 'doctor.html',
        patient: 'patient.html',
        nurse: 'nurse.html'
    };

    let page = rolePages[role] || 'index.html';
    window.location.href = page; // Redirect user based on their role
}

function renderDoctors(doctors) {
    let container = document.getElementById('doctorsList');
    if (!container) return;

    container.innerHTML = ''; // Clear existing

    doctors.forEach(doctor => {
        let card = document.createElement('div');
        card.className = 'doctor-card';

        card.innerHTML = `
            <div class="doctor-card-inner">
                <img src="${doctor.imageURL || 'https://via.placeholder.com/300'}" alt="Dr. ${doctor.firstName}" class="doctor-image" />
                <div class="doctor-details">
                    <h3>Dr. ${doctor.firstName} ${doctor.lastName}</h3>
                    <p class="specialty">${doctor.specialty}</p>
                    <a href="./pages/doctor.html?id=${doctor.id}" class="view-profile">View Profile</a>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}


function loadDoctors() {
    let baseUrl = window.__env?.API_BASE_URL ?? 'http://localhost:5000';
    let apiUrl = `${baseUrl}/api/doctors`;

    console.log('Fetching doctors from:', apiUrl);

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
            return response.json();
        })
        .then(result => {
            console.log('API response:', result);
            if (result.status === 200 && Array.isArray(result.data)) {
                renderDoctors(result.data);
            } else {
                console.error('Unexpected API format or error:', result);
            }
        })
        .catch(error => {
            console.error('Fetch failed:', error);
        });
}
