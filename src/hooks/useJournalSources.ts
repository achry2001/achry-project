
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

export function useJournalSources() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSources() {
      try {
        const { data, error } = await supabase
          .from('journal_sources')
          .select('*')
          .order('original_order');
        if (error) throw error;
        setSources(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSources();
  }, []);

  return { sources, loading, error };
}
