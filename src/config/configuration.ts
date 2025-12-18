export default () => ({
    // Application
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),

    // Swagger
    swagger: {
        enabled: process.env.SWAGGER_ENABLED === 'true',
    },

    // Database
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'reservation_user',
        password: process.env.DATABASE_PASSWORD || 'reservation_password',
        database: process.env.DATABASE_NAME || 'reservation_db',
        name: process.env.DATABASE_NAME || 'reservation_db',
    },

    // CORS
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
    },

    // Security (optional, for future use)
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
    },
});
