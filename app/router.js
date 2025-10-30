// app/router.js
import { App } from './app.js';
import { showPageLoader, updateActiveNavLinks } from '../ui/utils.js';
import { showToast } from '../ui/toast.js';
import * as Quiz from '../services/quiz.js';

// Page Views & Logic
import { HomePage } from '../views/HomePage.js';
import { QuizPage } from '../views/QuizPage.js';
import { ResultsPage } from '../views/ResultsPage.js';
import { ProfilePage, initProfilePage } from '../views/ProfilePage.js';
import { SettingsPage } from '../views/SettingsPage.js';
import { CommunityPage, initCommunityPage } from '../views/CommunityPage.js';
import { HowItWorksPage } from '../views/HowItWorksPage.js';
import { DailyQuizPage, initDailyQuizPage } from '../views/DailyQuizPage.js'; // NEW
import { NotFoundPage, ErrorPage } from '../views/ErrorPages.js';

const routes = {
    '/': HomePage,
    '/quiz': QuizPage,
    '/daily': DailyQuizPage, // NEW
    '/results': ResultsPage,
    '/profile': ProfilePage,
    '/settings': SettingsPage,
    '/community': CommunityPage,
    '/how-it-works': HowItWorksPage,
};

async function handleRouteChange() {
    const cleanHash = window.location.hash.substring(1) || '/';
    const [path, param] = cleanHash.split('/');
    const routeKey = path === '/' || path === '' ? '/' : `/${path}`;
    
    const view = routes[routeKey] || NotFoundPage;
    const main = document.getElementById('app');

    if (!main) return;

    // --- Route Guards ---
    const requiresAuth = ['/settings', '/daily']; // Settings & Daily Quiz are protected
    if (requiresAuth.includes(routeKey) && !App.state.user) {
        window.location.hash = '';
        showToast('You must be logged in to view that page.', 'info');
        return;
    }
    
    if (routeKey === '/profile' && !param && !App.state.user) {
        window.location.hash = '';
        showToast('You must be logged in to view your profile.', 'info');
        return;
    }

    if (routeKey === '/results' && !App.state.quizResults) {
         window.location.hash = 'quiz';
         showToast('You must complete a quiz to see results.', 'info');
         return;
    }

    // --- Render Page ---
    showPageLoader(main);
    try {
        main.innerHTML = await view(param);

        // --- Run Page-Specific Logic ---
        if (routeKey === '/quiz') {
            Quiz.start();
        }
        if (routeKey === '/results') {
            Quiz.renderResults();
        }
        if (routeKey === '/settings') {
            setupSettingsListeners();
        }
        if (routeKey === '/community') {
            initCommunityPage();
        }
        if (routeKey === '/profile') {
            initProfilePage(param);
        }
        if (routeKey === '/daily') {
            initDailyQuizPage(); // NEW
        }

    } catch (error) {
        console.error("Error rendering page:", error);
        main.innerHTML = ErrorPage(error.message);
    }

    updateActiveNavLinks();
    if(window.feather) feather.replace();
}

// Page-specific listener that needs to be attached *after* render
function setupSettingsListeners() {
    const adsToggle = document.getElementById('ads-toggle');
    if (adsToggle) {
        adsToggle.addEventListener('change', (e) => {
            const enabled = e.target.checked;
            document.body.classList.toggle('ads-enabled', enabled);
            localStorage.setItem('adsEnabled', enabled);
            showToast(`Ads ${enabled ? 'enabled' : 'disabled'}.`, 'info');
        });
    }
}

export const router = {
    handleRouteChange,
};