// services/api.js
import { supabase } from './supabase.js';

/**
 * Saves a completed quiz result to the database
 */
export async function saveQuizResult(userId, scores, ideology) {
     try {
        const { error: resultError } = await supabase
            .from('quiz_results')
            .insert({ 
                user_id: userId, 
                scores: scores,
                ideology: ideology,
                xp_gained: 100 // TODO: Tie to gamification system
            });
        if (resultError) throw resultError;
        
        // Also update the 'latest_ideology' on the user's profile
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ latest_ideology: ideology })
            .eq('id', userId);
        if (profileError) throw profileError;
        
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
        .select('username, created_at, latest_ideology, level, xp')
        .eq('id', userId)
        .single();
    
    if (profileError) throw profileError;
    return profileData;
}

/**
 * Fetches all quiz results for a user (for the journey chart)
 */
export async function getQuizHistory(userId) {
    const { data: resultsData, error: resultsError } = await supabase
        .from('quiz_results')
        .select('created_at, scores')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });
    
    if (resultsError) throw resultsError;
    return resultsData;
}