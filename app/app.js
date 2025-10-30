// app/app.js
import { router } from './router.js';
import * as Auth from '../services/auth.js';
import * as Nav from '../ui/nav.js';
import * as Modal from '../ui/modal.js';
import { loadTheme, toggleTheme, loadAdSettings } from '../ui/theme.js';
import { setupAuthFormListeners } from '../listeners/authListeners.js';

/**
 * ---
 * APPLICATION STATE
 * ---
 * A central object to hold our application's state.
 */
const state = {
    user: null, // Holds the Supabase user object
    session: null, // Holds the Supabase session
    quizResults: null, // Holds results from the last quiz
    ideology: null, // Holds matched ideology
    loading: false, // Global loading state
};

/**
 * ---
 * APPLICATION
 * ---
 */
export const App = {
    state, // Expose state

    init() {
        // Load UI preferences
        loadTheme();
        loadAdSettings();

        // Initialize Feather Icons
        if (window.feather) {
            feather.replace();
        }

        // Setup global event listeners
        this.setupGlobalListeners();
        setupAuthFormListeners();

        // Handle Auth State Changes (Login/Logout)
        Auth.onAuthStateChange((event, session) => {
            App.state.user = session?.user || null;
            App.state.session = session || null;
            Nav.updateNavUI(); // Update nav based on auth state
            router.handleRouteChange(); // Re-route to handle auth-only pages
        });

        // Handle Password Reset Flow
        Auth.handlePasswordResetToken();

        // Initial Route
        router.handleRouteChange();
    },

    setupGlobalListeners() {
        const body = document.body;

        body.addEventListener('click', e => {
            // Theme Toggle
            const themeToggle = e.target.closest('#theme-toggle');
            if (themeToggle) toggleTheme();
            
            // Modal Triggers
            const modalTrigger = e.target.closest('[data-modal-trigger]');
            if (modalTrigger) {
                e.preventDefault();
                Modal.showModal(modalTrigger.dataset.modalTrigger);
            }

            // Modal Close
            const modalClose = e.target.closest('.modal-close');
            if (modalClose) {
                e.preventDefault();
                Modal.hideModal();
            }
            
            // Nav Dropdown
            const userMenuBtn = e.target.closest('#user-menu-button');
            if(userMenuBtn) {
                Nav.toggleUserDropdown();
            } else if (!e.target.closest('#user-menu-dropdown')) {
                Nav.hideUserDropdown();
            }
            
            // Logout Button
            const logoutBtn = e.target.closest('#logout-button');
            if (logoutBtn) Auth.logout();

            // Mobile Menu
            const mobileMenuBtn = e.target.closest('#mobile-menu-btn');
            if(mobileMenuBtn) Nav.toggleMobileMenu();

            // Close mobile menu when a link is clicked
            const navLink = e.target.closest('[data-nav-link]');
            if (navLink) Nav.hideMobileMenu();
        });
        
        // Close modal on backdrop click
        document.getElementById('modal-backdrop').addEventListener('click', () => Modal.hideModal());

        // Listen for hash changes (browser back/forward)
        window.addEventListener('hashchange', () => router.handleRouteChange());
    }
};