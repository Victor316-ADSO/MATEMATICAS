import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import styles from '../VerRespuesta.module.css';

/**
 * HeaderSection muestra la barra superior con botón de volver, título y usuario.
 */
interface Props {
  onVolver: () => void;
  usuario?: string;
}
const HeaderSection: React.FC<Props> = ({ onVolver, usuario }) => (
  <nav className={styles.navbar}>
    <div className={styles.navbarContent}>
      <button onClick={onVolver} className={styles.btnVolver}>
        <FaArrowLeft size={12} /> Volver
      </button>
      <h1 className={styles.navbarTitle}>Respuestas</h1>
      <div className={styles.navbarUser}>{usuario}</div>
    </div>
  </nav>
);

export default HeaderSection; 