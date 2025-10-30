// views/ProfilePage.js
import { App } from '../app/app.js';
import * as API from '../services/api.js';
import { ErrorPage } from './ErrorPages.js';
import { setButtonLoading } from '../ui/utils.js';
import { showToast } from '../ui/toast.js';

const XP_PER_LEVEL = 1000;

// 1. Render function (exports the HTML)
export async function ProfilePage(userIdParam) {
    const targetUserId = userIdParam || App.state.user?.id;
    
    if (!targetUserId) {
         return ErrorPage("User not found. You may need to log in.");
    }

    const currentUserId = App.state.user?.id;
    const isOwnProfile = targetUserId === currentUserId;

    let profile, results, friends, badges;
    try {
        profile = await API.getProfile(targetUserId);
        results = await API.getQuizHistory(targetUserId);
        friends = await API.getFriends(targetUserId);
        badges = await API.getBadgesForUser(targetUserId);
    } catch (e) {
        console.error("Error fetching profile:", e);
        return ErrorPage(`Could not load profile: ${e.message}`);
    }

    // --- Calculate Level & XP Bar ---
    const totalXp = profile.total_xp || 0;
    const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
    const xpBarPercentage = (xpInCurrentLevel / XP_PER_LEVEL) * 100;
    const currentStreak = profile.current_streak || 0;

    // --- Render Chart ---
    // (We move this to initProfilePage to ensure the canvas exists first)
    
    return `
        <div class="animate-fade-in-up max-w-4xl mx-auto space-y-6">
            
            <div class="profile-card">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-24 h-24 rounded-full bg-gray-600 border-4 border-white dark:border-gray-800 flex items-center justify-center text-5xl font-bold text-white flex-shrink-0">
                            ${profile.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 class="text-3xl font-bold">${profile.username}</h1>
                            <p class="text-lg text-indigo-500 dark:text-indigo-300 font-medium">${profile.latest_ideology || 'No quiz taken'}</p>
                            <div class="flex items-center gap-4 mt-1">
                                <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Level ${currentLevel}</span>
                                ${currentStreak > 0 ? `
                                    <span class="flex items-center gap-1 text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                        <i data-feather="zap" class="w-4 h-4"></i>
                                        ${currentStreak} Day Streak
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div id="profile-action-btn-container" class="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0" data-target-user-id="${profile.id}">
                        ${renderActionButton(isOwnProfile)}
                    </div>
                </div>
                
                <div class="mt-6">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                        <div class="bg-green-500 h-4" style="width: ${xpBarPercentage}%"></div>
                    </div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">${xpInCurrentLevel} / ${XP_PER_LEVEL} XP</p>
                </div>
            </div>

            <div class="profile-card">
                <h2 class="text-2xl font-bold mb-4">Achievements (${badges.length})</h2>
                ${renderBadgeList(badges)}
            </div>

            <div class="profile-card">
                <h2 class="text-2xl font-bold mb-4">Ideological Journey</h2>
                <div class="mt-4 h-80 relative">
                    <canvas id="journey-chart"></canvas>
                    ${results.length < 2 ? `<p id="journey-placeholder" class="text-gray-500 dark:text-gray-400 text-center absolute inset-0 flex items-center justify-center">Complete at least two quizzes to see your journey.</p>` : ''}
                </div>
            </div>

            <div class="profile-card">
                <h2 class="text-2xl font-bold mb-4">Friends (${friends.length})</h2>
                ${renderFriendList(friends)}
            </div>

        </div>
    `;
}

// 2. Init function (called by the router)
export async function initProfilePage(userIdParam) {
    const targetUserId = userIdParam || App.state.user?.id;
    if (!targetUserId) return;

    // --- RENDER CHART ---
    // We do this here to ensure the canvas element exists
    const ctx = document.getElementById('journey-chart');
    if (ctx) {
        try {
            const results = await API.getQuizHistory(targetUserId);
            if (results.length < 2) {
                // Placeholder is already in the HTML
            } else {
                document.getElementById('journey-placeholder')?.remove();
                new Chart(ctx.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: results.map(r => new Date(r.created_at).toLocaleDateString()),
                        datasets: [
                            { label: 'Economic', data: results.map(r => r.scores.econ), borderColor: '#818cf8', tension: 0.1, fill: false },
                            { label: 'Diplomatic', data: results.map(r => r.scores.dipl), borderColor: '#4ade80', tension: 0.1, fill: false },
                            { label: 'Civil', data: results.map(r => r.scores.govt), borderColor: '#f87171', tension: 0.1, fill: false },
                            { label: 'Societal', data: results.map(r => r.scores.scty), borderColor: '#facc15', tension: 0.1, fill: false }
                        ]
                    },
                    options: { /* ... (chart options from M3) ... */ }
                });
            }
        } catch (e) {
            ctx.parentElement.innerHTML = `<p class="text-red-400">Error loading chart: ${e.message}</p>`;
        }
    }
    
    // --- INIT FRIEND BUTTON ---
    const container = document.getElementById('profile-action-btn-container');
    if (!container) return; 

    const currentUserId = App.state.user?.id;
    const isOwnProfile = targetUserId === currentUserId;

    if (isOwnProfile) return;
    if (!currentUserId) {
         container.innerHTML = `<button class="btn btn-primary" data-modal-trigger="login">Log in to add friend</button>`;
         return;
    }

    const button = container.querySelector('button');
    setButtonLoading(button, true);
    const friendship = await API.getFriendship(targetUserId);
    updateFriendButton(button, friendship);

    button.addEventListener('click', async () => {
        // ... (friend button logic is unchanged) ...
    });
}


// --- Private Helper Functions ---

function renderActionButton(isOwnProfile) {
    if (isOwnProfile) {
        return '<a href="#settings" class="btn btn-outline w-full sm:w-auto">Edit Profile</a>';
    }
    return '<button id="friend-action-btn" class="btn btn-primary w-full sm:w-auto">Loading...</button>';
}

function updateFriendButton(button, friendship) {
    // ... (friend button logic is unchanged) ...
}

function renderFriendList(friends) {
    if (friends.length === 0) {
        return '<p class="text-gray-500 dark:text-gray-400">No friends to show.</p>';
    }

    return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            ${friends.map(friend => `
                <a href="#profile/${friend.id}" class="text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div class="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold text-white mx-auto">
                        ${friend.username.charAt(0).toUpperCase()}
                    </div>
                    <p class="font-medium mt-2 truncate">${friend.username}</p>
                    <span classT="text-xs text-gray-500">Level ${Math.floor((friend.total_xp || 0) / XP_PER_LEVEL) + 1}</span>
                </a>
            `).join('')}
        </div>
    `;
}

function renderBadgeList(badges) {
    if (badges.length === 0) {
        return '<p class="text-gray-500 dark:text-gray-400">No badges earned yet.</p>';
    }

    // This is the badge style from our previous milestone
    return `
        <div class="flex flex-wrap gap-4 mt-4">
            ${badges.map(badge => `
                <div class="badge-container" title="${badge.description}">
                    <div class="badge-icon ${badge.color_class.replace('text-', 'bg-').replace('400', '500')}/20">
                        <i data-feather="${badge.icon_name}" class="${badge.color_class}"></i>
                    </div>
                    <span class="badge-name">${badge.name}</span>
                </div>
            `).join('')}
        </div>
    `;
}