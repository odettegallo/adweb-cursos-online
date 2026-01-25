// test/specs/login.spec.js

describe('Flujo de Autenticación - ADWEB Online', () => {
    it('debería mostrar error con credenciales inválidas', async () => {
        await browser.url('https://cursos-adweb-online.web.app/login'); // Ajusta el puerto si es necesario

        const emailInput = await $('#email');
        const passwordInput = await $('#password');
        const loginBtn = await $('button[type="submit"]');

        await emailInput.setValue('usuario_falso@test.com');
        await passwordInput.setValue('123456');
        await loginBtn.click();

        // Verificamos que aparezca el mensaje de error de Firebase o validación
        const errorAlert = await $('.alert-danger');
        await expect(errorAlert).toBeExisting();
        await expect(errorAlert).toHaveTextContaining('Error al iniciar sesión');
    });

    it('debería permitir el acceso mediante el botón de "Entrar como Admin (prueba)"', async () => {
        await browser.url('https://cursos-adweb-online.web.app/login');

        const quickAdminBtn = await $('.btn-outline-primary'); // Botón de acceso rápido admin
        await quickAdminBtn.click();

        // Al hacer click, el componente redirige a /home
        await expect(browser).toHaveUrlContaining('/home');

        // Verificar que la NavBar ahora es visible (ya que no estamos en /login)
        const navBar = await $('nav');
        await expect(navBar).toBeDisplayed();
    });

    it('debería validar que los campos son obligatorios', async () => {
        await browser.url('https://cursos-adweb-online.web.app/login');

        const loginBtn = await $('button[type="submit"]');
        await loginBtn.click();

        // El HTML5 validation o tus errores de data() deberían activarse
        const emailError = await $('.invalid-feedback');
        await expect(emailError).toBeDisplayed();
    });
});
