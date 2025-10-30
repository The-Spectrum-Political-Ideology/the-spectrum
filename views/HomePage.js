// views/HomePage.js

export function HomePage() {
    return `
        <div class="text-center animate-fade-in-up">
            <h1 class="text-5xl md:text-6xl font-bold font-display text-indigo-500 dark:text-indigo-300">
                Find Your Place on the Spectrum.
            </h1>
            <p class="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
                A comprehensive political quiz to help you discover your ideology,
                track your views, and see where others stand.
            </p>
            <div class="mt-10">
                <a href="#quiz" class="btn btn-lg btn-primary">
                    Take the Quiz Now
                    <i data-feather="arrow-right" class="ml-2 w-5 h-5"></i>
                </a>
            </div>
            
            <div class="mt-20">
                <h2 class="text-2xl font-bold">Recent Activity</h2>
                <div class="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mt-4 max-w-md mx-auto text-left">
                    <p class="text-gray-500 dark:text-gray-400">Activity feed coming in Milestone 3...</p>
                    </div>
            </div>
        </div>
    `;
}