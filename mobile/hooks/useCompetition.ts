import { useState, useCallback, useEffect } from 'react';
import { api, CompetitionResponse } from '../services/api';

type Status = 'idle' | 'loading' | 'success' | 'error';

export function useCompetition(id: string) {
  const [data, setData] = useState<CompetitionResponse | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!id) return;
    setStatus('loading');
    setError(null);
    try {
      const res = await api.getCompetition(id);
      setData(res);
      setStatus('success');
    } catch (e: any) {
      setError(e.message || 'Failed to load competition.');
      setStatus('error');
    }
  }, [id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, status, error, refetch: fetch };
}
