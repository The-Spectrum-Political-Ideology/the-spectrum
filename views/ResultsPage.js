// views/ResultsPage.js
import { App } from '../app/app.js';
import { ErrorPage } from './ErrorPages.js';

export function ResultsPage() {
    if (!App.state.quizResults) {
        // This is a failsafe, router should already catch this
        return ErrorPage('No results to display.');
    }
    
    return `
        <div class="animate-fade-in-up">
            <h1 class="text-center">Your Results</h1>
            <div class="bg-gray-800 dark:bg-gray-900 text-white p-6 sm:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
                <h2 class="text-3xl font-bold font-display text-center">
                    Closest Match: 
                    <span id="ideology-name" class="text-indigo-300">...</span>
                </h2>
                <p id="ideology-desc" class="text-center text-lg text-gray-300 mt-2">...</p>
                
                <div class="w-full max-w-lg mx-auto h-64 md:h-96 my-8 relative">
                    <canvas id="results-chart"></canvas>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <div class="flex justify-between font-bold mb-1">
                            <span>Equality</span>
                            <span>Markets</span>
                        </div>
                        <div class="results-axis-bar">
                            <div id="econ-bar" class="results-axis-fill bg-indigo-400"></div>
                        </div>
                        <div class="flex justify-between text-sm mt-1">
                            <span id="econ-label" class="font-medium">...</span>
                            <span id="econ-val" class="font-bold">...</span>
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between font-bold mb-1">
                            <span>World</span>
                            <span>Nation</span>
                        </div>
                        <div class="results-axis-bar">
                            <div id="dipl-bar" class="results-axis-fill bg-green-400"></div>
                        </div>
                        <div class="flex justify-between text-sm mt-1">
                            <span id="dipl-label" class="font-medium">...</span>
                            <span id="dipl-val" class="font-bold">...</span>
                        </div>
                    </div>
                    
                    <div>
                        <div class="flex justify-between font-bold mb-1">
                            <span>Liberty</span>
                            <span>Authority</span>
                        </div>
                        <div class="results-axis-bar">
                            <div id="govt-bar" class="results-axis-fill bg-red-400"></div>
                        </div>
                        <div class="flex justify-between text-sm mt-1">
                            <span id="govt-label" class="font-medium">...</span>
                            <span id="govt-val" class="font-bold">...</span>
                        </div>
                    </div>
                    
                    <div>
                        <div classR="flex justify-between font-bold mb-1">
                            <span>Progress</span>
                            <span>Tradition</span>
                        </div>
                        <div class="results-axis-bar">
                            <div id="scty-bar" class="results-axis-fill bg-yellow-400"></div>
                        </div>
                        <div class="flex justify-between text-sm mt-1">
                            <span id="scty-label" class="font-medium">...</span>
                            <span id="scty-val" class="font-bold">...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}