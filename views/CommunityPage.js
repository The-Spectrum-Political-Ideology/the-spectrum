// views/CommunityPage.js

export function CommunityPage() {
    return `
        <div class="animate-fade-in-up max-w-3xl mx-auto">
            <h1>Community</h1>
            <p class="text-lg text-gray-600 dark:text-gray-400">
                Browse other users, see their ideologies, and (soon) add them as friends.
            </p>
            <div class="mt-6">
                <input type="search" id="user-search-input" class="form-input" placeholder="Search for users...">
            </div>
            
            <div id="user-list-container" class="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 class="font-bold text-xl">User List</h2>
                <p class="text-gray-500 mt-4">Full user list coming in Milestone 2...</p>
                </div>
        </div>
    `;
}