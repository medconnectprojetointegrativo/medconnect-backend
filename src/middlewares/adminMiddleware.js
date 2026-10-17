const response = require('../utils/response');

/**
 * Middleware para restringir o acesso apenas a usuários com perfil de Admin.
 * Deve ser chamado SEMPRE após o authMiddleware.
 */

const nomeFuncaoAdmin = "ADMIN"

function adminMiddleware(req, res, next) {
    // 1. Garante que o authMiddleware rodou antes
    if (!req.dadosUsuario) {
        return response.unauthorized("Acesso negado. Realize o login para verificação do usuário.")
    }

    // 2. Valida o cargo/papel do usuário
    // Ajuste o campo conforme seu schema (ex: req.user.funcao, req.user.role, etc.)
    const role = req.dadosUsuario.funcao

    if (role !== nomeFuncaoAdmin) {
        return response.forbidden(res, "Acesso restrito.")
    }

    return next();
}

module.exports = adminMiddleware;