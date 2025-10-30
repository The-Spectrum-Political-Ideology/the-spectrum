// services/api.js
import { supabase } from './supabase.js';
import { App } from '../app/app.js';

// ... (saveQuizResult, getProfile, getQuizHistory are unchanged) ...
// ... (searchUsers, getFriendship, addFriend, acceptFriend, removeFriend, getFriends are unchanged) ...

// --- NEW M3.1 FUNCTIONS ---

/**
 * Fetches today's daily question.
 */
export async function getTodaysQuestion() {
    const { data, error } = await supabase
        .from('daily_quiz_questions')
        .select('id, question, effect_axis')
        .eq('question_date', new Date().toISOString().split('T')[0]) // YYYY-MM-DD
        .single();
    
    if (error) {
        if (error.code === 'PGRST116') { // No rows
            throw new Error('No question has been set for today.');
        }
        throw error;
    }
    return data;
}

/**
 * Submits an answer for the daily quiz and returns the new streak.
 */
export async function submitDailyAnswer(questionId, answerEffect) {
    const { data, error } = await supabase
        .rpc('submit_daily_answer', {
            question_id_arg: questionId,
            answer_effect_arg: answerEffect
        });

    if (error) throw error;
    return data; // This will be the new streak number
}