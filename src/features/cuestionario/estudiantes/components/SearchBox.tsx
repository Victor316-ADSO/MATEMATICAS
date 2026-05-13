/**
 * SearchBox - Componente para el input de búsqueda de estudiantes
 *
 * Propósito:
 * - Renderiza un input de búsqueda reutilizable
 * - Permite filtrar estudiantes por nombre, email, ID o programa
 *
 * Beneficios:
 * - Reutilizable en cualquier tabla/lista
 * - Separación clara de la lógica de búsqueda
 * - Feedback visual inmediato
 */

import React from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from '../estudiante.module.css';

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange, placeholder = 'Buscar...' }) => (
  <div className={styles.searchBox}>
    <input
      type="text"
      placeholder={placeholder}
      className={styles.formControl}
      value={value}
      onChange={onChange}
    />
    <FaSearch className={styles.searchIcon} />
  </div>
);

export default SearchBox; 