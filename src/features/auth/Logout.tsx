import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { navigateWithLoading } from '../../utils/navigation';
import styles from './Logout.module.css';

const Logout = () => {
  useEffect(() => {
    const cerrarSesion = async () => {
      try {
        // Mostrar loader inicial
        await Swal.fire({
          title: 'Cerrando sesión',
          html: `
            <div class="${styles.logoutLoader}">
              <div class="${styles.spinner}"></div>
              <p>Cerrando su sesión de forma segura...</p>
            </div>
          `,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          timer: 1000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Llamada al backend
        const response = await fetch('http://localhost/cuestionario-api/logout_controller.php', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Error al cerrar sesión');
        }

        // Limpiar localStorage
        localStorage.removeItem('usuario');
        
        // Mostrar mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Hasta pronto!',
          text: 'Sesión cerrada correctamente',
          timer: 1500,
          timerProgressBar: true,
          showConfirmButton: false
        });

        // Usar navigateWithLoading para la redirección
        navigateWithLoading('/login');
      } catch (error) {
        console.error('Error cerrando sesión:', error);
        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo cerrar la sesión correctamente',
          showConfirmButton: true
        });
        // En caso de error, también usar navigateWithLoading
        navigateWithLoading('/login');
      }
    };

    cerrarSesion();
  }, []);

  return null;
};

export default Logout;
