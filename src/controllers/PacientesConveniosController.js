const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');

class PacientesConveniosController {
    async vincularConvenio(req, res) {
        const { id_paciente } = req.params;
        const { id_plano, numero_carteirinha, data_validade, id_paciente_titular, ativo } = req.body;
        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoVinculo = await tx.pacienteConvenio.create({
                    data: {
                        id_paciente: Number(id_paciente),
                        id_plano: Number(id_plano),
                        numero_carteirinha,
                        data_validade: data_validade ? new Date(data_validade) : null,
                        id_paciente_titular: id_paciente_titular ? Number(id_paciente_titular) : null,
                        ativo
                    }
                });
                return { vinculo: novoVinculo };
            });
            logger.info("Vínculo com convênio criado com sucesso!");
            return response.created(res, "Vínculo criado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacienteConveniosController -> vincularConvenio()");

            return response.error(res, "Falha ao criar vínculo com convênio.");
        }
    }

    async atualizarVinculo(req, res) {
        const { id_convenio_paciente } = req.params;
        const { numero_carteirinha, data_validade, ativo } = req.body;

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const vinculoAtualizado = await tx.pacienteConvenio.update({
                    where: { id_convenio_paciente: Number(id_convenio_paciente) },
                    data: {
                        numero_carteirinha,
                        data_validade: data_validade ? new Date(data_validade) : undefined,
                        ativo
                    }
                });
                return { vinculo: vinculoAtualizado };
            });
            logger.info("Vínculo atualizado com sucesso!");

            return response.created(res, "Vínculo atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacienteConveniosController -> atualizarVinculo()");

            return response.error(res, "Falha ao atualizar o vínculo.");
        }
    }

    async excluirVinculo(req, res) {
        const { id_convenio_paciente } = req.params;
        try {
            await prisma.$transaction(async (tx) => {
                await tx.pacienteConvenio.delete({ where: { id_convenio_paciente: Number(id_convenio_paciente) } });
            });
            logger.info("Vínculo excluído com sucesso!");

            return response.success(res, "Vínculo excluído com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacienteConveniosController -> excluirVinculo()");

            return response.serverError(res, "Falha ao deletar o vínculo.");
        }
    }
}
module.exports = new PacientesConveniosController();