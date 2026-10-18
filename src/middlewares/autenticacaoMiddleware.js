const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const response = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    logger.error('CRÍTICO: A variável de ambiente JWT_SECRET não está definida.');
    process.exit(1);
}

function autenticacaoMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return response.unauthorized(res, 'Token de autenticação não fornecido.');
    }

    const parts = authHeader.trim().split(/\s+/);

    if (parts.length !== 2) {
        logger.warn('Cabeçalho Authorization com formato incorreto.');
        return response.unauthorized(res, 'Formato do cabeçalho de autenticação inválido.');
    }

    const [scheme, token] = parts;

    // Garante que o esquema seja "Bearer" (insensível a maiúsculas/minúsculas)
    if (!/^Bearer$/i.test(scheme)) {
        logger.warn(`Esquema de autenticação não suportado: ${scheme}`);
        return response.unauthorized(res, 'Formato inválido. Esperado: Bearer <token>.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Injeta os dados do payload diretamente na requisição
        req.dadosUsuario = decoded;

        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.warn('Tentativa de acesso com token expirado.');
            return response.unauthorized(res, 'Token expirado. Faça login novamente.');
        }

        if (error.name === 'JsonWebTokenError') {
            logger.warn({ err: error.message }, 'Token JWT malformado ou com assinatura inválida.');
            return response.unauthorized(res, 'Token inválido.');
        }

        // Falhas inesperadas
        logger.error({ err: error }, 'Erro inesperado ao validar autenticação.');
        return response.unauthorized(res, 'Erro ao validar autenticação.');
    }
}

module.exports = autenticacaoMiddleware;