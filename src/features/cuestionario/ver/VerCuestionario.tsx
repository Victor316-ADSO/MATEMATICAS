import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './VerCuestionario.module.css';
import PageTransition from '../../../components/PageTransition';
import Swal from 'sweetalert2';

interface Opcion {
  id: number;
  texto_opcion: string;
  opcion_correcta: boolean;
  orden: number;
  tiene_imagen: boolean;
  nombre_imagen_opcion: string | null;
}

interface Pregunta {
  id: number;
  texto_pregunta: string;
  peso_pregunta: number;
  orden_pregunta: number;
  tiene_imagen: boolean;
  nombre_imagen_pregunta: string | null;
  opciones: Opcion[];
}

interface Cuestionario {
  id: number;
  titulo: string;
  descripcion: string;
  programa_id: number;
  docente_id: number;
  preguntas: Pregunta[];
}

const VerCuestionario: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedAccordion, setExpandedAccordion] = useState<number | null>(null);

  // Función para generar URL de imágenes
  const getImageUrl = (tipo: 'pregunta' | 'opcion', id: number) => {
    return `http://localhost/cuestionario-api/api/obtenerImagen_api.php?tipo=${tipo}&id=${id}`;
  };

  useEffect(() => {
    cargarCuestionario();
  }, [id]);

  const cargarCuestionario = async () => {
    try {
      const response = await fetch(`http://localhost/cuestionario-api/api/verCuestionario_api.php?id=${id}`, {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        setCuestionario(data.cuestionario);
      } else {
        throw new Error(data.error || 'Error al cargar el cuestionario');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'Error al cargar el cuestionario'
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAccordion = (index: number) => {
    setExpandedAccordion(expandedAccordion === index ? null : index);
  };

  if (loading) {
    return (
      <PageTransition>
        <div className={styles.loading}>
          <h2>Cargando...</h2>
        </div>
      </PageTransition>
    );
  }

  if (!cuestionario) {
    return (
      <PageTransition>
        <div className={styles.error}>
          <h2>Cuestionario no encontrado</h2>
          <button onClick={() => navigate('/dashboard')} className={styles.btnVolver}>
            Volver
          </button>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className={styles.verCuestionarioContainer}>
        <div className={styles.header}>
          <h1>{cuestionario.titulo}</h1>
          <p className={styles.descripcion}>{cuestionario.descripcion}</p>
        </div>

        <div className={styles.accordion}>
          {cuestionario.preguntas.map((pregunta, pIndex) => (
            <div key={pregunta.id} className={styles.accordionItem}>
              <div 
                className={styles.accordionHeader}
                onClick={() => toggleAccordion(pIndex)}
              >
                <div className={styles.accordionTitle}>
                  <span>P{pIndex + 1}: {pregunta.texto_pregunta}</span>
                  <span className={styles.peso}>{pregunta.peso_pregunta}p</span>
                </div>
                <span className={`${styles.accordionIcon} ${expandedAccordion === pIndex ? styles.accordionIconExpanded : ''}`}>
                  ▼
                </span>
              </div>
              
              {expandedAccordion === pIndex && (
                <div className={styles.accordionBody}>
                  {pregunta.tiene_imagen && (
                    <div className={styles.imagenContainer}>
                      <img 
                        src={getImageUrl('pregunta', pregunta.id)}
                        alt={`Imagen P${pIndex + 1}`}
                        className={styles.imagen}
                      />
                    </div>
                  )}

                  <div className={styles.opcionesContainer}>
                    {pregunta.opciones.map((opcion, oIndex) => {
                      // Solo mostrar el badge 'Correcta' en la primera opción correcta encontrada
                      const esPrimeraCorrecta = opcion.opcion_correcta && !pregunta.opciones.slice(0, oIndex).some(o => o.opcion_correcta);
                      return (
                        <div key={opcion.id} className={`${styles.opcionItem} ${opcion.opcion_correcta ? styles.opcionCorrecta : ''}`}>
                          <div className={styles.opcionTexto}>
                            <span className={styles.opcionLetra}>{String.fromCharCode(65 + oIndex)}</span>
                            <p>{opcion.texto_opcion}</p>
                            {/* Mostrar etiqueta Correcta solo en la primera opción correcta */}
                            {esPrimeraCorrecta && (
                              <span className={styles.badgeCorrect}>Correcta</span>
                            )}
                          </div>
                          {/* Mostrar imagen solo si tiene_imagen es true y nombre_imagen_opcion no es nulo ni vacío */}
                          {opcion.tiene_imagen && opcion.nombre_imagen_opcion && opcion.nombre_imagen_opcion.trim() !== '' && (
                            <div className={styles.imagenOpcionContainer}>
                              <img 
                                src={getImageUrl('opcion', opcion.id)}
                                alt={`Imagen opción ${String.fromCharCode(65 + oIndex)}`}
                                className={styles.imagenOpcion}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button onClick={() => navigate('/dashboard')} className={styles.btnVolver}>
            Volver
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default VerCuestionario;