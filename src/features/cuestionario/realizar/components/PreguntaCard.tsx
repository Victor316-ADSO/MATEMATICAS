import React, { useState } from 'react';
import styles from '../RealizarCuestionario.module.css';

// Define el tipo Opcion localmente
interface Opcion {
  id: number;
  texto_opcion: string;
  opcion_correcta: boolean;
  imagen_opcion?: string;
}

interface Pregunta {
  id: number;
  texto_pregunta: string;
  peso_pregunta: number;
  imagen_pregunta?: string;
  opciones: Opcion[];
}

interface RespuestaUsuario {
  [preguntaId: number]: number;
}

interface PreguntaCardProps {
  pregunta: Pregunta;
  respuestas: RespuestaUsuario;
  paginaActual: number;
  onResponseChange: (preguntaId: number, opcionId: number) => void;
  getImageUrl: (tipo: 'pregunta' | 'opcion', id: number) => string;
}

const PreguntaCard: React.FC<PreguntaCardProps> = ({
  pregunta,
  respuestas,
  paginaActual,
  onResponseChange,
  getImageUrl
}) => {
  const letras = ['A', 'B', 'C', 'D'];
  const [imagenPreguntaError, setImagenPreguntaError] = useState(false);
  const [modalImagen, setModalImagen] = useState<string | null>(null);
  const [imagenOpcionError, setImagenOpcionError] = useState<{ [opcionId: number]: boolean }>({});

  // Función para abrir la imagen en modal
  const handleImagenClick = (src: string) => {
    setModalImagen(src);
  };

  // Función para cerrar el modal
  const handleCerrarModal = () => {
    setModalImagen(null);
  };

  return (
    <div className={styles.preguntaCard}>
      {/* Modal de imagen ampliada */}
      {modalImagen && (
        <div className={styles.modalOverlay} onClick={handleCerrarModal}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <img src={modalImagen} alt="Imagen ampliada" className={styles.imagenAmpliada} />
            <button className={styles.cerrarModalBtn} onClick={handleCerrarModal}>Cerrar</button>
          </div>
        </div>
      )}
      <div className={styles.preguntaHeader}>
        <h3>{pregunta.texto_pregunta}</h3>
        <div className={styles.pesoPregunta}>
          Peso: {pregunta.peso_pregunta}
        </div>
      </div>

      <div className={styles.preguntaContenido}>
        {Boolean(pregunta.imagen_pregunta) && String(pregunta.imagen_pregunta).trim() !== '' && !imagenPreguntaError && (
          <div className={styles.imagenContainer}>
            <img 
              src={getImageUrl('pregunta', pregunta.id)}
              alt={`Imagen de la pregunta ${paginaActual}`}
              className={styles.imagenGrande}
              onError={() => setImagenPreguntaError(true)}
              onClick={() => handleImagenClick(getImageUrl('pregunta', pregunta.id))}
              style={{ cursor: 'zoom-in' }}
            />
          </div>
        )}

        <div className={styles.opcionesGrid}>
          {pregunta.opciones.map((opcion: Opcion, index: number) => {
            // Solo mostrar el color verde y el badge en la primera opción correcta encontrada
            const esPrimeraCorrecta = opcion.opcion_correcta && !pregunta.opciones.slice(0, index).some((o: Opcion) => o.opcion_correcta);
            return (
              <div 
                key={opcion.id} 
                className={`${styles.opcionItem} ${esPrimeraCorrecta ? styles.opcionCorrecta : ''} ${respuestas[pregunta.id] === opcion.id ? styles.opcionSeleccionada : ''}`}
              >
                <label className={styles.opcionLabel}>
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.id}
                    checked={respuestas[pregunta.id] === opcion.id}
                    onChange={() => onResponseChange(pregunta.id, opcion.id)}
                    className={styles.radioInput}
                  />
                  <div className={styles.opcionTexto}>
                    <span className={styles.opcionLetra}>{letras[index]}</span>
                    <p>{opcion.texto_opcion}</p>
                    {/* Mostrar etiqueta Correcta solo en la primera opción correcta */}
                    {esPrimeraCorrecta && (
                      <span className={styles.badgeCorrect}>Correcta</span>
                    )}
                  </div>
                  {opcion.imagen_opcion && opcion.imagen_opcion.trim() !== '' && !imagenOpcionError[opcion.id] && (
                    <div className={styles.imagenOpcionContainer}>
                      <img 
                        src={getImageUrl('opcion', opcion.id)}
                        alt="Imagen de la opción"
                        className={styles.imagenGrande}
                        onClick={() => handleImagenClick(getImageUrl('opcion', opcion.id))}
                        style={{ cursor: 'zoom-in' }}
                        onError={() => setImagenOpcionError(prev => ({ ...prev, [opcion.id]: true }))}
                      />
                    </div>
                  )}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PreguntaCard; 