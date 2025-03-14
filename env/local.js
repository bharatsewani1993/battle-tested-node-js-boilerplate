module.exports = {
    STAGE: 'LOCAL',
    PORT: 3000,
    DATABASE_NAME: 'boilerplate',
    DATABASE_USER: 'root',
    DATABASE_PASSWORD: 'Qwerty@123',
    DATABASE_HOST: '127.0.0.1',
    LOGGING: false,
    DIALECT: 'mysql',
    DB_ALTER: { alter: true },
    JWT_SECRET_KEY: '',
    LEVEL: 0, //set compression level..
    LOCAL_UPLOAD_FOLDER: './uploads',
    SENDGRID_API_KEY: '',
    FROM_EMAIL: '',
    FROM_NAME: '',
    SUBDOMAIN_LENGTH: '5',
    FREE_DOMAIN: '',
    CRON_ENABLED: false,
    DOMAIN_VERIFICATION_TOKEN_SIZE: 16,
    SYSTEM_ADMIN_EMAIL: '',
    ZIP_UPLOAD_FOLDER: '/dev-uploads',
    ZIP_EXTRACT_FOLDER: '/dev-websites/',
    STATIC_MAX_AGE: 1,
    OPEN_AI_API_KEY: '',
    MAX_API_LIMIT: 99999,
    API_LIMIT_WINDOW: 30000,
    S3_BUCKET_REGION: '',
    S3_BUCKET_ACCESS_ID: '',
    S3_BUCKET_SECRET_KEY: '',
    S3_BUCKET_NAME: '',
    PROJECT_REPO_NAME: '',
    FILE_UPLOAD_PATH: 'Dubninja/Dev/uploads'
}