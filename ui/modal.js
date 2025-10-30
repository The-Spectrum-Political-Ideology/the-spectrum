// ui/modal.js

export function showModal(type) {
    const container = document.getElementById('modal-container');
    let content = '';
    
    if (type === 'login') content = LoginModal();
    if (type === 'signup') content = SignupModal();
    if (type === 'forgotPassword') content = ForgotPasswordModal();
    if (type === 'resetPassword') content = ResetPasswordModal();
    
    if (content) {
        container.innerHTML = content;
        if(window.feather) feather.replace();
    
        document.getElementById('modal-backdrop').classList.remove('hidden');
        container.classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('modal-backdrop').classList.add('visible');
            container.classList.add('visible');
        }, 10);
    } else {
        console.warn(`Unknown modal type: ${type}`);
    }
}

export function hideModal() {
    const backdrop = document.getElementById('modal-backdrop');
    const container = document.getElementById('modal-container');
    
    backdrop.classList.remove('visible');
    container.classList.remove('visible');
    
    setTimeout(() => {
        backdrop.classList.add('hidden');
        container.classList.add('hidden');
        container.innerHTML = '';
    }, 300);
}


// --- Modal Templates ---

function LoginModal() {
    return `
        <div class="modal-content">
            <button class="modal-close-btn modal-close"><i data-feather="x"></i></button>
            <h3 class="modal-title">Log In</h3>
            <form id="login-form" class="space-y-4">
                <div>
                    <label for="login-email" class="form-label">Email</label>
                    <input type="email" id="login-email" name="email" class="form-input" required>
                </div>
                <div>
                    <label for="login-password" class="form-label">Password</label>
                    <input type="password" id="login-password" name="password" class="form-input" required>
                </div>
                <div class="text-sm">
                    <a href="#" class="font-medium text-indigo-600 dark:text-indigo-400 hover:underline" data-modal-trigger="forgotPassword">
                        Forgot your password?
                    </a>
                </div>
                <button type="submit" class="btn btn-primary w-full">Log In</button>
            </form>
        </div>
    `;
}

function SignupModal() {
    return `
        <div class="modal-content">
            <button class="modal-close-btn modal-close"><i data-feather="x"></i></button>
            <h3 class="modal-title">Sign Up</h3>
            <form id="signup-form" class="space-y-4">
                <div>
                    <label for="signup-email" class="form-label">Email</label>
                    <input type="email" id="signup-email" name="email" class="form-input" required>
                </div>
                 <div>
                    <label for="signup-username" class="form-label">Username</label>
                    <input type="text" id="signup-username" name="username" class="form-input" required minlength="3">
                </div>
                <div>
                    <label for="signup-password" class="form-label">Password</label>
                    <input type="password" id="signup-password" name="password" class="form-input" required minlength="6">
                </div>
                <button type="submit" class="btn btn-primary w-full">Create Account</button>
            </form>
        </div>
    `;
}

function ForgotPasswordModal() {
    return `
        <div class="modal-content">
            <button class="modal-close-btn modal-close"><i data-feather="x"></i></button>
            <h3 class="modal-title">Reset Password</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter your email and we'll send you a link to reset your password.
            </p>
            <form id="forgot-password-form" class="space-y-4">
                <div>
                    <label for="reset-email" class="form-label">Email</label>
                    <input type="email" id="reset-email" name="email" class="form-input" required>
                </div>
                <button type="submit" class="btn btn-primary w-full">Send Reset Link</button>
            </form>
        </div>
    `;
}

function ResetPasswordModal() {
    return `
        <div class="modal-content">
            <button class="modal-close-btn modal-close"><i data-feather="x"></i></button>
            <h3 class="modal-title">Create New Password</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                You are logged in. Enter a new password below to update your account.
            </p>
            <form id="reset-password-form" class="space-y-4">
                <div>
                    <label for="new-password" class="form-label">New Password</label>
                    <input type="password" id="new-password" name="password" class="form-input" required minlength="6">
                </div>
                <button type="submit" class="btn btn-primary w-full">Update Password</button>
            </form>
        </div>
    `;
}