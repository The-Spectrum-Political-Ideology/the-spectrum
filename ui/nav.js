// ui/nav.js
import { App } from '../app/app.js';

export function updateNavUI() {
    const loggedInLinks = document.getElementById('logged-in-links');
    const loggedOutLinks = document.getElementById('logged-out-links');
    
    if (!loggedInLinks || !loggedOutLinks) return;

    if (App.state.user) {
        loggedInLinks.classList.remove('hidden');
        loggedOutLinks.classList.add('hidden');
        
        const username = App.state.user.user_metadata?.username || 'User';
        document.getElementById('user-menu-name').textContent = username;
        document.getElementById('user-avatar-initial').textContent = username.charAt(0).toUpperCase();
    } else {
        loggedInLinks.classList.add('hidden');
        loggedOutLinks.classList.remove('hidden');
    }
}

export function updateActiveNavLinks() {
    let currentHash = window.location.hash;
    if (currentHash === '') currentHash = '#';

    document.querySelectorAll('.nav-link').forEach(link => {
        const linkHash = link.getAttribute('href');
        link.classList.toggle('active', linkHash === currentHash);
    });
}

export function toggleUserDropdown() {
    document.getElementById('user-menu-dropdown').classList.toggle('hidden');
}
export function hideUserDropdown() {
    document.getElementById('user-menu-dropdown').classList.add('hidden');
}
export function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}
export function hideMobileMenu() {
    document.getElementById('mobile-menu').classList.add('hidden');
    document.getElementById('user-menu-dropdown').classList.add('hidden');
}