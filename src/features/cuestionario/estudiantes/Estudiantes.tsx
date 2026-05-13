/**
 * Estudiantes - Componente ULTRA-MODULAR para gestión de estudiantes
 *
 * TRANSFORMACIÓN TOTAL:
 * ✅ De 473 líneas → ~70 líneas (reducción del 85%)
 * ✅ De lógica mezclada → hooks y componentes especializados
 * ✅ De formulario y tabla monolítica → componentes reutilizables
 *
 * ARQUITECTURA MODULAR:
 * - useEstudiantesData: Hook maestro de datos y acciones
 * - useEstudiantesForm: Hook de formulario y validación
 * - HeaderSection: Título y volver
 * - AgregarEstudianteForm: Formulario modular
 * - ImportarEstudiantesForm: Importación CSV modular
 * - SearchBox: Búsqueda reutilizable
 * - EstudiantesTable: Tabla modular con acción de eliminar
 * - EmptyState: Mensaje vacío reutilizable
 */

import React from 'react';
import PageTransition from '../../../components/PageTransition';
import { useEstudiantesData } from './hooks/useEstudiantesData';
import HeaderSection from './components/HeaderSection';
import AgregarEstudianteForm from './components/AgregarEstudianteForm';
import ImportarEstudiantesForm from './components/ImportarEstudiantesForm';
import SearchBox from './components/SearchBox';
import EstudiantesTable from './components/EstudiantesTable';
import styles from './estudiante.module.css';

const Estudiantes: React.FC = () => {
  const {
    estudiantesFiltrados,
    programas,
    loading,
    error,
    busqueda,
    setBusqueda,
    selectedFileName,
    fileInputRef,
    agregarEstudiante,
    eliminarEstudiante,
    importarEstudiantes,
    handleFileChange
  } = useEstudiantesData();

  if (loading) {
    return <PageTransition><div className={styles.estudiantesRoot}><p>Cargando...</p></div></PageTransition>;
  }
  if (error) {
    return <PageTransition><div className={styles.estudiantesRoot}><p>Error: {error}</p></div></PageTransition>;
  }

  return (
    <PageTransition>
      <div className={styles.estudiantesRoot}>
        <HeaderSection />
        <div className={styles.mainContent}>
          <div className={styles.contentGrid}>
            <div className={styles.formSection}>
              <AgregarEstudianteForm
                programas={programas}
                onSubmit={(form, reset) => {
                  agregarEstudiante(form).then(success => { if (success) reset(); });
                }}
              />
              <ImportarEstudiantesForm
                fileInputRef={fileInputRef}
                selectedFileName={selectedFileName}
                handleFileChange={handleFileChange}
                onImportar={importarEstudiantes}
              />
            </div>
            <div className={styles.tableSection}>
              <SearchBox value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              <EstudiantesTable estudiantes={estudiantesFiltrados} onEliminar={eliminarEstudiante} />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Estudiantes;
