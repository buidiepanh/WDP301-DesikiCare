export const AppConfig = () => ({
    appConfig: {
        APP_PORT: process.env.APP_PORT || 8000,
        BASE_URL: process.env.BASE_URL || 'http://localhost',
    },
    imagePathConfig: {
        ACCOUNT_IMAGE_PATH: process.env.ACCOUNT_IMAGE_PATH,
        PRODUCT_IMAGE_PATH: process.env.PRODUCT_IMAGE_PATH,
        GAMEEVENT_IMAGE_PATH: process.env.GAMEEVENT_IMAGE_PATH,
    }
});
