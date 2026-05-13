/**
 * ImageDropZone - Componente para drag & drop de imágenes en cuestionarios
 * 
 * Propósito:
 * - Maneja la subida de imágenes con drag & drop y clic para seleccionar
 * - Muestra preview de la imagen seleccionada con opción de eliminar
 * - Valida tipo y tamaño de archivos automáticamente
 * - Proporciona feedback visual durante la interacción
 * 
 * Beneficios:
 * - Reutilizable para preguntas, opciones y cualquier subida de imagen
 * - Interfaz intuitiva con drag & drop moderno
 * - Validación integrada de archivos
 * - Fácil de mantener y personalizar
 */

import React from 'react';
import styles from '../CrearCuestionario.module.css';

interface ImageDropZoneProps {
  imagen: File | null;
  onImagenChange: (files: FileList | null) => void;
  onEliminarImagen: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  placeholder: string;
  inputId: string;
  className?: string;
}

const ImageDropZone: React.FC<ImageDropZoneProps> = ({
  imagen,
  onImagenChange,
  onEliminarImagen,
  onDragOver,
  onDrop,
  placeholder,
  inputId,
  className = ''
}) => {
  const dropZoneClass = `${styles.imageDropZone} ${className} ${imagen ? styles.hasImage : ''}`;

  return (
    <div className={styles.preguntaImagen}>
      <div 
        className={dropZoneClass}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        {imagen ? (
          <div className={styles.imagePreview}>
            <img src={URL.createObjectURL(imagen)} alt={placeholder} />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEliminarImagen();
              }}
              className={styles.removeImage}
            >
              ×
            </button>
          </div>
        ) : (
          <div className={styles.dropZoneContent}>
            <i className="fas fa-image"></i>
            <span>{placeholder}</span>
            <small>Formatos aceptados: JPG, PNG, GIF (máx. 2MB)</small>
          </div>
        )}
      </div>
      <input
        id={inputId}
        type="file"
        onChange={(e) => onImagenChange(e.target.files)}
        accept="image/jpeg,image/png,image/gif"
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageDropZone; 