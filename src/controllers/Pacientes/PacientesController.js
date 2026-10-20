const prisma = require('../../config/prismaClient');
const logger = require('../../utils/logger');
const resposta = require('../../utils/resposta');

class PacientesController {
    async buscarPaciente(req, res) {
        const { id_paciente } = req.params;

        try {
            const paciente = await prisma.paciente.findUnique({
                where: { id_paciente: Number(id_paciente) },
                include: {
                    documentos: true,
                    conveniosUso: true,
                    vacinacoes: true,
                    procedimentos: true
                }
            });
            if (!paciente) return resposta.notFound(res, "Paciente não encontrado.");

            logger.info("Paciente retornado com sucesso!");

            return resposta.success(res, "Paciente encontrado com sucesso!", paciente);
        } catch (err) {
            logger.error({ err }, "Erro ao executar: PacientesController -> buscarPaciente()");

            return resposta.error(res, "Erro ao buscar o paciente solicitado.");
        }
    }

    async buscarTodosPacientes(req, res) {
        try {
            const pacientes = await prisma.paciente.findMany({
                include: { documentos: true, conveniosUso: true }
            });
            if (!pacientes || pacientes.length === 0) return resposta.notFound(res, "Pacientes não encontrados.");

            logger.info("Pacientes retornados com sucesso!");

            return resposta.success(res, "Pacientes encontrados com sucesso!", pacientes);
        } catch (err) {
            logger.error({ err }, "Erro ao executar: PacientesController -> buscarTodosPacientes()");

            return resposta.error(res, "Erro ao buscar os pacientes solicitados.");
        }
    }

    async criarPaciente(req, res) {
        const { id_usuario, nome, sobrenome, cpf, data_nascimento, numero_contato } = req.body;

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoPaciente = await tx.paciente.create({
                    data: {
                        id_usuario: id_usuario ? Number(id_usuario) : null,
                        nome,
                        sobrenome,
                        cpf,
                        data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
                        numero_contato
                    }
                });
                return { paciente: novoPaciente };
            });

            logger.info("Paciente criado com sucesso!");

            return resposta.created(res, "Paciente criado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacientesController -> criarPaciente()");

            return resposta.error(res, "Falha ao criar o paciente. Nenhuma alteração foi salva.");
        }
    }

    async atualizarPaciente(req, res) {
        const { id_paciente } = req.params;
        const { nome, sobrenome, data_nascimento, numero_contato } = req.body;

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const pacienteAtualizado = await tx.paciente.update({
                    where: { id_paciente: Number(id_paciente) },
                    data: {
                        nome,
                        sobrenome,
                        data_nascimento: data_nascimento ? new Date(data_nascimento) : undefined,
                        numero_contato
                    }
                });
                return { paciente: pacienteAtualizado };
            });

            logger.info("Paciente atualizado com sucesso!");

            return resposta.created(res, "Paciente atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacientesController -> atualizarPaciente()");

            return resposta.error(res, "Falha ao atualizar o paciente. Nenhuma alteração foi salva.");
        }
    }

    async excluirPaciente(req, res) {
        const { id_paciente } = req.params;

        try {
            const paciente = await prisma.paciente.findUnique({ where: { id_paciente: Number(id_paciente) } });

            if (!paciente) return resposta.notFound(res, "Paciente não encontrado.");

            await prisma.$transaction(async (tx) => {
                await tx.paciente.delete({ where: { id_paciente: Number(id_paciente) } });
            });

            logger.info("Paciente excluído com sucesso!");

            return resposta.success(res, "Paciente e dependências excluídos com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacientesController -> excluirPaciente()");

            return resposta.serverError(res, "Falha ao excluir o paciente.");
        }
    }
}
module.exports = new PacientesController();