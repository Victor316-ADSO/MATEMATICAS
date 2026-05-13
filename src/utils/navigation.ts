/**
 * Navigate to a new route with a loading screen
 * @param url The URL to navigate to
 */
export const navigateWithLoading = (url: string) => {
  // Navegación directa para evitar errores de SweetAlert2
  window.location.href = url;
}; 