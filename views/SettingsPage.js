// views/SettingsPage.js

export function SettingsPage() {
    const adsEnabled = localStorage.getItem('adsEnabled') === 'true';
    
    return `
        <div class="animate-fade-in-up max-w-xl mx-auto">
            <h1>Settings</h1>
            
            <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 class="text-xl font-bold">Preferences</h2>
                
                <div classs="flex items-center justify-between mt-4">
                    <label for="ads-toggle" class="font-medium">Show Advertisements</label>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        Help support the platform by enabling non-intrusive ads.
                    </p>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" id="ads-toggle" class="sr-only peer" ${adsEnabled ? 'checked' : ''}>
                      <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                </div>

                <hr class="my-6 border-gray-200 dark:border-gray-700">
                
                <h2 class="text-xl font-bold">Account</h2>
                <div class="mt-4">
                    <button class="btn btn-outline" data-modal-trigger="forgotPassword">Reset Password</button>
                </div>

                <hr class="my-6 border-gray-200 dark:border-gray-700">

                <h2 class="text-xl font-bold">Profile Customization (Coming Soon)</h2>
                <div class="mt-4 space-y-4 opacity-50 cursor-not-allowed">
                    <div>
                        <label class="form-label">Profile Title (Unlocks at Level 2)</label>
                        <input type="text" class="form-input" placeholder="Your awesome title" disabled>
                    </div>
                    <div>
                        <label class="form-label">Banner Color (Unlocks at Level 10)</label>
                        <input type="color" class="w-full h-10 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md" value="#6366f1" disabled>
                    </div>
                    <div>
                        <label class="form-label">GIF Avatar (Unlocks at Level 20)</label>
                        <input type="text" class="form-input" placeholder="https://media.giphy.com/..." disabled>
                    </div>
                </div>
            </div>
        </div>
    `;
}