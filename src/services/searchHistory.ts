import { supabase, SearchHistory, TopSearch } from '../lib/supabase';

export async function saveSearch(term: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('search_history')
    .insert({
      user_id: user.id,
      term: term.toLowerCase().trim(),
      timestamp: new Date().toISOString(),
    });

  if (error) throw error;
}

export async function getUserSearchHistory(): Promise<SearchHistory[]> {
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

  if (error) throw error;
  return data || [];
}

export async function getTopSearches(): Promise<TopSearch[]> {
  const { data, error } = await supabase
    .from('search_history')
    .select('term');

  if (error) throw error;

  const termCounts = (data || []).reduce((acc, { term }) => {
    acc[term] = (acc[term] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(termCounts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
