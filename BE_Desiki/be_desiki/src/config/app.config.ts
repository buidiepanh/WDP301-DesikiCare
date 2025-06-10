export const AppConfig = () => ({
    appConfig: {
        APP_PORT: process.env.APP_PORT || 8000,
        BASE_URL: process.env.BASE_URL || 'http://localhost',
    }
  });
  