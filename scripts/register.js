document.addEventListener('DOMContentLoaded', function() {
    let loginBtn = document.getElementById('loginBtn');
    let registerBtn = document.getElementById('registerBtn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = './login.html';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
        });
    }
    
    let registerForm = document.getElementById('registerForm');
    let messageContainer = document.getElementById('messageContainer');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value,
                role: document.getElementById('role').value
            };
            
            if (!formData.firstName || !formData.lastName || !formData.email || 
                !formData.password || !formData.role) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            let apiBaseUrl = window.__env.API_BASE_URL;
            let registerUrl = `${apiBaseUrl}/api/auth/register`;
            
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
                if (data.status === 200) {
                    showMessage('Registration successful! Please check your email for verification code.', 'success');               
                    createVerificationForm(data.data);
                } else {
                    showMessage(data.message || 'Registration completed but with issues', 'warning');
                }
            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    showMessage("Unable to connect to the server. Please check if the API is running.", 'error');
                } else {
                    showMessage(error.message || 'An error occurred during registration', 'error');
                }
            });
        });
    }
    
    function createVerificationForm(userData) {
        registerForm.style.display = 'none';
        
        let verificationContainer = document.createElement('div');
        verificationContainer.className = 'verification-container';
        
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
        
        registerForm.parentNode.insertBefore(verificationContainer, registerForm.nextSibling);
        
        startCountdown();
        
        let verificationForm = document.getElementById('verificationForm');
        verificationForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            let verificationCode = document.getElementById('verificationCode').value;
            
            if (!verificationCode) {
                showMessage('Please enter the verification code', 'error');
                return;
            }
            
            let apiBaseUrl = window.__env.API_BASE_URL;
            let verifyUrl = `${apiBaseUrl}/api/auth/verify-email`;
            
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
                showMessage('Email verified successfully! Redirecting to login...', 'success');           
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 2000);
            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    showMessage("Unable to connect to the server. Please check if the API is running.", 'error');
                } else {
                    showMessage(error.message || 'An error occurred during verification', 'error');
                }
            });
        });
        
        let resendCodeBtn = document.getElementById('resendCodeBtn');
        resendCodeBtn.addEventListener('click', function() {
            let apiBaseUrl = window.__env.API_BASE_URL;
            let resendUrl = `${apiBaseUrl}/api/auth/resend-code`;
            
            resendCodeBtn.disabled = true;
            resendCodeBtn.textContent = 'Sending...';
            
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
                showMessage('Verification code has been resent to your email', 'success');           
                startCountdown();          
                setTimeout(() => {
                    resendCodeBtn.disabled = false;
                    resendCodeBtn.textContent = 'Resend Code';
                }, 30000);
            })
            .catch(error => {
                if (error.message === "Failed to fetch") {
                    showMessage("Unable to connect to the server. Please check if the API is running.", 'error');
                } else {
                    showMessage(error.message || 'An error occurred while resending the code', 'error');
                }          
                resendCodeBtn.disabled = false;
                resendCodeBtn.textContent = 'Resend Code';
            });
        });
    }
    function startCountdown() {
        let countdownElement = document.getElementById('countdown');
        if (!countdownElement) return;
        
        let minutes = 5;
        let seconds = 0;
        
        if (window.countdownInterval) {
            clearInterval(window.countdownInterval);
        }
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
            countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        }, 1000);
    }
    function showMessage(message, type) {
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.className = 'message-container';
            messageContainer.classList.add(type);
            messageContainer.style.display = 'block';
            messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});