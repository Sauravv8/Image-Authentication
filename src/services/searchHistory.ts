import { supabase, SearchHistory, TopSearch } from '../lib/supabase';

let isTableVerified = false;

// Function to verify if the search_history table exists
async function verifySearchHistoryTable(): Promise<boolean> {
  if (isTableVerified) return true;

  try {
    const { error } = await supabase
      .from('search_history')
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // table does not exist
        console.error('Search history table does not exist. Please run the initialization SQL.');
        return false;
      }
      if (error.code === '42501') { // permission denied
        console.error('Permission denied. Please check RLS policies.');
        return false;
      }
      console.error('Error verifying search_history table:', error);
      return false;
    }
    
    isTableVerified = true;
    return true;
  } catch (err) {
    console.error('Failed to verify search_history table:', err);
    return false;
  }
}

export async function saveSearch(term: string): Promise<void> {
  // Verify table exists
  const tableExists = await verifySearchHistoryTable();
  if (!tableExists) {
    throw new Error('Search history feature is not available. Please contact support.');
  }
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.warn('Skipping search history save: User not authenticated');
      return;
    }

    const cleanTerm = term.toLowerCase().trim();
    if (!cleanTerm) {
      console.warn('Skipping search history save: Empty search term');
      return;
    }

    const { error } = await supabase
      .from('search_history')
      .insert({
        user_id: user.id,
        term: cleanTerm,
        timestamp: new Date().toISOString(),
      });

    if (error) {
      console.error('Error saving search:', error);
      // Don't throw error to prevent disrupting the search experience
      return;
    }
  } catch (err) {
    // Log error but don't disrupt user experience
    console.error('Failed to save search history:', err);
  }
}

export async function getUserSearchHistory(): Promise<SearchHistory[]> {
  // Verify table exists
  const tableExists = await verifySearchHistoryTable();
  if (!tableExists) {
    throw new Error('Search history feature is not available. Please contact support.');
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('search_history')
    .select('*')
    .eq('user_id', user.id)
    .order('timestamp', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Error fetching user search history:', error);
    throw new Error('Failed to fetch search history');
  }
  return data || [];
}

export async function getTopSearches(): Promise<TopSearch[]> {
  // Verify table exists
  const tableExists = await verifySearchHistoryTable();
  if (!tableExists) {
    throw new Error('Search history feature is not available. Please contact support.');
  }

  const { data, error } = await supabase
    .from('search_history')
    .select('term, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching top searches:', error);
    throw new Error('Failed to fetch top searches');
  }

  // Get counts for the last 100 searches
  const recentSearches = (data || []).slice(0, 100);
  const termCounts = recentSearches.reduce((acc, { term }) => {
    acc[term] = (acc[term] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(termCounts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
