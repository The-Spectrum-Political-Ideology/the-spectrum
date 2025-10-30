// services/auth.js
import { supabase } from './supabase.js';
import { App } from '../app/app.js';
import { showToast } from '../ui/toast.js';
import { showModal, hideModal } from '../ui/modal.js';
import { setButtonLoading } from '../ui/utils.js';

export const onAuthStateChange = (callback) => {
    return supabase.auth.onAuthStateChange(callback);
}

export async function signup(email, username, password, btn) {
    setButtonLoading(btn, true);
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { username: username }
        }
    });

    if (error) {
        showToast(error.message, 'error');
    } else {
        hideModal();
        showToast('Signup successful! Please check your email to confirm.', 'success');
    }
    setButtonLoading(btn, false);
}

export async function login(email, password, btn) {
    setButtonLoading(btn, true);
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        showToast(error.message, 'error');
    } else {
        hideModal();
        showToast('Logged in successfully!', 'success');
    }
    setButtonLoading(btn, false);
}

export async function logout() {
    await supabase.auth.signOut();
    App.state.quizResults = null;
    App.state.ideology = null;
    window.location.hash = '';
    showToast('Logged out.', 'info');
}

export async function sendPasswordResetEmail(email, btn) {
    setButtonLoading(btn, true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + window.location.pathname, 
    });
    
    if (error) {
        showToast(error.message, 'error');
    } else {
        hideModal();
        showToast('Password reset email sent. Check your inbox.', 'success');
    }
    setButtonLoading(btn, false);
}

export function handlePasswordResetToken() {
    onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
            hideModal(); // Hide any open modals
            showModal('resetPassword');
        }
    });
}

export async function updatePassword(password, btn) {
    setButtonLoading(btn, true);
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        showToast(error.message, 'error');
    } else {
        hideModal();
        showToast('Password updated successfully!', 'success');
    }
    setButtonLoading(btn, false);
}