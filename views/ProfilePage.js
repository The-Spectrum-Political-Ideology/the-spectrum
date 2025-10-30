// views/ProfilePage.js
import { App } from '../app/app.js';
import * as API from '../services/api.js';
import { ErrorPage } from './ErrorPages.js';

export async function ProfilePage(userId) {
    // If no userId is passed, default to the logged-in user's ID
    const targetUserId = userId || App.state.user?.id;
    
    if (!targetUserId) {
         return ErrorPage("User not found.");
    }

    const isOwnProfile = targetUserId === App.state.user?.id;

    let profile, results;
    try {
        profile = await API.getProfile(targetUserId);
        results = await API.getQuizHistory(targetUserId);
    } catch (e) {
        console.error("Error fetching profile:", e);
        return ErrorPage(`Could not load profile: ${e.message}`);
    }

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
                     y: { min: 0, max: 100 },
                     x: { ticks: { color: 'rgb(156, 163, 175)' } } // gray-400
                 },
                 plugins: {
                     legend: { labels: { color: 'rgb(209, 213, 219)' } } // gray-300
                 }
            }
        });
    }, 100);

    return `
        <div class="animate-fade-in-up">
            <div class="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden max-w-4xl mx-auto">
                <div class="h-48 bg-indigo-500">
                    </div>
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
                        <div id="profile-action-btn" class="mt-4 sm:mt-0">
                            ${isOwnProfile ? '<a href="#settings" class="btn btn-outline">Edit Profile</a>' : '<button class="btn btn-primary">Add Friend</button>'}
                        </div>
                    </div>
                    
                    <div class="mt-6">
                        <h3 class="font-bold">Level ${profile.level || 1}</h3>
                        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div class="bg-green-500 h-4" style="width: ${profile.xp || 0}%"></div>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">${profile.xp || 0} / 100 XP to next level</p>
                    </div>
                    
                    <div class="mt-10">
                        <h2 class="text-2xl font-bold">Ideological Journey</h2>
                        <div class="mt-4 h-80 relative">
                            <canvas id="journey-chart"></canvas>
                        </div>
                    </div>
                    
                    <div class="mt-10">
                        <h2 class="text-2xl font-bold">Friends</h2>
                        <p class="text-gray-500 dark:text-gray-400">Friends list coming in Milestone 2...</p>
                        </div>
                </div>
            </div>
        </div>
    `;
}