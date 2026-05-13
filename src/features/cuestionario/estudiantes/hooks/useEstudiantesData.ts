/**
 * useEstudiantesData - Custom hook para gestión integral de estudiantes
 *
 * Propósito:
 * - Maneja la carga de estudiantes y programas desde la API
 * - Proporciona funciones para agregar, eliminar e importar estudiantes
 * - Gestiona estados de loading, error y búsqueda
 * - Encapsula toda la lógica de comunicación con el backend
 *
 * Beneficios:
 * - Lógica de datos completamente separada y reutilizable
 * - Hook testeable independientemente
 * - Manejo centralizado de errores de API
 * - Estados optimizados para UI responsiva
 */

import { useState, useEffect, useRef } from 'react';
import type React from 'react';
import Swal from 'sweetalert2';
import { API_ENDPOINTS, fetchApi } from '../../../../config/api';
import type { Estudiante, Programa, EstudianteForm, ImportarEstudiantesState } from '../types';
import useAuth from '../../../../hooks/useAuth';

export const useEstudiantesData = () => {
  const { user } = useAuth();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const fileInputRef: React.RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

  // Cargar estudiantes y programas
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);
      const usuarioId = user?.id || '';
      const data = await fetchApi(`${API_ENDPOINTS.estudiantes}?usuario_id=${usuarioId}`, { method: 'GET' });
      if (data.estudiantes) setEstudiantes(data.estudiantes);
      if (data.programas) setProgramas(data.programas);
    } catch (error) {
      setError('Error al cargar los datos');
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al cargar los datos' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  // Agregar estudiante
  const agregarEstudiante = async (form: EstudianteForm) => {
    try {
      const formData = new FormData();
      formData.append('agregar_estudiante', 'true');
      formData.append('nombre', form.nombre);
      formData.append('email', form.email);
      formData.append('identificacion', form.identificacion);
      formData.append('programa_id', form.programaId);
      const response = await fetch(API_ENDPOINTS.estudiantes, { method: 'POST', body: formData, credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        Swal.fire({ icon: 'success', title: '¡Éxito!', text: data.mensaje || 'Estudiante agregado', timer: 1500, showConfirmButton: false });
        cargarDatos();
        return true;
      } else {
        Swal.fire({ icon: 'warning', title: 'Advertencia', text: data.mensaje || 'Error al agregar estudiante' });
        return false;
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al procesar la solicitud' });
      return false;
    }
  };

  // Eliminar estudiante
  const eliminarEstudiante = async (id: number) => {
    const confirm = await Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea eliminar este estudiante?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (!confirm.isConfirmed) return false;
    try {
      const response = await fetch(`${API_ENDPOINTS.estudiantes}?eliminar=${id}`, { method: 'GET', credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        Swal.fire({ icon: 'success', title: '¡Éxito!', text: data.mensaje || 'Estudiante eliminado', timer: 1500, showConfirmButton: false });
        cargarDatos();
        return true;
      } else {
        Swal.fire({ icon: 'warning', title: 'Advertencia', text: data.mensaje || 'Error al eliminar estudiante' });
        return false;
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error al procesar la solicitud' });
      return false;
    }
  };

  // Importar estudiantes
  const importarEstudiantes = async (file: File) => {
    try {
      const usuarioJSON = localStorage.getItem('usuario');
      const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : null;
      const usuarioId = usuario?.id || '';
      const formData = new FormData();
      formData.append('action', 'importar_estudiantes');
      formData.append('archivo_estudiantes', file);
      formData.append('usuario_id', usuarioId.toString());
      const url = `http://localhost/cuestionario-api/api/asignacion_api.php?usuario_id=${usuarioId}`;
      const response = await fetch(url, { method: 'POST', credentials: 'include', body: formData });
      if (!response.ok) throw new Error(`Error al importar estudiantes: ${response.status} ${response.statusText}`);
      const textoRespuesta = await response.text();
      if (!textoRespuesta.trim()) throw new Error('Respuesta vacía al importar estudiantes');
      const data = JSON.parse(textoRespuesta);
      if (data.success) {
        Swal.fire({ icon: 'success', title: '¡Éxito!', text: data.message || 'Estudiantes importados', timer: 1500, showConfirmButton: false });
        cargarDatos();
        setSelectedFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return true;
      } else {
        throw new Error(data.error || 'Error al importar estudiantes');
      }
    } catch (error: any) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Error al importar estudiantes' });
      return false;
    }
  };

  // Manejar cambio de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFileName(e.target.files[0].name);
    } else {
      setSelectedFileName('');
    }
  };

  // Filtrar estudiantes
  const estudiantesFiltrados = estudiantes.filter(estudiante => 
    estudiante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    estudiante.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    estudiante.identificacion.toLowerCase().includes(busqueda.toLowerCase()) ||
    estudiante.programa_nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return {
    estudiantes,
    programas,
    loading,
    error,
    busqueda,
    setBusqueda,
    selectedFileName,
    setSelectedFileName,
    fileInputRef,
    cargarDatos,
    agregarEstudiante,
    eliminarEstudiante,
    importarEstudiantes,
    handleFileChange,
    estudiantesFiltrados
  };
}; 