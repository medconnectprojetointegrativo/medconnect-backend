const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');
const password = require('../utils/password');


class UsuariosController {
    async buscarUsuario(req, res) {
        const { id_usuario } = req.params;

        try {
            const usuarios = await prisma.usuario.findUnique(
                {
                    where: {
                        id_usuario: Number(id_usuario)
                    },
                    include: {
                        pacientes: true,
                        profissionais: true,
                    }
                }
            );

            if (!usuarios || usuarios.length === 0) return response.notFound(res, "Usuário não encontrado.");

            logger.info("Usuário retornado com sucesso!");
            return response.success(res, "Usuário encontrado com sucesso!", usuarios);
        } catch (err) {
            logger.error({ err }, "Erro ao executar: UsuariosController -> buscarUsuario() ")

            return response.error(res, "Erro ao buscar o usuário solicitado.");
        }
    }

    async buscarTodosUsuarios(req, res) {
        try {
            const usuarios = await prisma.usuario.findMany(
                {
                    include: {
                        pacientes: true,
                        profissionais: true
                    }
                }
            );

            if (!usuarios || usuarios.length === 0) return response.notFound(res, "Usuários não encontrados.");

            logger.info("Usuários retornados com sucesso!");
            return response.success(res, "Usuários encontrados com sucesso!", usuarios);
        } catch (err) {
            logger.error({ err }, "Erro ao executar: UsuariosController -> buscarTodosUsuario() ")

            return response.error(res, "Erro ao buscar os usuários solicitados.");
        }
    }

    // Cria o usuário e o paciente vinculado ao usuário
    async criarUsuarioPaciente(req, res) {
        const { login, email, senha, nome, sobrenome, data_nascimento, numero_contato } = req.body;

        try {
            const senha_hash = await password.hashPassword(senha);

            const resultado = await prisma.$transaction(async (tx) => {

                const novoUsuario = await tx.usuario.create({
                    data: { login, email, senha_hash, funcao: 'PACIENTE' }
                });

                const novoPaciente = await tx.paciente.create({
                    data: {
                        id_usuario: novoUsuario.id_usuario,
                        nome,
                        sobrenome,
                        cpf: novoUsuario.login,
                        data_nascimento: new Date(data_nascimento),
                        numero_contato
                    }
                });

                return { usuario: novoUsuario, paciente: novoPaciente };
            });

            logger.info("Usuário e perfil criados com sucesso!");
            return response.created(res, "Usuário e perfil criados com sucesso!", resultado);

        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: UsuariosController -> criarUsuarioPaciente() ")

            return response.error(res, "Falha ao criar o cadastro completo. Nenhuma alteração foi salva.");
        }
    }

    // Cria o usuário e o profissional vinculado ao usuário
    async criarUsuarioProfissional(req, res) {
        const { login, email, senha, nome, sobrenome, data_nascimento, numero_contato } = req.body;

        try {
            const senha_hash = await password.hashPassword(senha);

            const resultado = await prisma.$transaction(async (tx) => {

                const novoUsuario = await tx.usuario.create({
                    data: { login, email, senha_hash, funcao: 'PROFISSIONAL' }
                });

                const novoProfisssional = await tx.profissional.create({
                    data: {
                        id_usuario: novoUsuario.id_usuario,
                        nome,
                        sobrenome,
                        cpf: novoUsuario.login,
                        data_nascimento: new Date(data_nascimento),
                    }
                });

                return { usuario: novoUsuario, paciente: novoProfisssional };
            });

            logger.info("Usuário e perfil criados com sucesso!")
            return response.created(res, "Usuário e perfil criados com sucesso!", resultado);

        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: UsuariosController -> criarUsuarioProfissional() ")

            return response.error(res, "Falha ao criar o cadastro completo. Nenhuma alteração foi salva.");
        }
    }

    async atualizarUsuario(req, res) {
        const { id_usuario } = req.params;
        const { email, senha } = req.body;

        try {
            const senha_hash = await password.hashPassword(senha);

            const resultado = await prisma.$transaction(async (tx) => {

                const usuarioAtualizado = await tx.usuario.update({
                    where: { id_usuario: Number(id_usuario) },
                    data: { email, senha_hash }
                });

                return { usuario: usuarioAtualizado };
            });

            logger.info("Usuário atualizado com sucesso!");
            return response.created(res, "Usuário atualizado com sucesso!", resultado);

        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: UsuariosController -> atualizarUsuario() ")

            return response.error(res, "Falha ao atualizar o usuário. Nenhuma alteração foi salva.");
        }
    }

    async excluirUsuario(req, res) {
        const { id_usuario } = req.params;

        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id_usuario: Number(id_usuario) }
            });

            if (!usuario) return response.notFound(res, "Usuário não encontrado.");

            await prisma.$transaction(async (tx) => {
                await tx.usuario.delete({
                    where: { id_usuario: Number(id_usuario) }
                });
            });

            logger.info("Usuário excluído com sucesso!");
            return response.success(res, "Usuário e dependências excluídas com sucesso!");

        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: UsuariosController -> excluirUsuario()");

            return response.serverError(res, "Falha ao deletar o usuário.");
        }
    }


}

module.exports = new UsuariosController;