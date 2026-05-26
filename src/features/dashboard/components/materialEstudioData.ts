/** Modelo U(t) = -2t⁴ + 32t³ - 180t² + 432t + 100 — t en meses */

export const U = (t: number) =>
  -2 * t ** 4 + 32 * t ** 3 - 180 * t ** 2 + 432 * t + 100;

export const U_PRIME = (t: number) =>
  -8 * t ** 3 + 96 * t ** 2 - 360 * t + 432;

export const U_DOUBLE_PRIME = (t: number) =>
  -24 * t ** 2 + 192 * t - 360;

export const FORMULAS = {
  u: 'U(t) = -2t⁴ + 32t³ - 180t² + 432t + 100',
  uPrime: "U'(t) = -8t³ + 96t² - 360t + 432",
  uDoublePrime: "U''(t) = -24t² + 192t - 360",
};

export const FASES_ADOPCION = [
  {
    id: 'fase1',
    titulo: 'Fase 1: Crecimiento acelerado',
    intervalo: 't entre 0 y 3',
    matematicas: "U'(t) > 0 y U''(t) > 0",
    ingenieria:
      'Viralización: cada mes entran más usuarios que el mes anterior. Monitorear carga de BD y latencia HTTP.',
    color: 'success',
  },
  {
    id: 'fase2',
    titulo: 'Fase 2: Punto de inflexión y meseta',
    intervalo: 't = 3',
    matematicas: "U'(3) = 0, U''(3) = 0 — tangente horizontal; pendiente sigue siendo positiva en torno a t=3",
    ingenieria:
      'Meseta tecnológica: el ritmo de adopción se estanca temporalmente (infraestructura o saturación de un primer sector del mercado).',
    color: 'info',
  },
  {
    id: 'fase3',
    titulo: 'Fase 3: Crecimiento desacelerado',
    intervalo: 't entre 3 y 6',
    matematicas: "U'(t) > 0 y U''(t) < 0",
    ingenieria:
      'La app sigue ganando usuarios, pero más lento. El mercado se satura; marketing y actualizaciones son clave.',
    color: 'warning',
  },
  {
    id: 'fase4',
    titulo: 'Fase 4: Pico de adopción',
    intervalo: 't = 6',
    matematicas: "U'(6) = 0, U''(6) = -72 < 0 → máximo local",
    ingenieria:
      'Máximo de usuarios activos y mayor estrés en servidores. Sin innovación, el modelo predice decrecimiento (U\' < 0).',
    color: 'primary',
  },
];

export const TABLA_REFERENCIA = [
  {
    concepto: 'Función original',
    expresion: 'U(3) o U(6)',
    resultado: `U(3) ≈ ${Math.round(U(3))} · U(6) ≈ ${Math.round(U(6))}`,
    interpretacion: 'Volumen total de usuarios activos en ese mes.',
  },
  {
    concepto: 'Primera derivada',
    expresion: "U'(t) = 0",
    resultado: 't = 3, t = 6',
    interpretacion: 'Momentos donde el crecimiento se detiene o cambia de rumbo.',
  },
  {
    concepto: 'Segunda derivada',
    expresion: "U''(6)",
    resultado: `${U_DOUBLE_PRIME(6)} (negativo)`,
    interpretacion: 'Concavidad hacia abajo → desaceleración y máximo.',
  },
  {
    concepto: 'Segunda derivada',
    expresion: "U''(3)",
    resultado: `${U_DOUBLE_PRIME(3)} (cero)`,
    interpretacion: 'Punto de inflexión → meseta tecnológica.',
  },
];

export const POR_QUE_GRADO_4 = [
  'Las curvas de adopción (curva en S) requieren funciones no lineales con varios cambios de concavidad.',
  'Un polinomio de grado 4 puede modelar mesetas antes de un pico máximo.',
  'El término +100: base inicial en t = 0 (fase beta con ~100 usuarios).',
  'El término -2t⁴: para t grande la función decrece (ciclo de vida y posible obsolescencia).',
];

export const HERRAMIENTAS_PYTHON = [
  { lib: 'SymPy', rol: 'Derivadas simbólicas exactas (expresiones algebraicas).' },
  { lib: 'NumPy', rol: 'Evaluar U(t) en miles de puntos mediante arrays.' },
  { lib: 'Pandas', rol: 'DataFrames con tiempo, U, U\', U\'\' para reportes.' },
  { lib: 'Matplotlib', rol: 'Gráficas con puntos críticos t=3 y t=6 y regiones de concavidad.' },
];

export function generarCurvaAdopcion(tMax = 8, pasos = 50): { t: number; u: number }[] {
  const puntos: { t: number; u: number }[] = [];
  for (let i = 0; i < pasos; i++) {
    const t = (tMax * i) / (pasos - 1);
    puntos.push({ t: Math.round(t * 10) / 10, u: Math.round(U(t)) });
  }
  return puntos;
}
