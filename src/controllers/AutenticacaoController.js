const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN


class AutenticacaoController {
    async login(req, res) {
        try {
            const { login, senha } = req.body;

            if (!login || !senha) {
                return response.error(res, "Informe um e-mail e senha.");
            }

            const usuario = await prisma.usuario.findFirst({
                where: { login: login },
            });

            if (!usuario) return response.unauthorized("Usuário ou senhas inválidos.")

            const isPasswordValid = await bcrypt.compare(senha, usuario.senha_hash);
            if (!isPasswordValid) {
                return response.unauthorized(res, "Usuário ou senhas inválidos.")
            }

            // Geração do token JWT
            const token = jwt.sign(
                { id: usuario.id_usuario, login: usuario.login, email: usuario.email, funcao: usuario.funcao },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            logger.info(`Usuário ${usuario.id_usuario} autenticado com sucesso!`);
            return response.success(res, "Login realizado com sucesso.", { token, id_usuario: usuario.id_usuario })
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: AutenticacaoController -> login() ")

            return response.serverError(res, "Falha ao realizar login.");
        }
    }
};

module.exports = new AutenticacaoController();