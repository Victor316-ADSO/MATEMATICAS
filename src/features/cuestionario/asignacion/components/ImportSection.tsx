/**
 * ImportSection - Componente para importar estudiantes desde archivos CSV
 * 
 * Propósito:
 * - Permite cargar estudiantes masivamente desde archivos CSV
 * - Muestra instrucciones claras del formato requerido
 * - Maneja la selección de archivos y feedback visual
 * - Proporciona ejemplo práctico del formato esperado
 * 
 * Beneficios:
 * - Separación clara de la funcionalidad de importación
 * - Interfaz intuitiva con drag & drop visual
 * - Instrucciones integradas para evitar errores del usuario
 * - Reutilizable para importar otros tipos de datos
 */

import React, { useRef } from 'react';
import { FaFileImport, FaUpload } from 'react-icons/fa';
import styles from '../Asignacion.module.css';

interface ImportSectionProps {
  selectedFileName: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ImportSection: React.FC<ImportSectionProps> = ({
  selectedFileName,
  onFileChange,
  onSubmit
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.importSection}>
      <div className={styles.importHeader}>
        <h5><FaFileImport /> Importar CSV</h5>
      </div>
      <div className={styles.importBody}>
        <form onSubmit={onSubmit}>
          <div className={styles.importContainer}>
            {/* Información del formato */}
            <div className={styles.formatInfo}>
              <h6>Formato:</h6>
              <ol>
                <li>Archivo .csv</li>
                <li>Columnas: nombre, email, id, id_programa</li>
                <li>Delimitador: coma o punto y coma</li>
              </ol>
              <p><strong>Ejemplo:</strong>
              <code>Juan;juan@email.com;123;2</code></p>
            </div>
            
            {/* Selector de archivo */}
            <div className={styles.fileInputSection}>
              <label htmlFor="archivo_estudiantes">Archivo:</label>
              <div className={styles.fileInputWrapper}>
                <input 
                  type="file" 
                  id="archivo_estudiantes" 
                  ref={fileInputRef}
                  accept=".csv"
                  className={styles.fileInput}
                  onChange={onFileChange}
                />
                <div className={styles.fileInputContent}>
                  <FaFileImport size={24} />
                  <span>CSV</span>
                  <span className={styles.fileInputText}>
                    {selectedFileName || "Seleccionar"}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Botón de enviar */}
            <div className={styles.submitSection}>
              <button type="submit" className={styles.btnSecondary}>
                <FaUpload /> Importar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImportSection; 