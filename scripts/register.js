document.addEventListener('DOMContentLoaded', function() {
    // Get buttons from the navbar
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    
    // Add event listeners for navigation
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = './login.html';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            // Already on register page, do nothing or refresh
        });
    }
    
    // Get the registration form
    const registerForm = document.getElementById('registerForm');
    const messageContainer = document.getElementById('messageContainer');
    
    // Handle form submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                role: document.getElementById('role').value
            };
            
            // Validate form data (basic validation)
            if (!formData.firstName || !formData.lastName || !formData.email || 
                !formData.password || !formData.role) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Get the API base URL from the environment variables
            const apiBaseUrl = window.__env.API_BASE_URL;
            const registerUrl = `${apiBaseUrl}/api/auth/register`;
            
            // Send the registration data to the API
            fetch(registerUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Registration failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Handle successful registration
                if (data.status === 200) {
                    showMessage('Registration successful! Please check your email for verification code.', 'success');
                    
                    // Create and show verification form
                    createVerificationForm(data.data);
                } else {
                    showMessage(data.message || 'Registration completed but with issues', 'warning');
                }
            })
            .catch(error => {
                // Handle registration error
                if (error.message === "Failed to fetch") {
                    showMessage("Unable to connect to the server. Please check if the API is running.", 'error');
                } else {
                    showMessage(error.message || 'An error occurred during registration', 'error');
                }
            });
        });
    }
    
    // Function to create and show verification form
    function createVerificationForm(userData) {
        // Hide the registration form
        registerForm.style.display = 'none';
        
        // Create verification form container
        const verificationContainer = document.createElement('div');
        verificationContainer.className = 'verification-container';
        
        // Create verification form HTML
        verificationContainer.innerHTML = `
            <h3>Verify Your Email</h3>
            <p>A verification code has been sent to ${userData.email}</p>
            <p class="expiry-note">This code will expire in 5 minutes</p>
            
            <form id="verificationForm">
                <div class="form-group">
                    <label for="verificationCode">Verification Code</label>
                    <input type="text" id="verificationCode" name="verificationCode" required>
                </div>
                
                <button type="submit" class="btn primary full-width">Verify</button>
            </form>
            <div class="timer">Time remaining: <span id="countdown">5:00</span></div>
        `;
        
        // Insert verification form after the register form
        registerForm.parentNode.insertBefore(verificationContainer, registerForm.nextSibling);
        
        // Start countdown timer
        startCountdown();
        
        // Add event listener to verification form
        const verificationForm = document.getElementById('verificationForm');
        verificationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const verificationCode = document.getElementById('verificationCode').value;
            
            if (!verificationCode) {
                showMessage('Please enter the verification code', 'error');
                return;
            }
            
            // Get the API base URL from the environment variables
            const apiBaseUrl = window.__env.API_BASE_URL;
            const verifyUrl = `${apiBaseUrl}/api/auth/verify-email`;
            
            // Send verification request
            fetch(verifyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    verificationCode: verificationCode
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Verification failed');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Handle successful verification
                showMessage('Email verified successfully! Redirecting to login...', 'success');
                
                // Redirect to login page after a short delay
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);
            })
            .catch(error => {
                // Handle verification error
                if (error.message === "Failed to fetch") {
                    showMessage("Unable to connect to the server. Please check if the API is running.", 'error');
                } else {
                    showMessage(error.message || 'An error occurred during verification', 'error');
                }
            });
        });
        
        // Add event listener to resend code button
        const resendCodeBtn = document.getElementById('resendCodeBtn');
        resendCodeBtn.addEventListener('click', function() {
            // Get the API base URL from the environment variables
            const apiBaseUrl = window.__env.API_BASE_URL;
            const resendUrl = `${apiBaseUrl}/api/auth/resend-code`;
            
            // Disable resend button temporarily
            resendCodeBtn.disabled = true;
            resendCodeBtn.textContent = 'Sending...';
            
            // Send resend code request
            fetch(resendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: userData.email
                })
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.message || 'Failed to resend code');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Handle successful resend
                showMessage('Verification code has been resent to your email', 'success');
                
                // Reset countdown
                startCountdown();
                
                // Enable resend button after 30 seconds
                setTimeout(() => {
                    resendCodeBtn.disabled = false;
                    resendCodeBtn.textContent = 'Resend Code';
                }, 30000);
            })
            .catch(error => {
                // Handle resend error
                if (error.message === "Failed to fetch") {
                    showMessage("Unable to connect to the server. Please check if the API is running.", 'error');
                } else {
                    showMessage(error.message || 'An error occurred while resending the code', 'error');
                }
                
                // Enable resend button
                resendCodeBtn.disabled = false;
                resendCodeBtn.textContent = 'Resend Code';
            });
        });
    }
    
    // Function to start countdown timer for verification code expiry
    function startCountdown() {
        const countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;
        
        let minutes = 5;
        let seconds = 0;
        
        // Clear any existing interval
        if (window.countdownInterval) {
            clearInterval(window.countdownInterval);
        }
        
        // Start new interval
        window.countdownInterval = setInterval(function() {
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(window.countdownInterval);
                    countdownElement.textContent = 'Expired';
                    showMessage('Verification code has expired. Please request a new one.', 'error');
                    return;
                }
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }
            
            // Format and display time
            countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }, 1000);
    }
    
    // Function to show messages to the user
    function showMessage(message, type) {
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.className = 'message-container';
            messageContainer.classList.add(type);
            messageContainer.style.display = 'block';
            
            // Scroll to the message
            messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});