// 1. Importar herramientas de Vue Test Utils y Pinia Testing
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import { useAuthStore } from '@/stores/authStore';
import NavBar from '../NavBar.vue';

describe('NavBar.vue', () => {
  let wrapper;
  let authStore;

  // Función de configuración que se ejecuta antes de cada test
  beforeEach(() => {
    // 2. Montar el componente con la instancia de Pinia de Testing
    wrapper = mount(NavBar, {
      global: {
        plugins: [
          createTestingPinia({
            // Mockea todas las acciones de Pinia como vi.fn() automáticamente
            createSpy: vi.fn,
          }),
        ],
        // Mockear globalmente <router-link> para evitar errores de router
        stubs: {
            RouterLink: true,
        }
      },
    });
    // Obtener la instancia mockeada del store
    authStore = useAuthStore();
  });

  // Test 1: Comprobar el estado "No Autenticado"
  test('debe ocultar el email y el botón de Cerrar Sesión si no está autenticado', () => {
    // Establecer el estado inicial del store (Pinia Testing lo hace automáticamente si no se define)
    authStore.isAuthenticated = false;

    // Forzar la actualización del componente después de cambiar el estado del store
    // Aunque Pinia Testing normalmente maneja la reactividad, es buena práctica forzarlo si se manipula el estado directamente
    // await wrapper.vm.$nextTick();

    // Asertos
    expect(wrapper.text()).not.toContain('Cerrar Sesión');
    expect(wrapper.find('.navbar-text').exists()).toBe(false);
  });

  // Test 2: Comprobar la lógica de Cerrar Sesión
  test('debe mostrar el email del usuario y llamar a logoutUser al hacer clic en "Cerrar Sesión"', async () => {
    const userEmail = 'test@adweb.cl';

    // 3. Establecer el estado como autenticado para simular la vista logueada
    authStore.isAuthenticated = true;
    authStore.userEmail = userEmail; // Mockear el getter userEmail (si fuera un getter simple)
    // Para mockear el getter de verdad, puedes usar:
    // authStore.currentUserEmail = vi.fn().mockReturnValue(userEmail);

    // Forzar la actualización para reflejar el estado logueado
    await wrapper.vm.$nextTick();

    // Comprobar que el email se muestra
    expect(wrapper.find('.navbar-text').text()).toContain(userEmail);

    // 4. Simular el clic en el botón de logout
    const logoutButton = wrapper.find('button.btn-outline-light');
    await logoutButton.trigger('click');

    // 5. Asertar que la acción Pinia 'logoutUser' ha sido llamada
    // Recuerda que 'logoutUser' está mockeada con vi.fn() por @pinia/testing
    expect(authStore.logoutUser).toHaveBeenCalledTimes(1);
  });
});
