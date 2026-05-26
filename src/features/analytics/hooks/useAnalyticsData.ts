import { useCallback, useEffect, useState } from 'react';
import { fetchAdminApi, API_ENDPOINTS } from '../../../config/api';
import type { AnalyticsDashboardData } from '../types';

export function useAnalyticsData() {
  const [data, setData] = useState<AnalyticsDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchAdminApi(API_ENDPOINTS.direct.analytics.dashboard);
      if (res?.success && res?.data) {
        const payload = res.data as AnalyticsDashboardData;
        const diario = payload?.crecimiento?.diario?.length ?? 0;
        if (diario === 0) {
          setError('No hay series temporales en la base de datos. Ejecuta: php database/seed_analytics_datos.php --reset');
          return;
        }
        setData(payload);
      } else {
        setError(res?.message || res?.error || 'No se pudo cargar el analytics');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
