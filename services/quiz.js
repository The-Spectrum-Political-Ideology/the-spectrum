// services/quiz.js
import { App } from '../app/app.js';
import * as API from './api.js';
import { showToast } from '../ui/toast.js';

let currentQuestion = 0;
let questions = [];

// Quiz questions data
function getQuestions() {
    // NOTE: This is a small subset. Add all ~60 questions here.
    return [
        {
            question: "Oppression by corporations is a bigger concern than oppression by governments.",
            effects: {
                strg_agree: { econ: -10, dipl: 0, govt: 0, scty: 0 },
                agree:      { econ: -5, dipl: 0, govt: 0, scty: 0 },
                neutral:    { econ: 0, dipl: 0, govt: 0, scty: 0 },
                disagree:   { econ: 5, dipl: 0, govt: 0, scty: 0 },
                strg_disagree:{ econ: 10, dipl: 0, govt: 0, scty: 0 },
            }
        },
        {
            question: "It is necessary for the government to intervene in the economy to protect consumers.",
            effects: {
                strg_agree: { econ: -10, dipl: 0, govt: 0, scty: 0 },
                agree:      { econ: -5, dipl: 0, govt: 0, scty: 0 },
                neutral:    { econ: 0, dipl: 0, govt: 0, scty: 0 },
                disagree:   { econ: 5, dipl: 0, govt: 0, scty: 0 },
                strg_disagree:{ econ: 10, dipl: 0, govt: 0, scty: 0 },
            }
        },
        {
            question: "My nation's values should be spread as widely as possible.",
            effects: {
                strg_agree: { econ: 0, dipl: 10, govt: 0, scty: 0 },
                agree:      { econ: 0, dipl: 5, govt: 0, scty: 0 },
                neutral:    { econ: 0, dipl: 0, govt: 0, scty: 0 },
                disagree:   { econ: 0, dipl: -5, govt: 0, scty: 0 },
                strg_disagree:{ econ: 0, dipl: -10, govt: 0, scty: 0 },
            }
        },
        {
            question: "The sacrifice of some civil liberties is necessary to protect us from acts of terrorism.",
            effects: {
                strg_agree: { econ: 0, dipl: 0, govt: 10, scty: 0 },
                agree:      { econ: 0, dipl: 0, govt: 5, scty: 0 },
                neutral:    { econ: 0, dipl: 0, govt: 0, scty: 0 },
                disagree:   { econ: 0, dipl: 0, govt: -5, scty: 0 },
                strg_disagree:{ econ: 0, dipl: 0, govt: -10, scty: 0 },
            }
        },
        {
            question: "Traditions are important and should be upheld.",
            effects: {
                strg_agree: { econ: 0, dipl: 0, govt: 0, scty: 10 },
                agree:      { econ: 0, dipl: 0, govt: 0, scty: 5 },
                neutral:    { econ: 0, dipl: 0, govt: 0, scty: 0 },
                disagree:   { econ: 0, dipl: 0, govt: 0, scty: -5 },
                strg_disagree:{ econ: 0, dipl: 0, govt: 0, scty: -10 },
            }
        }
        // ... (all 60+ questions go here)
    ].map(q => ({...q, answer: null }));
}

// Ideology data
function getIdeologies() {
    // Econ: 0=Equality, 100=Markets
    // Dipl: 0=World, 100=Nation
    // Govt: 0=Liberty, 100=Authority
    // Scty: 0=Progress, 100=Tradition
    return [
        { name: 'Socialism', desc: "Advocates for social ownership and democratic control of the means of production.", scores: { econ: 10, dipl: 30, govt: 30, scty: 20 } },
        { name: 'Liberalism', desc: "Believes in individual rights, democracy, and free-market capitalism.", scores: { econ: 60, dipl: 40, govt: 40, scty: 30 } },
        { name: 'Conservatism', desc: "Emphasizes tradition, limited government, and a strong national defense.", scores: { econ: 70, dipl: 70, govt: 60, scty: 80 } },
        { name: 'Libertarianism', desc: "Prioritizes individual liberty and minimizing the role of the state in all affairs.", scores: { econ: 90, dipl: 50, govt: 10, scty: 50 } },
        { name: 'Authoritarianism', desc: "Characterized by a strong central power and limited political freedoms.", scores: { econ: 50, dipl: 80, govt: 90, scty: 70 } },
        { name: 'Centrism', desc: "Holds a balanced perspective, incorporating elements from across the political spectrum.", scores: { econ: 50, dipl: 50, govt: 50, scty: 50 } },
    ];
}

export function start() {
    currentQuestion = 0;
    questions = getQuestions();
    renderQuestion();
}

function renderQuestion() {
    const q = questions[currentQuestion];
    const container = document.getElementById('quiz-container');
    if (!container) return;
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    container.innerHTML = `
        <div class="quiz-question-card animate-fade-in-up">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
                <div class="bg-indigo-500 h-2.5 rounded-full" style="width: ${progress}%"></div>
            </div>
            <h2 class="text-xl md:text-2xl font-bold mb-6 text-center">
                Question ${currentQuestion + 1} of ${questions.length}
            </h2>
            <p class="text-lg md:text-xl text-center min-h-[6rem]">${q.question}</p>
            <div class="quiz-option-group">
                <button class="quiz-option-btn" data-effect='${JSON.stringify(q.effects.strg_agree)}'>Strongly Agree</button>
                <button class="quiz-option-btn" data-effect='${JSON.stringify(q.effects.agree)}'>Agree</button>
                <button class="quiz-option-btn" data-effect='${JSON.stringify(q.effects.neutral)}'>Neutral</button>
                <button class="quiz-option-btn" data-effect='${JSON.stringify(q.effects.disagree)}'>Disagree</button>
                <button class="quiz-option-btn" data-effect='${JSON.stringify(q.effects.strg_disagree)}'>Strongly Disagree</button>
            </div>
            <div class="flex justify-between mt-8">
                <button id="quiz-prev" class="btn btn-outline" ${currentQuestion === 0 ? 'disabled' : ''}>Previous</button>
                <button id="quiz-next" class="btn btn-primary" disabled>Next</button>
            </div>
        </div>
    `;

    // Add listeners for the new buttons
    document.getElementById('quiz-prev').addEventListener('click', prevQuestion);
    document.getElementById('quiz-next').addEventListener('click', nextQuestion);
    
    container.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            questions[currentQuestion].answer = JSON.parse(e.currentTarget.dataset.effect);
            container.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('selected'));
            e.currentTarget.classList.add('selected');
            document.getElementById('quiz-next').disabled = false;
        });
    });
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    } else {
        finishQuiz();
    }
}

function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
}

async function finishQuiz() {
    // Calculate final scores
    let finalScores = { econ: 50, dipl: 50, govt: 50, scty: 50 };
    let maxScores = { econ: 0, dipl: 0, govt: 0, scty: 0 };
    const baseQuestions = getQuestions(); // Get max values from source
    
    for (const q of baseQuestions) {
        maxScores.econ += Math.abs(q.effects.strg_agree.econ);
        maxScores.dipl += Math.abs(q.effects.strg_agree.dipl);
        maxScores.govt += Math.abs(q.effects.strg_agree.govt);
        maxScores.scty += Math.abs(q.effects.strg_agree.scty);
    }

    for (const q of questions) {
        if (q.answer) {
            finalScores.econ += q.answer.econ;
            finalScores.dipl += q.answer.dipl;
            finalScores.govt += q.answer.govt;
            finalScores.scty += q.answer.scty;
        }
    }

    // Normalize to 0-100 scale & clamp
    const results = {
        econ: Math.max(0, Math.min(100, (finalScores.econ / maxScores.econ) * 100)),
        dipl: Math.max(0, Math.min(100, (finalScores.dipl / maxScores.dipl) * 100)),
        govt: Math.max(0, Math.min(100, (finalScores.govt / maxScores.govt) * 100)),
        scty: Math.max(0, Math.min(100, (finalScores.scty / maxScores.scty) * 100)),
    };
    
    // Match ideology
    const ideology = matchIdeology(results);
    
    // Set global app state
    App.state.quizResults = results;
    App.state.ideology = ideology;

    // Save to API
    const { success, error } = await API.saveQuizResult(App.state.user.id, results, ideology.name);
    if(success) {
        showToast('Quiz results saved!', 'success');
    } else {
        showToast(`Error saving results: ${error}`, 'error');
    }

    // Redirect to results page
    window.location.hash = 'results';
}

function matchIdeology(scores) {
    const ideologies = getIdeologies();
    let closestMatch = null;
    let minDistance = Infinity;
    for (const ideology of ideologies) {
        let distance = 0;
        distance += Math.pow(scores.econ - ideology.scores.econ, 2);
        distance += Math.pow(scores.dipl - ideology.scores.dipl, 2);
        distance += Math.pow(scores.govt - ideology.scores.govt, 2);
        distance += Math.pow(scores.scty - ideology.scores.scty, 2);
        distance = Math.sqrt(distance);
        if (distance < minDistance) {
            minDistance = distance;
            closestMatch = ideology;
        }
    }
    return closestMatch;
}

export function renderResults() {
    const { econ, dipl, govt, scty } = App.state.quizResults;
    const ideology = App.state.ideology;

    // Set up axis labels
    const econLabel = econ > 60 ? "Markets" : (econ < 40 ? "Equality" : "Balanced");
    const diplLabel = dipl > 60 ? "Nation" : (dipl < 40 ? "World" : "Balanced");
    const govtLabel = govt > 60 ? "Authority" : (govt < 40 ? "Liberty" : "Balanced");
    const sctyLabel = scty > 60 ? "Tradition" : (scty < 40 ? "Progress" : "Balanced");

    // Render Progress Bars
    document.getElementById('econ-bar').style.width = `${econ}%`;
    document.getElementById('dipl-bar').style.width = `${dipl}%`;
    document.getElementById('govt-bar').style.width = `${govt}%`;
    document.getElementById('scty-bar').style.width = `${scty}%`;

    document.getElementById('econ-label').textContent = econLabel;
    document.getElementById('dipl-label').textContent = diplLabel;
    document.getElementById('govt-label').textContent = govtLabel;
    document.getElementById('scty-label').textContent = sctyLabel;

    document.getElementById('econ-val').textContent = `${econ.toFixed(1)}%`;
    document.getElementById('dipl-val').textContent = `${dipl.toFixed(1)}%`;
    document.getElementById('govt-val').textContent = `${govt.toFixed(1)}%`;
    document.getElementById('scty-val').textContent = `${scty.toFixed(1)}%`;

    // Render Ideology
    document.getElementById('ideology-name').textContent = ideology.name;
    document.getElementById('ideology-desc').textContent = ideology.desc;

    // Render Radar Chart
    setTimeout(() => {
        const ctx = document.getElementById('results-chart');
        if(!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'radar',
            data: {
                labels: ['Economic (Equality-Markets)', 'Diplomatic (World-Nation)', 'Civil (Liberty-Authority)', 'Societal (Progress-Tradition)'],
                datasets: [{
                    label: 'Your Results',
                    data: [econ, dipl, govt, scty],
                    fill: true,
                    backgroundColor: 'rgba(129, 140, 248, 0.2)',
                    borderColor: 'rgb(129, 140, 248)',
                    pointBackgroundColor: 'rgb(129, 140, 248)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(129, 140, 248)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                        grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        pointLabels: { 
                            color: '#f9fafb',
                            font: { size: 12 }
                        },
                        ticks: {
                            backdropColor: 'transparent',
                            color: '#f9fafb',
                            stepSize: 20
                        },
                        min: 0,
                        max: 100
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: '#f9fafb' }
                    }
                }
            }
        });
    }, 100);
}