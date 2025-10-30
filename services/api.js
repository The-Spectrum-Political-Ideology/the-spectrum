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
}// services/api.js
import { supabase } from './supabase.js';
import { App } from '../app/app.js';

/**
 * Saves a completed quiz result to the database
 */
export async function saveQuizResult(userId, scores, ideology) {
     try {
        // ... (Step 1 & 2: Insert result, update profile... unchanged) ...
        const { error: resultError } = await supabase
            .from('quiz_results')
            .insert({ /* ... */ });
        if (resultError) throw resultError;
        
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ latest_ideology: ideology })
            .eq('id', userId);
        if (profileError) throw profileError;

        // ... (Step 3: Call add_xp RPC... unchanged) ...
        const { error: rpcError } = await supabase
            .rpc('add_xp', { xp_to_add: 100 });
        if (rpcError) throw rpcError;

        // --- NEW: Step 4: Grant the Ideology Badge ---
        const { error: badgeError } = await supabase
            .rpc('grant_badge', { badge_name_in: ideology });
        if (badgeError) {
            // Don't fail the whole request, just log it
            console.warn(`Could not grant badge: ${badgeError.message}`);
        }
        
        return { success: true };
    } catch (error) {
        console.error("Error saving quiz results:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Fetches profile data for a user
 */
export async function getProfile(userId) {
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        // ADD 'current_streak' TO THIS LIST
        .select('id, username, created_at, latest_ideology, total_xp, current_streak')
        .eq('id', userId)
        .single();
    
    if (profileError) throw profileError;
    return profileData;
}
/**
 * Fetches all quiz results for a user (for the journey chart)
 */
export async function getQuizHistory(userId) {
    // ... (unchanged)
}

// --- NEW M4 FUNCTION ---

/**
 * Gets all badges for a specific user
 */
export async function getBadgesForUser(userId) {
    const { data, error } = await supabase
        .from('user_badges')
        .select(`
            badges (
                name,
                description,
                icon_name,
                color_class
            )
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

    if (error) throw error;
    // The data is [{ badges: {...} }, { badges: {...} }]
    // We just want the inner badge objects
    return data.map(item => item.badges);
}


// ... (All other API functions for friends/daily quiz are unchanged) ...