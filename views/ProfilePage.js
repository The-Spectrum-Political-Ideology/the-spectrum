// views/ProfilePage.js
import { App } from '../app/app.js';
import * as API from '../services/api.js';
import { ErrorPage } from './ErrorPages.js';
import { setButtonLoading } from '../ui/utils.js';
import { showToast } from '../ui/toast.js';

// Define our leveling constants
const XP_PER_LEVEL = 1000;

// 1. Render function (exports the HTML)
export async function ProfilePage(userIdParam) {
    // If no userId is passed, default to the logged-in user's ID
    const targetUserId = userIdParam || App.state.user?.id;
    
    if (!targetUserId) {
         // Not logged in and no ID specified
         return ErrorPage("User not found. You may need to log in.");
    }

    const currentUserId = App.state.user?.id;
    const isOwnProfile = targetUserId === currentUserId;

    let profile, results, friends;
    try {
        profile = await API.getProfile(targetUserId);
        results = await API.getQuizHistory(targetUserId);
        friends = await API.getFriends(targetUserId);
    } catch (e) {
        console.error("Error fetching profile:", e);
        return ErrorPage(`Could not load profile: ${e.message}`);
    }

    // --- NEW: Calculate Level & XP Bar ---
    const totalXp = profile.total_xp || 0;
    const currentLevel = Math.floor(totalXp / XP_PER_LEVEL) + 1;
    const xpInCurrentLevel = totalXp % XP_PER_LEVEL;
    const xpBarPercentage = (xpInCurrentLevel / XP_PER_LEVEL) * 100;

    // Render Ideological Journey Chart
    setTimeout(() => {
        const ctx = document.getElementById('journey-chart');
        if (!ctx) return;
        
        if (!results || results.length < 2) {
            ctx.parentElement.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center">Complete at least two quizzes to see your journey.</p>';
            return;
        }
        
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
            options: {
                 responsive: true,
                 maintainAspectRatio: false,
                 scales: { 
                     y: { min: 0, max: 100, ticks: { color: 'rgb(156, 163, 175)' } },
                     x: { ticks: { color: 'rgb(156, 163, 175)' } }
                 },
                 plugins: {
                     legend: { labels: { color: 'rgb(209, 213, 219)' } }
                 }
            }
        });
    }, 100);

    return `
        <div class="animate-fade-in-up">
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto">
                <div class="h-48 bg-indigo-500"></div>
                <div class="p-6">
                    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-24">
                        <div class="flex items-end">
                            <div class="w-32 h-32 rounded-full bg-gray-600 border-4 border-white dark:border-gray-800 flex items-center justify-center text-5xl font-bold text-white flex-shrink-0">
                                ${profile.username.charAt(0).toUpperCase()}
                            </div>
                            <div class="ml-4">
                                <h1 class="text-3xl font-bold mt-4">${profile.username}</h1>
                                <p class="text-lg text-indigo-500 dark:text-indigo-300 font-medium">${profile.latest_ideology || 'No quiz taken'}</p>
                            </div>
                        </div>
                        <div id="profile-action-btn-container" class="mt-4 sm:mt-0" data-target-user-id="${profile.id}">
                            ${renderActionButton(isOwnProfile)}
                        </div>
                    </div>
                    
                    <div class="mt-6">
                        <h3 class="font-bold">Level ${currentLevel}</h3>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div class="bg-green-500 h-4" style="width: ${xpBarPercentage}%"></div>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${xpInCurrentLevel} / ${XP_PER_LEVEL} XP to next level</G/p>
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
// v--- THIS IS THE FUNCTION YOUR FILE IS MISSING ---v
export async function initProfilePage(userIdParam) {
    const container = document.getElementById('profile-action-btn-container');
    if (!container) return; // Not a profile page, or not one with actions

    const targetUserId = container.dataset.targetUserId;
    const currentUserId = App.state.user?.id;
    const isOwnProfile = targetUserId === currentUserId;

    if (isOwnProfile) return; // "Edit Profile" is just a link, no listener needed
    if (!currentUserId) {
         container.innerHTML = `<button class="btn btn-primary" data-modal-trigger="login">Log in to add friend</button>`;
         return;
    }

    // Load dynamic friend button state
    const button = container.querySelector('button');
    setButtonLoading(button, true);
    const friendship = await API.getFriendship(targetUserId);
    updateFriendButton(button, friendship);

    // Add click listener
    button.addEventListener('click', async () => {
        setButtonLoading(button, true);
        try {
            const currentState = button.dataset.state;
            let newFriendship = null;
            if (currentState === 'add') {
                await API.addFriend(targetUserId);
                newFriendship = { status: 'pending', user_id_a: currentUserId };
                showToast('Friend request sent!', 'success');
            } else if (currentState === 'cancel' || currentState === 'remove') {
                await API.removeFriend(targetUserId);
                newFriendship = null;
                showToast('Friend removed.', 'info');
            } else if (currentState === 'accept') {
                await API.acceptFriend(targetUserId);
                newFriendship = { status: 'friends' };
                showToast('Friend request accepted!', 'success');
            }
            updateFriendButton(button, newFriendship);
        } catch (error) {
            showToast(`Error: ${error.message}`, 'error');
            setButtonLoading(button, false);
        }
    });
}


// --- Private Helper Functions ---

function renderActionButton(isOwnProfile) {
    if (isOwnProfile) {
        return '<a href="#settings" class="btn btn-outline">Edit Profile</a>';
    }
    // Default state, will be updated by initProfilePage
    return '<button id="friend-action-btn" class="btn btn-primary">Loading...</button>';
}

function updateFriendButton(button, friendship) {
    const currentUserId = App.state.user.id;
    
    if (!friendship) {
        // No relationship
        button.innerHTML = `<i data-feather="user-plus" class="mr-2 w-4 h-4"></i> Add Friend`;
        button.className = 'btn btn-primary';
        button.dataset.state = 'add';
    } else if (friendship.status === 'pending') {
        if (friendship.user_id_a === currentUserId) {
            // We sent the request
            button.innerHTML = `Request Sent`;
            button.className = 'btn btn-outline';
            button.dataset.state = 'cancel';
        } else {
            // We received the request
            button.innerHTML = `<i data-feather="check" class="mr-2 w-4 h-4"></i> Accept Request`;
            button.className = 'btn btn-primary bg-green-500 hover:bg-green-600';
            button.dataset.state = 'accept';
            // TODO: Add a "Decline" button
        }
    } else if (friendship.status === 'friends') {
        button.innerHTML = `<i data-feather="user-minus" class="mr-2 w-4 h-4"></i> Remove Friend`;
        button.className = 'btn btn-danger';
        button.dataset.state = 'remove';
    }
    
    setButtonLoading(button, false);
    if(window.feather) feather.replace();
}

function renderFriendList(friends) {
    if (friends.length === 0) {
        return '<p class="text-gray-500 dark:text-gray-400">No friends to show.</p>';
    }

    return `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            ${friends.map(friend => `
                <a href="#profile/${friend.id}" class="text-center">
                    <div class="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-2xl font-bold text-white mx-auto">
                        ${friend.username.charAt(0).toUpperCase()}
                    </div>
                    <p class="font-medium mt-2 truncate">${friend.username}</p>
                    <span class="text-xs text-gray-500">Level ${friend.level || 1}</span>
                </a>
            `).join('')}
        </div>
    `;
}