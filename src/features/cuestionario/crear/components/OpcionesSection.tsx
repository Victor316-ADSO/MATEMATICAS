/**
 * OpcionesSection - Componente para manejar las opciones de una pregunta
 * 
 * Propósito:
 * - Renderiza todas las opciones de una pregunta con texto e imagen
 * - Maneja la selección de la opción correcta con radio buttons
 * - Permite agregar y eliminar opciones dinámicamente
 * - Integra ImageDropZone para cada opción
 * 
 * Beneficios:
 * - Separación clara de la lógica de opciones
 * - Reutilizable para diferentes tipos de preguntas
 * - Validación integrada (mínimo 2 opciones)
 * - Interfaz intuitiva y responsive
 */

import React from 'react';
import ImageDropZone from './ImageDropZone';
import styles from '../CrearCuestionario.module.css';

interface Opcion {
  texto: string;
  imagen: File | null;
}

interface OpcionesSectionProps {
  opciones: Opcion[];
  preguntaIndex: number;
  opcionCorrecta: number | null;
  onOpcionChange: (oIndex: number, valor: string) => void;
  onCorrectaChange: (oIndex: number) => void;
  onAgregarOpcion: () => void;
  onEliminarOpcion: (oIndex: number) => void;
  onImagenOpcionChange: (oIndex: number, files: FileList | null) => void;
  onEliminarImagenOpcion: (oIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, oIndex: number) => void;
}

const OpcionesSection: React.FC<OpcionesSectionProps> = ({
  opciones,
  preguntaIndex,
  opcionCorrecta,
  onOpcionChange,
  onCorrectaChange,
  onAgregarOpcion,
  onEliminarOpcion,
  onImagenOpcionChange,
  onEliminarImagenOpcion,
  onDragOver,
  onDrop
}) => {
  return (
    <div className={styles.opcionesSection}>
      <h5>Opciones *</h5>
      {opciones.map((opcion, oIndex) => (
        <div key={oIndex} className={styles.opcionGroup}>
          <div className={styles.opcionRow}>
            <input
              type="text"
              value={opcion.texto}
              onChange={(e) => onOpcionChange(oIndex, e.target.value)}
              required
              className={styles.formControl}
              placeholder={`Opción ${oIndex + 1}`}
            />
            <input
              type="radio"
              name={`correcta-${preguntaIndex}`}
              checked={opcionCorrecta === oIndex}
              onChange={() => onCorrectaChange(oIndex)}
              required
            />
            {opciones.length > 2 && (
              <button
                type="button"
                onClick={() => onEliminarOpcion(oIndex)}
                className={styles.btnDeleteOption}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <ImageDropZone
            imagen={opcion.imagen}
            onImagenChange={(files) => onImagenOpcionChange(oIndex, files)}
            onEliminarImagen={() => onEliminarImagenOpcion(oIndex)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, oIndex)}
            placeholder={`Imagen para opción ${oIndex + 1} (opcional)`}
            inputId={`opcion-img-${preguntaIndex}-${oIndex}`}
            className={styles.opcionImage}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={onAgregarOpcion}
        className={styles.btnAddOption}
      >
        <i className="fas fa-plus"></i> Agregar Opción
      </button>
    </div>
  );
};

export default OpcionesSection; 