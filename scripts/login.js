document.addEventListener('DOMContentLoaded', function () {
    let loginForm = document.getElementById('loginForm');
    let messageContainer = document.getElementById('messageContainer');

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();

            let formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            if (!formData.email || !formData.password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }

            let apiBaseUrl = window.__env?.API_BASE_URL || "https://localhost:7291";
            let loginUrl = `${apiBaseUrl}/api/auth/login`;

            showMessage('Logging in...', 'info');

            fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Invalid credentials');
                    }
                    return response.json();
                })
                .then(responseData => {
                    let data = responseData.data;

                    if (data && data.token) {
                        localStorage.setItem('token', data.token);
                        let decodedToken = JSON.parse(atob(data.token.split('.')[1]));
                        localStorage.setItem('user', JSON.stringify(decodedToken));

                        showMessage('Login successful! Redirecting...', 'success');
                        redirectUserBasedOnRole(decodedToken);
                    } else {
                        showMessage('Login failed. Please check your credentials.', 'error');
                    }
                })
                .catch(error => {
                    showMessage(error.message || 'Login failed. Please try again later.', 'error');
                });
        });
    }

    function redirectUserBasedOnRole(user) {
        let role = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']?.toLowerCase();
        let redirectPath = 'index.html';

        switch (role) {
            case 'admin': redirectPath = 'admin.html'; break;
            case 'doctor': redirectPath = 'doctorpage.html'; break;
            case 'patient': redirectPath = 'patient.html'; break;
            case 'nurse': redirectPath = 'nurse.html'; break;
        }

        setTimeout(() => {
            window.location.href = redirectPath;
        }, 1500);
    }

    function showMessage(message, type) {
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.className = `message-container ${type}`;
            messageContainer.style.display = 'block';
        }
    }
});
