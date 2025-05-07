document.addEventListener('DOMContentLoaded', function() {
    // Get buttons from the navbar
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    // Add event listeners for navigation
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Already on login page, do nothing or refresh
            window.location.reload();
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = './register.html';
        });
    }
    
    // Get the login form
    const loginForm = document.getElementById('loginForm');
    const messageContainer = document.getElementById('messageContainer');
    
    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };
            
            // Validate form data (basic validation)
            if (!formData.email || !formData.password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Get the API base URL from the environment variables
            const apiBaseUrl = window.__env.API_BASE_URL;
            const loginUrl = `${apiBaseUrl}/api/auth/login`;
            
            // Show loading message
            showMessage('Logging in...', 'info');
            
            // Send the login data to the API
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
                    return response.json().then(data => {
                        throw new Error(data.message || 'Invalid email or password');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Handle successful login
                showMessage('Login successful! Redirecting...', 'success');
                
                // Store the token and user info in localStorage
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                }
                
                // Redirect based on user role
                redirectUserBasedOnRole(data);
            })
            .catch(error => {
                // Handle login error
                if (error.message === "Failed to fetch") {
                    showMessage("Unable to connect to the server. Please check if the API is running.", 'error');
                } else {
                    showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
                }
            });
        });
    }
    
    // Function to redirect user based on role
    function redirectUserBasedOnRole(data) {
        let redirectPath = '../pages/dashboard/';
        
        // Default redirect if we can't determine role
        if (!data.user || !data.user.role) {
            window.location.href = redirectPath;
            return;
        }
        
        // Role-specific redirects
        const role = data.user.role.toLowerCase();
        switch(role) {
            case 'admin':
                redirectPath += 'admin.html';
                break;
            case 'doctor':
                redirectPath += 'doctor.html';
                break;
            case 'patient':
                redirectPath += 'patient.html';
                break;
            case 'nurse':
                redirectPath += 'nurse.html';
                break;
            default:
                redirectPath += 'index.html';
        }
        
        // Redirect with a short delay to show the success message
        setTimeout(() => {
            window.location.href = redirectPath;
        }, 1500);
    }
    
    // Function to show messages to the user
    function showMessage(message, type) {
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.className = 'message-container';
            messageContainer.classList.add(type);
            messageContainer.style.display = 'block';
        }
    }
});