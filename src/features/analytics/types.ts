export interface TarjetasResumen {
  usuarios_registrados: number;
  usuarios_activos: number;
  quizzes_completados: number;
  tiempo_promedio_estudio: number;
  crecimiento_semanal_pct: number;
  crecimiento_mensual_pct: number;
  tasa_retencion_pct: number;
  tendencia: string;
}

export interface AlertaInteligente {
  tipo: string;
  nivel: string;
  mensaje: string;
  criterio: string;
}

export interface AnalisisMatematico {
  funcion: string;
  derivada: string;
  segunda_derivada: string;
  t_actual: number;
  t_actual_nota?: string;
  usuarios_reales_referencia?: number;
  analisis_actual: {
    t: number;
    u: number;
    u_prime: number;
    u_double_prime: number;
    growth_rate: string;
    acceleration: string;
    is_stagnant: boolean;
    is_growing: boolean;
    is_decelerating: boolean;
    is_accelerating: boolean;
  };
  curva: Array<{ t: number; u: number; u_prime: number; u_double_prime: number }>;
  puntos_criticos: Array<{ t: number; u: number; tipo: string }>;
  puntos_inflexion: Array<{ t: number; u: number }>;
  alertas: AlertaInteligente[];
  prediccion: {
    proyeccion: Array<{
      mes: number;
      usuarios_proyectados: number;
      tendencia: string;
      tendencia_modelo?: string;
    }>;
    riesgo_abandono: string;
    meses_saturacion_estimados: number[];
    meses_estabilizacion: number[];
    crecimiento_futuro_estimado: number;
  };
}

export interface AnalyticsDashboardData {
  tarjetas: TarjetasResumen;
  crecimiento: {
    diario: Array<Record<string, string | number>>;
    semanal: Array<Record<string, string | number>>;
    mensual: Array<Record<string, string | number>>;
  };
  matematico: AnalisisMatematico;
  graficas: {
    crecimiento_usuarios: { labels: string[]; datasets: Array<{ label: string; data: number[] }> };
    concavidad: { labels: number[]; data: number[] };
    comparacion_semanal: { labels: string[]; activos: number[]; quizzes: number[] };
    activos_vs_quizzes: { labels: string[]; activos: number[]; quizzes: number[] };
    prediccion: { labels: string[]; data: number[] };
  };
}
