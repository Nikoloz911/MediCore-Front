// ./scripts/doctor.js

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const doctorId = urlParams.get('id');
    if (!doctorId) return;

    const baseUrl = window.__env?.API_BASE_URL ?? 'http://localhost:5000';
    const apiUrl = `${baseUrl}/api/doctors/${doctorId}`;

    fetch(apiUrl)
        .then(res => res.json())
        .then(result => {
            if (result.status === 200 && result.data) {
                renderDoctorDetails(result.data);
            } else {
                console.error('Doctor not found.');
            }
        })
        .catch(err => console.error('Error loading doctor:', err));
});

function renderDoctorDetails(doctor) {
    const container = document.getElementById('doctorDetails');
    if (!container) return;

    const image = doctor.imageURL && doctor.imageURL.trim() !== ""
        ? doctor.imageURL
        : "https://via.placeholder.com/300x400.png?text=Doctor+Image";

    container.innerHTML = `
        <div class="doctor-profile-card">
            <div class="profile-img-box">
                <img src="${image}" alt="Dr. ${doctor.firstName}" />
            </div>
            <div class="profile-info">
                <h2>Dr. ${doctor.firstName} ${doctor.lastName}</h2>
                <p><i class="fas fa-envelope"></i> ${doctor.email}</p>
                <p><i class="fas fa-user-md"></i> ${doctor.specialty}</p>
                <p><i class="fas fa-id-badge"></i> License: ${doctor.licenseNumber}</p>
                <p><i class="fas fa-clock"></i> Hours: ${doctor.workingHours}</p>
                <p><i class="fas fa-briefcase"></i> Experience: ${doctor.experienceYears} years</p>
                <p><i class="fas fa-hospital"></i> Department: ${doctor.departmentType}</p>
            </div>
        </div>
    `;
}
