const { loadEnvFile } = require('node:process');
loadEnvFile();

const app = require('./src/app.js');
const logger = require('./src/utils/logger.js');
const prisma = require('./src/config/prismaClient.js');
const inicializarPastasArmazenamento = require("./src/utils/initStorage.js");

async function startServer() {
    try {
        logger.info("MedConnect - Back-End");

        await prisma.$connect();

        await prisma.$queryRaw`SELECT 1`;

        logger.info("Prisma conectado ao banco de dados com sucesso!");

        inicializarPastasArmazenamento();

        const port = process.env.BACKEND_PORT || 3000;

        app.listen(port, () => {
            logger.info(`Servidor online! Back-end disponível na porta: ${port}`);

            if (process.env.AMBIENTE === "DESENVOLVIMENTO") {
                logger.info(`Documentação da API disponível em: http://localhost:${port}/api/docs`);
            }
        });

    } catch (error) {
        logger.error(
            {
                mensagem: error.message,
                codigo: error.code || error.cause?.code,
                stack: error.stack
            },
            "Falha crítica: Não foi possível conectar ao banco de dados."
        );

        await prisma.$disconnect().catch(() => { });
        process.exit(1);
    }
}

startServer();