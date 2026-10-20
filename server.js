const { loadEnvFile } = require('node:process');
loadEnvFile();

const app = require('./src/app.js');
const logger = require('./src/utils/logger.js');
const prisma = require('./src/config/prismaClient.js');
const inicializarPastasArmazenamento = require("./src/utils/inicializarArmazenamento.js");

async function iniciarServidor() {
    try {
        logger.info("MedConnect - Back-End");

        await prisma.$connect();

        await prisma.$queryRaw`SELECT 1`;

        logger.info("Prisma conectado ao banco de dados com sucesso!");

        inicializarPastasArmazenamento();

        const porta = process.env.PORTA_BACKEND || 3000;

        app.listen(porta, () => {
            logger.info(`Servidor online! Back-end disponível na porta: ${porta}`);

            if (process.env.AMBIENTE === "DESENVOLVIMENTO") {
                logger.info(`Documentação da API disponível em: http://localhost:${porta}/api/docs`);
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

iniciarServidor();