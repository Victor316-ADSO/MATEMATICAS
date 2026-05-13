/**
 * ImportarEstudiantesForm - Componente para importar estudiantes desde CSV
 *
 * Propósito:
 * - Renderiza el formulario para importar estudiantes desde un archivo CSV
 * - Muestra el nombre del archivo seleccionado
 * - Permite enviar el archivo para importación
 *
 * Beneficios:
 * - Separación clara de la lógica de importación
 * - Reutilizable en otras vistas
 * - Feedback visual inmediato
 */

import React from 'react';
import { FaFileImport, FaUpload } from 'react-icons/fa';
import styles from '../estudiante.module.css';

interface ImportarEstudiantesFormProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedFileName: string;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImportar: (file: File) => void;
}

const ImportarEstudiantesForm: React.FC<ImportarEstudiantesFormProps> = ({
  fileInputRef,
  selectedFileName,
  handleFileChange,
  onImportar
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fileInputRef.current?.files && fileInputRef.current.files.length > 0) {
      onImportar(fileInputRef.current.files[0]);
    }
  };

  return (
    <div className={styles.card} style={{ marginTop: '0.75rem' }}>
      <div className={styles.cardHeader}>
        <h5><FaFileImport /> Importar CSV</h5>
      </div>
      <div className={styles.cardBody}>
        <form onSubmit={handleSubmit}>
          <div className={styles.importContainer}>
            <div className={styles.formatInfo}>
              <p>Formato: nombre, email, ID, programa</p>
            </div>
            <div className={styles.fileInputSection}>
              <label htmlFor="archivo_estudiantes">Archivo:</label>
              <div className={styles.fileInputWrapper}>
                <input
                  type="file"
                  id="archivo_estudiantes"
                  ref={fileInputRef}
                  accept=".csv"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                />
                <div className={styles.fileInputContent}>
                  <FaFileImport size={24} />
                  <span>CSV</span>
                  <span className={styles.fileInputText}>
                    {selectedFileName || 'Seleccionar'}
                  </span>
                </div>
              </div>
            </div>
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

export default ImportarEstudiantesForm; 