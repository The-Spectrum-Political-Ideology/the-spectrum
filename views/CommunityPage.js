// views/CommunityPage.js
import * as API from '../services/api.js';

// 1. Render function (exports the HTML)
export function CommunityPage() {
    return `
        <div class="animate-fade-in-up max-w-3xl mx-auto">
            <h1>Community</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
                Browse other users and see where they stand.
            </p>
            <div class="mt-6">
                <input type="search" id="user-search-input" class="form-input" placeholder="Search for users by username...">
            </div>
            
            <div id="user-list-container" class="mt-6">
                <div class="page-loader"><div class="spinner-lg"></div></div>
            </div>
        </div>
    `;
}

// 2. Init function (called by the router)
export async function initCommunityPage() {
    const searchInput = document.getElementById('user-search-input');
    const userListContainer = document.getElementById('user-list-container');
    
    let debounceTimer;
    searchInput.addEventListener('keyup', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            loadUsers(e.target.value);
        }, 300); // Debounce search
    });

    async function loadUsers(query = '') {
        userListContainer.innerHTML = `<div class="page-loader"><div class="spinner-lg"></div></div>`;
        try {
            const users = await API.searchUsers(query);
            renderUsers(users);
        } catch (error) {
            userListContainer.innerHTML = `<p class="text-red-400">Error loading users: ${error.message}</p>`;
        }
    }

    function renderUsers(users) {
        if (users.length === 0) {
            userListContainer.innerHTML = `<p class="text-gray-500 text-center">No users found.</p>`;
            return;
        }

        userListContainer.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${users.map(user => UserCard(user)).join('')}
            </div>
        `;
        if (window.feather) feather.replace();
    }

    // Initial load
    loadUsers();
}

// 3. Component Template
function UserCard(user) {
    const ideology = user.latest_ideology || 'Undecided';
    return `
        <a href="#profile/${user.id}" class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex items-center gap-4 hover:shadow-lg transition-shadow">
            <div class="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                ${user.username.charAt(0).toUpperCase()}
            </div>
            <div>
                <h3 class="font-bold text-lg">${user.username}</h3>
                <p class="text-sm text-indigo-400">${ideology}</p>
                <span class="text-xs text-gray-500">Level ${user.level || 1}</span>
            </div>
        </a>
    `;
}