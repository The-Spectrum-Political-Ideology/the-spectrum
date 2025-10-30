// views/DailyQuizPage.js
import * as API from '../services/api.js';
import { showToast } from '../ui/toast.js';

let dailyQuestion = null;

// 1. Render function (exports the HTML)
export function DailyQuizPage() {
    return `
        <div class="animate-fade-in-up max-w-2xl mx-auto">
            <h1 class="text-center">Daily Quiz</h1>
            <div id="daily-quiz-container">
                </div>
        </div>
    `;
}

// 2. Init function (called by the router)
export async function initDailyQuizPage() {
    const container = document.getElementById('daily-quiz-container');
    container.innerHTML = `<div class="page-loader"><div class="spinner-lg"></div></div>`;

    try {
        dailyQuestion = await API.getTodaysQuestion();
        container.innerHTML = renderQuestion(dailyQuestion);
        attachListeners();
    } catch (error) {
        if (error.message.includes('User has already answered')) {
            container.innerHTML = renderAnswered();
        } else {
            container.innerHTML = renderError(error.message);
        }
    }
}

// 3. Event Listeners
function attachListeners() {
    document.getElementById('daily-agree').addEventListener('click', () => submitAnswer(1.0));
    document.getElementById('daily-disagree').addEventListener('click', () => submitAnswer(-1.0));
}

async function submitAnswer(answerEffect) {
    const container = document.getElementById('daily-quiz-container');
    container.innerHTML = `<div class="page-loader"><div class="spinner-lg"></div></div>`;

    try {
        const newStreak = await API.submitDailyAnswer(dailyQuestion.id, answerEffect);
        container.innerHTML = renderAnswered(newStreak);
        showToast('Answer saved! You gained XP.', 'success');
    } catch (error) {
        container.innerHTML = renderError(error.message);
        showToast(error.message, 'error');
    }
}


// 4. Component Templates
function renderQuestion(question) {
    return `
        <div class="quiz-question-card text-center">
            <p class="text-sm font-medium text-indigo-400">Today's Question</p>
            <p class="text-lg md:text-xl font-medium mt-4 min-h-[4rem]">
                "${question.question}"
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                (This question affects your <strong class="capitalize">${question.effect_axis}</strong> score)
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <button id="daily-agree" class="btn btn-lg btn-primary">Agree</button>
                <button id="daily-disagree" class="btn btn-lg btn-danger">Disagree</button>
            </div>
        </div>
    `;
}

function renderAnswered(newStreak) {
    return `
        <div class="quiz-question-card text-center">
            <i data-feather="check-circle" class="w-16 h-16 text-green-500 mx-auto"></i>
            <h2 class="text-2xl font-bold mt-4">Answer Submitted!</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">
                Thanks for participating. Come back tomorrow for the next question.
            </p>
            ${newStreak ? `
                <div class="mt-4 inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 rounded-full px-4 py-1">
                    <i data-feather="zap" class="w-5 h-5 text-yellow-600"></i>
                    <span class="font-medium text-yellow-800 dark:text-yellow-200">New Streak: ${newStreak} Day${newStreak > 1 ? 's' : ''}!</span>
                </div>
            ` : ''}
        </div>
    `;
}

function renderError(message) {
     return `
        <div class="quiz-question-card text-center">
            <i data-feather="alert-triangle" class="w-16 h-16 text-red-500 mx-auto"></i>
            <h2 class="text-2xl font-bold mt-4">An Error Occurred</h2>
            <p class="text-lg text-gray-600 dark:text-gray-300">
                ${message}
            </p>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-4">
                This could be because no question was set for today, or you've already answered.
            </p>
        </div>
    `;
}