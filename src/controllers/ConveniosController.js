const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');

class ConveniosController {
    async criarConvenio(req, res) {
        const { nome_operadora, registro_ans, ativo } = req.body;
        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoConvenio = await tx.convenio.create({
                    data: { nome_operadora, registro_ans, ativo }
                });
                return { convenio: novoConvenio };
            });
            logger.info("Convênio criado com sucesso!");

            return response.created(res, "Convênio criado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: ConveniosController -> criarConvenio()");

            return response.error(res, "Falha ao criar o convênio.");
        }
    }

    async atualizarConvenio(req, res) {
        const { id_convenio } = req.params;
        const { nome_operadora, registro_ans, ativo } = req.body;

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const convenioAtualizado = await tx.convenio.update({
                    where: { id_convenio: Number(id_convenio) },
                    data: { nome_operadora, registro_ans, ativo }
                });

                return { convenio: convenioAtualizado };
            });
            logger.info("Convênio atualizado com sucesso!");

            return response.created(res, "Convênio atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: ConveniosController -> atualizarConvenio()");

            return response.error(res, "Falha ao atualizar o convênio.");
        }
    }
}
module.exports = new ConveniosController();