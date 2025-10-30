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

    let profile, results, friends, badges; // ADDED BADGES
    try {
        profile = await API.getProfile(targetUserId);
        results = await API.getQuizHistory(targetUserId);
        friends = await API.getFriends(targetUserId);
        badges = await API.getBadgesForUser(targetUserId); // NEW FETCH
    } catch (e) {
        console.error("Error fetching profile:", e);
        return ErrorPage(`Could not load profile: ${e.message}`);
    }

    // --- Calculate Level & XP Bar ---
    const totalXp = profile.total_xp || 0;
    const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
    const xpBarPercentage = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

    // ... (setTimeout for Journey Chart remains unchanged) ...
    
    return `
        <div class="animate-fade-in-up">
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto">
                <div class="h-48 bg-indigo-500"></div>
                <div class="p-6">
                    <div class="mt-10">
                        <h2 class="text-2xl font-bold">Achievements (${badges.length})</h2>
                        ${renderBadgeList(badges)}
                    </div>
                    
                    <div class="mt-10">
                        <h2 class="text-2xl font-bold">Ideological Journey</h2>
                        <div class="mt-4 h-80 relative">
                            <canvas id="journey-chart"></canvas>
                        </div>
                    </div>
                    
                    <div class="mt-10">
                        <h2 class="text-2xl font-bold">Friends (${friends.length})</h2>
                        ${renderFriendList(friends)}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 2. Init function (called by the router)
export async function initProfilePage(userIdParam) {
    // ... (This function is unchanged from M2) ...
}


// --- Private Helper Functions ---

// ... (renderActionButton, updateFriendButton, renderFriendList are UNCHANGED) ...

// --- NEW M4 HELPER ---
function renderBadgeList(badges) {
    if (badges.length === 0) {
        return '<p class="text-gray-500 dark:text-gray-400">No badges earned yet.</p>';
    }

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