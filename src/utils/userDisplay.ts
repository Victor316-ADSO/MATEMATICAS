/** Nombre legible a partir de filas de BD / JWT (varios esquemas). */
export function getUserDisplayName(user: Record<string, unknown> | null | undefined): string {
  if (!user) return '';
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      const v = user[k];
      if (v != null && String(v).trim() !== '') {
        return String(v).trim();
      }
    }
    return '';
  };
  return pick('nombre', 'nomb_pers', 'nom_pers', 'nomb_comp', 'primer_nombre', 'email');
}
