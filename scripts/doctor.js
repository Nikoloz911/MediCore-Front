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

    container.innerHTML = `
        <h2>Dr. ${doctor.firstName} ${doctor.lastName}</h2>
        <p><strong>Email:</strong> ${doctor.email}</p>
        <p><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p><strong>License Number:</strong> ${doctor.licenseNumber}</p>
        <p><strong>Working Hours:</strong> ${doctor.workingHours}</p>
        <p><strong>Experience:</strong> ${doctor.experienceYears} years</p>
        <p><strong>Department:</strong> ${doctor.departmentType}</p>
    `;
}
