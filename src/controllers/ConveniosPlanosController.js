const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');

class ConveniosPlanosController {
    async criarPlano(req, res) {
        const { id_convenio, nome_plano } = req.body;
        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoPlano = await tx.convenioPlano.create({
                    data: { id_convenio: Number(id_convenio), nome_plano }
                });
                return { plano: novoPlano };
            });
            logger.info("Plano criado com sucesso!");

            return response.created(res, "Plano criado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: ConvenioPlanosController -> criarPlano()");

            return response.error(res, "Falha ao criar o plano.");
        }
    }

    async atualizarPlano(req, res) {
        const { id_plano_convenio } = req.params;
        const { nome_plano } = req.body;
        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const planoAtualizado = await tx.convenioPlano.update({
                    where: { id_plano_convenio: Number(id_plano_convenio) },
                    data: { nome_plano }
                });
                return { plano: planoAtualizado };
            });
            logger.info("Plano atualizado com sucesso!");

            return response.created(res, "Plano atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: ConvenioPlanosController -> atualizarPlano()");

            return response.error(res, "Falha ao atualizar o plano.");
        }
    }
}
module.exports = new ConveniosPlanosController();