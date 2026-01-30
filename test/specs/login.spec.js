describe('Funcionalidad de Login - ADWEB Online', () => {

    beforeEach(async () => {
        // Accedemos a la URL base definida en wdio.conf.js
        await browser.url('/login');
    });

    it('debería mostrar error con credenciales inválidas', async () => {
        const emailInput = await $('#input-v-6');
        const passwordInput = await $('#input-v-9');
        const loginBtn = await $('button[type="submit"]');

        await emailInput.setValue('correo@falso.com');
        await passwordInput.setValue('123456');
        await loginBtn.click();

        // Esperamos a que aparezca la alerta de error que tienes en LoginView.vue
        const errorMessage = await $('.v-alert');
        await errorMessage.waitForDisplayed();

        await expect(errorMessage).toHaveText('Error al iniciar sesión. Verifica tus credenciales.');
    });

    it('debería iniciar sesión con éxito y redirigir a /home', async () => {
        const emailInput = await $('#input-v-6');
        const passwordInput = await $('#input-v-9');
        const loginBtn = await $('button[type="submit"]');

        // Usamos las variables del .env
        await emailInput.setValue(process.env.TEST_USER_EMAIL);
        await passwordInput.setValue(process.env.TEST_USER_PASSWORD);

        await loginBtn.click();

        // Verificamos que la URL cambie a /home tras el login exitoso
        await browser.waitUntil(
            async () => (await browser.getUrl()).includes('/home'),
            {
                timeout: 10000,
                timeoutMsg: 'No se redirigió a /home después de 10 segundos'
            }
        );

        const currentUrl = await browser.getUrl();
        await expect(currentUrl).toContain('/home');
    });

    it('debería validar que el campo email sea obligatorio (HTML5 validation)', async () => {
        const loginBtn = await $('button[type="submit"]');
        await loginBtn.click();

        const emailInput = await $('#input-v-6');
        // Verificamos si el campo es inválido mediante la pseudo-clase de CSS o el atributo
        const isRequired = await emailInput.getProperty('required');
        await expect(isRequired).toBe(true);
    });
});
