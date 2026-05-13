/**
 * PreguntaCard - Componente para una pregunta individual completa
 * 
 * Propósito:
 * - Encapsula toda la funcionalidad de una pregunta individual
 * - Incluye header con número, peso y botón eliminar
 * - Maneja el texto de la pregunta e imagen opcional
 * - Integra OpcionesSection para todas las opciones
 * 
 * Beneficios:
 * - Separación completa de la lógica de cada pregunta
 * - Reutilizable para diferentes tipos de cuestionarios
 * - Fácil de mantener y testear independientemente
 * - Interfaz organizada y cohesiva
 */

import React from 'react';
import ImageDropZone from './ImageDropZone';
import OpcionesSection from './OpcionesSection';
import styles from '../CrearCuestionario.module.css';

interface Opcion {
  texto: string;
  imagen: File | null;
}

interface Pregunta {
  texto: string;
  opciones: Opcion[];
  correcta: number | null;
  peso: number;
  imagen: File | null;
}

interface PreguntaCardProps {
  pregunta: Pregunta;
  preguntaIndex: number;
  onEliminarPregunta: () => void;
  onActualizarPregunta: (campo: string, valor: any) => void;
  onActualizarPeso: (valor: string) => void;
  onActualizarOpcion: (oIndex: number, valor: string) => void;
  onAgregarOpcion: () => void;
  onEliminarOpcion: (oIndex: number) => void;
  onImagenPreguntaChange: (files: FileList | null) => void;
  onEliminarImagenPregunta: () => void;
  onImagenOpcionChange: (oIndex: number, files: FileList | null) => void;
  onEliminarImagenOpcion: (oIndex: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDropPregunta: (e: React.DragEvent) => void;
  onDropOpcion: (e: React.DragEvent, oIndex: number) => void;
}

const PreguntaCard: React.FC<PreguntaCardProps> = ({
  pregunta,
  preguntaIndex,
  onEliminarPregunta,
  onActualizarPregunta,
  onActualizarPeso,
  onActualizarOpcion,
  onAgregarOpcion,
  onEliminarOpcion,
  onImagenPreguntaChange,
  onEliminarImagenPregunta,
  onImagenOpcionChange,
  onEliminarImagenOpcion,
  onDragOver,
  onDropPregunta,
  onDropOpcion
}) => {
  return (
    <div className={styles.preguntaCard}>
      <div className={styles.preguntaHeader}>
        <h4>Pregunta {preguntaIndex + 1}</h4>
        <div className={styles.preguntaControls}>
          <input
            type="number"
            value={pregunta.peso === 0 ? '' : pregunta.peso}
            onChange={(e) => onActualizarPeso(e.target.value)}
            placeholder="Peso"
            min="0.01"
            step="0.01"
            className={styles.pesoInput}
          />
          <button
            type="button"
            onClick={onEliminarPregunta}
            className={styles.btnDelete}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      <div className={styles.preguntaContent}>
        <div className={styles.preguntaTexto}>
          <input
            type="text"
            value={pregunta.texto}
            onChange={(e) => onActualizarPregunta('texto', e.target.value)}
            required
            className={styles.formControl}
            placeholder="Escriba la pregunta *"
          />
        </div>

        <ImageDropZone
          imagen={pregunta.imagen}
          onImagenChange={onImagenPreguntaChange}
          onEliminarImagen={onEliminarImagenPregunta}
          onDragOver={onDragOver}
          onDrop={onDropPregunta}
          placeholder="Haga clic para seleccionar una imagen"
          inputId={`pregunta-img-${preguntaIndex}`}
        />
      </div>

      <OpcionesSection
        opciones={pregunta.opciones}
        preguntaIndex={preguntaIndex}
        opcionCorrecta={pregunta.correcta}
        onOpcionChange={onActualizarOpcion}
        onCorrectaChange={(oIndex) => onActualizarPregunta('correcta', oIndex)}
        onAgregarOpcion={onAgregarOpcion}
        onEliminarOpcion={onEliminarOpcion}
        onImagenOpcionChange={onImagenOpcionChange}
        onEliminarImagenOpcion={onEliminarImagenOpcion}
        onDragOver={onDragOver}
        onDrop={onDropOpcion}
      />
    </div>
  );
};

export default PreguntaCard; 