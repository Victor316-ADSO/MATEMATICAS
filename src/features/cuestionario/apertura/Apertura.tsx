/**
 * Apertura - Componente principal para gestionar aperturas de cuestionarios (REFACTORIZADO)
 * 
 * Propósito:
 * - Componente principal que orquesta la gestión de aperturas de cuestionarios
 * - Maneja el estado global y la lógica de negocio de aperturas
 * - Coordina la comunicación entre componentes modulares
 * - Gestiona las operaciones de API para crear y eliminar aperturas
 * 
 * Arquitectura Modular:
 * - AlertMessage: Notificaciones de éxito/error/warning
 * - HeaderSection: Header con título y navegación
 * - AperturaForm: Formulario para crear nuevas aperturas
 * - AperturasList: Tabla de aperturas existentes con acciones
 * - EmptyAperturas: Estado vacío cuando no hay aperturas
 * 
 * Beneficios de la refactorización:
 * - Código más limpio y mantenible
 * - Componentes reutilizables y testeables independientemente
 * - Separación clara de responsabilidades
 * - Fácil escalabilidad para nuevas funcionalidades
 */

import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import styles from './Apertura.module.css';
import useAuth from '../../../hooks/useAuth';
import PageTransition from '../../../components/PageTransition';
import AlertMessage from './components/AlertMessage';
import HeaderSection from './components/HeaderSection';
import AperturaForm from './components/AperturaForm';
import AperturasList from './components/AperturasList';

interface Cuestionario {
  id: number;
  cuestionario_id: number;
  titulo: string;
  descripcion: string;
  programa_nombre: string;
}

interface Periodo {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

interface Apertura {
  id: number;
  titulo: string;
  descripcion: string;
  programa_nombre: string;
  periodo_nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
}

const Apertura = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [cuestionarios, setCuestionarios] = useState<Cuestionario[]>([]);
  const [periodos, setPeriodos] = useState<Periodo[]>([]);
  const [aperturas, setAperturas] = useState<Apertura[]>([]);
  const [cuestionarioSeleccionado, setCuestionarioSeleccionado] = useState<string>('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<string>('');
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'danger' | 'warning' | '' }>({
    texto: '',
    tipo: '',
  });

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const cargarDatos = async () => {
      try {
        const response = await fetch(`http://localhost/cuestionario-api/api/apertura_api.php?usuario_id=${user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          credentials: 'include',
          body: JSON.stringify({
            action: 'get_data',
            usuario_id: user.id
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const datos = await response.json();

        if (!isMounted) return;

        if (datos.success) {
          setCuestionarios(datos.cuestionarios || []);
          setPeriodos(datos.periodos || []);
          setAperturas(datos.aperturas || []);
          
          // Pre-seleccionar cuestionario si viene en la URL
          const cuestionarioParam = searchParams.get('cuestionario');
          if (cuestionarioParam) {
            setCuestionarioSeleccionado(cuestionarioParam);
          }
        } else {
          throw new Error(datos.error || 'Error al cargar los datos');
        }
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Error al cargar datos:', error);
        setMensaje({
          texto: error instanceof Error ? error.message : 'Error al cargar los datos',
          tipo: 'danger'
        });
      }
    };

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, [user?.id, searchParams]);

  const recargarDatos = async () => {
    try {
      const response = await fetch(`http://localhost/cuestionario-api/api/apertura_api.php?usuario_id=${user?.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          action: 'get_data',
          usuario_id: user?.id
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const datos = await response.json();

      if (datos.success) {
        setCuestionarios(datos.cuestionarios || []);
        setPeriodos(datos.periodos || []);
        setAperturas(datos.aperturas || []);
      } else {
        throw new Error(datos.error || 'Error al cargar los datos');
      }
    } catch (error) {
      console.error('Error al recargar datos:', error);
      setMensaje({
        texto: error instanceof Error ? error.message : 'Error al recargar los datos',
        tipo: 'danger'
      });
    }
  };

  const crearApertura = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cuestionarioSeleccionado || !periodoSeleccionado) {
      mostrarAlerta('Debe seleccionar un cuestionario y un periodo', 'warning');
      return;
    }

    try {
      const respuesta = await fetch('http://localhost/cuestionario-api/api/apertura_api.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include',
        body: JSON.stringify({
          accion: 'crear_apertura',
          usuario_id: user?.id,
          cuestionario_id: cuestionarioSeleccionado,
          periodo_id: periodoSeleccionado,
        }),
      });

      if (!respuesta.ok) {
        const textoError = await respuesta.text();
        if (textoError.includes('<') || textoError.includes('<!DOCTYPE')) {
          throw new Error('El servidor devolvió HTML en lugar de JSON. Verifica que MySQL esté ejecutándose en XAMPP.');
        }
        throw new Error(`Error en la respuesta del servidor: ${respuesta.status}`);
      }

      const responseText = await respuesta.text();
      
      if (responseText.includes('<') || responseText.includes('<!DOCTYPE')) {
        throw new Error('El servidor devolvió HTML en lugar de JSON. Verifica que MySQL esté ejecutándose en XAMPP.');
      }

      const datos = JSON.parse(responseText);
      if (!datos.success) {
        throw new Error(datos.error || 'Error al crear la apertura');
      }

      mostrarAlerta('Apertura creada correctamente', 'success');
      setCuestionarioSeleccionado('');
      setPeriodoSeleccionado('');
      recargarDatos();
    } catch (error) {
      console.error('Error al crear apertura:', error);
      mostrarAlerta(error instanceof Error ? error.message : 'Error al crear la apertura', 'danger');
    }
  };

  const eliminarApertura = async (aperturaId: number) => {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará todas las asignaciones asociadas a este cuestionario.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const respuesta = await fetch('http://localhost/cuestionario-api/api/apertura_api.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include',
            body: JSON.stringify({
              accion: 'eliminar_apertura',
              usuario_id: user?.id,
              apertura_id: aperturaId,
            }),
          });

          if (!respuesta.ok) {
            const textoError = await respuesta.text();
            if (textoError.includes('<') || textoError.includes('<!DOCTYPE')) {
              throw new Error('El servidor devolvió HTML en lugar de JSON. Verifica que MySQL esté ejecutándose en XAMPP.');
            }
            throw new Error('Ya existe un estudiante asignado');
          }

          const responseText = await respuesta.text();
          
          if (responseText.includes('<') || responseText.includes('<!DOCTYPE')) {
            throw new Error('El servidor devolvió HTML en lugar de JSON. Verifica que MySQL esté ejecutándose en XAMPP.');
          }

          const datos = JSON.parse(responseText);
          if (!datos.success) {
            throw new Error(datos.error || 'Error al eliminar la apertura');
          }

          mostrarAlerta('La apertura ha sido eliminada correctamente', 'success');
          recargarDatos();
        } catch (error) {
          console.error('Error al eliminar apertura:', error);
          mostrarAlerta(error instanceof Error ? error.message : 'Error al eliminar la apertura', 'danger');
        }
      }
    });
  };

  const mostrarAlerta = (texto: string, tipo: 'success' | 'danger' | 'warning' | '') => {
    setMensaje({ texto, tipo });
    setTimeout(() => {
      setMensaje({ texto: '', tipo: '' });
    }, 5000);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  return (
    <PageTransition>
      <div className={styles.aperturaContainer}>
        <HeaderSection title="Apertura de Cuestionarios" />

        <AlertMessage 
          mensaje={mensaje} 
          onClose={() => setMensaje({ texto: '', tipo: '' })} 
        />

        <div className={styles.contentGrid}>
          {/* Formulario de Apertura */}
          <AperturaForm
            cuestionarios={cuestionarios}
            periodos={periodos}
            cuestionarioSeleccionado={cuestionarioSeleccionado}
            periodoSeleccionado={periodoSeleccionado}
            onCuestionarioChange={setCuestionarioSeleccionado}
            onPeriodoChange={setPeriodoSeleccionado}
            onSubmit={crearApertura}
            formatearFecha={formatearFecha}
          />

          {/* Lista de Aperturas */}
          <AperturasList
            aperturas={aperturas}
            onEliminarApertura={eliminarApertura}
            formatearFecha={formatearFecha}
          />
        </div>
      </div>
    </PageTransition>
  );
};

export default Apertura;
