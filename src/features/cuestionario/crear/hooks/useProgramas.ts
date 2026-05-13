/**
 * useProgramas - Custom hook para gestión de programas
 * 
 * Propósito:
 * - Maneja la carga de programas desde la API
 * - Proporciona cálculo de puntajes máximos por programa
 * - Gestiona estados de loading y error
 * - Incluye función de respaldo para puntajes por defecto
 * 
 * Beneficios:
 * - Lógica de programas completamente separada
 * - Hook reutilizable en otros componentes
 * - Manejo centralizado de errores de API
 * - Cálculos de puntaje encapsulados
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import type { Programa } from '../types.ts';

export const useProgramas = () => {
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función de respaldo para puntaje máximo si no está en la base de datos
  const obtenerPuntajeMaximoPorDefecto = (nivel?: string): number => {
    if (!nivel) return 100;
    
    switch (nivel.toLowerCase()) {
      case 'técnico':
      case 'tecnico':
        return 50;
      case 'tecnológico':
      case 'tecnologico':
        return 75;
      case 'universitario':
      case 'profesional':
        return 100;
      case 'especialización':
      case 'especializacion':
        return 120;
      case 'maestría':
      case 'maestria':
        return 150;
      case 'doctorado':
        return 200;
      default:
        return 100;
    }
  };

  const cargarProgramas = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost/cuestionario-api/crearCuestionario_controller.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'getProgramas' })
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const responseText = await response.text();
      console.log('Respuesta del servidor (texto):', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error al parsear respuesta como JSON:', parseError);
        console.error('Contenido de la respuesta:', responseText);
        throw new Error('La respuesta del servidor no es un JSON válido');
      }
      
      console.log('Datos recibidos de programas:', data);
      
      if (data.success) {
        console.log('Programas con puntajes máximos:', data.programas);
        setProgramas(data.programas);
      } else {
        throw new Error(data.error || 'Error al cargar programas');
      }
    } catch (error) {
      console.error('Error al cargar programas:', error);
      
      if (error instanceof Error && error.message.includes('Sesión no iniciada')) {
        await Swal.fire({
          icon: 'error',
          title: 'No autorizado',
          text: 'Debe iniciar sesión para crear un cuestionario',
        });
        navigate('/login');
        return;
      }
      
      if (!(error instanceof TypeError && error.message.includes('Failed to fetch'))) {
        Swal.fire('Error', error instanceof Error ? error.message : 'Error de conexión al cargar programas', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const obtenerProgramaPorId = (programaId: string): Programa | undefined => {
    return programas.find(p => p.id.toString() === programaId);
  };

  const obtenerPuntajeMaximo = (programaId: string): number => {
    const programa = obtenerProgramaPorId(programaId);
    return programa?.nivel_puntaje_maximo || obtenerPuntajeMaximoPorDefecto(programa?.nivel_nombre);
  };

  useEffect(() => {
    cargarProgramas();
  }, []);

  return {
    programas,
    loading,
    cargarProgramas,
    obtenerProgramaPorId,
    obtenerPuntajeMaximo,
    obtenerPuntajeMaximoPorDefecto
  };
}; 