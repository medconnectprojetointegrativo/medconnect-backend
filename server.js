const { loadEnvFile } = require('node:process');
loadEnvFile();

const app = require('./src/app.js');
const logger = require('./src/utils/logger.js');
const prisma = require('./src/config/prismaClient.js');

async function startServer() {
    try {
        logger.info("💻️ MedConnect - Back-End 🖥️");

        await prisma.$connect();
        logger.info("✅ Prisma conectado ao banco de dados com sucesso! ✅ ");

        app.listen(process.env.BACKEND_PORT, logger.info(`✅ Servidor online! Back-end disponível na porta: ${process.env.BACKEND_PORT} ✅`));
    } catch (error) {
        logger.error({ error }, "🔴 Falha crítica: Prisma não conseguir conectar ao banco de dados. 🔴");
    }
}

startServer();

// console.log(`> 📚 Verifique a documentação da API em: ${process.env.ENVIRONMENT == 'PRD' ? `${process.env.BACKEND_PRD_URL}${process.env.API_DOCUMENTATION_ROUTE}` : `${process.env.DEV_DOMAIN}:${process.env.BACKEND_PORT}${process.env.API_DOCUMENTATION_ROUTE}`}`);

// console.log(`> 📚 Verifique a documentação do Banco de Dados em: ${process.env.ENVIRONMENT == 'PRD' ? `${process.env.BACKEND_PRD_URL}${process.env.DATABASE_DOCUMENTATION_ROUTE}` : `${process.env.DEV_DOMAIN}:${process.env.BACKEND_PORT}${process.env.DATABASE_DOCUMENTATION_ROUTE}`}`);
