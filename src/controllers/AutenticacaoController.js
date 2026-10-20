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

    async validarToken(req, res) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return response.unauthorized(res, "Token não fornecido.");
            }

            const parts = authHeader.split(" ");
            if (parts.length !== 2 || parts[0] !== "Bearer") {
                return response.unauthorized(res, "Formato do token inválido.");
            }

            const token = parts[1];

            // 1. Validação da assinatura e expiração com a chave secreta
            let decoded;
            try {
                decoded = jwt.verify(token, JWT_SECRET);
            } catch (err) {
                if (err.name === "TokenExpiredError") {
                    return response.unauthorized(res, "Sessão expirada. Faça login novamente.");
                }
                return response.unauthorized(res, "Token inválido.");
            }

            // 2. Busca os dados atualizados no banco a partir do payload descriptografado/decodificado
            const usuario = await prisma.usuario.findUnique({
                where: { id_usuario: Number(decoded.id) },
                select: {
                    id_usuario: true,
                    login: true,
                    email: false,
                    funcao: true,
                    // Garante que o hash da senha nunca seja retornado
                    senha_hash: false,
                    pacientes: {
                        select: {
                            id_paciente: true,
                        },
                    },
                },
            });

            if (!usuario) {
                return response.notFound(res, "Usuário não encontrado.");
            }

            let id_paciente = null;
            if (usuario.funcao === "PACIENTE") {
                const paciente = await prisma.paciente.findFirst({
                    where: { id_usuario: usuario.id_usuario },
                    select: {
                        id_paciente: true, id_usuario: false,
                        documentos: false,
                        conveniosUso: false,
                        vacinacoes: false,
                        procedimentos: false
                    },
                });

                if (paciente) {
                    id_paciente = paciente.id_paciente;
                }
            }

            const usuarioFormatado = {
                id_usuario: usuario.id_usuario,
                login: usuario.login,
                funcao: usuario.funcao,
                id_paciente: id_paciente || null,
            };

            logger.info(`Token do usuário ${usuarioFormatado.id_usuario} validado com sucesso!`);
            return response.success(res, "Sessão ativa e válida.", usuarioFormatado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: AutenticacaoController -> validarToken()");
            return response.serverError(res, "Falha ao validar a sessão do usuário.");
        }
    }
};

module.exports = new AutenticacaoController();