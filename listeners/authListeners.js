// listeners/authListeners.js
import * as Auth from '../services/auth.js';
import { setButtonLoading } from '../ui/utils.js';

export function setupAuthFormListeners() {
    document.body.addEventListener('submit', async e => {
        const form = e.target;
        const btn = form.querySelector('button[type="submit"]');

        if (form.id === 'login-form') {
            e.preventDefault();
            Auth.login(form.email.value, form.password.value, btn);
        }
        
        if (form.id === 'signup-form') {
            e.preventDefault();
            Auth.signup(form.email.value, form.username.value, form.password.value, btn);
        }

        if (form.id === 'forgot-password-form') {
            e.preventDefault();
            Auth.sendPasswordResetEmail(form.email.value, btn);
        }

        if (form.id === 'reset-password-form') {
            e.preventDefault();
            Auth.updatePassword(form.password.value, btn);
        }
    });
}