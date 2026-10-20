/* 
    logger.js
    Configuração do registrador de eventos (logger).
*/
const { loadEnvFile } = require('node:process');
loadEnvFile();

const pino = require('pino');

const ambienteDesenvolvimento = process.env.AMBIENTE !== 'PRODUÇÃO';

const logger = pino({
    level: 'info',
    ...(ambienteDesenvolvimento && {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:dd/mm/yyyy HH:MM:ss',
                ignore: 'pid,hostname',
            },
        },
    }),
});

module.exports = logger