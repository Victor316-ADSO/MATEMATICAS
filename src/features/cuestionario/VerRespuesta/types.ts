// Tipos centralizados para el módulo VerRespuesta

export interface EstudianteInfo {
  id: number;
  nombre: string;
  email: string;
  identificacion: string;
  programa_nombre: string;
}

export interface CuestionarioInfo {
  id: number;
  titulo: string;
  descripcion: string;
}

export interface OpcionRespuesta {
  id: number;
  texto_opcion: string;
  es_correcta: boolean;
  imagen_opcion?: string;
  nombre_imagen_opcion?: string;
}

export interface RespuestaDetalle {
  pregunta_id: number;
  texto_pregunta: string;
  peso_pregunta: number;
  imagen_pregunta?: string;
  nombre_imagen_pregunta?: string;
  id_opcion_seleccionada: number;
  es_correcta: boolean;
  opciones: OpcionRespuesta[];
}

export interface EstadisticasRespuesta {
  fecha_respuesta: string;
  total_respondidas: number;
  total_preguntas: number;
  respuestas_correctas: number;
  puntaje_total: number;
  puntaje_obtenido: number;
  porcentaje: number;
}

export interface VerRespuestaData {
  estudiante: EstudianteInfo;
  cuestionario: CuestionarioInfo;
  estadisticas: EstadisticasRespuesta;
  respuestas: RespuestaDetalle[];
} 