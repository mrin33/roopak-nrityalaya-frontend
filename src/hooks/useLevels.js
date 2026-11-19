import { useEffect, useState } from 'react';
import publicService from '../services/publicService';

// Kathak levels (with fee options) from the API, cached for the session.
let cache = null;
let inflight = null;

const useLevels = () => {
  const [levels, setLevels] = useState(cache || []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (cache) return undefined;
    let active = true;
    inflight = inflight || publicService.getLevels();
    inflight
      .then((data) => {
        cache = data;
        if (active) setLevels(data);
      })
      .catch((err) => {
        inflight = null;
        if (active) setError(err.message || 'Could not load levels');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return { levels, loading, error };
};

export default useLevels;
