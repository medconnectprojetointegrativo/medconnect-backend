const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');

class LocaisAvaliacoesController {
    async buscarAvaliacao(req, res) {
        const { id_avaliacao_local } = req.params;
        const id = Number(id_avaliacao_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const avaliacao = await prisma.localAvaliacao.findUnique({
                where: { id_avaliacao_local: id }
            });

            if (!avaliacao) {
                return response.notFound(res, "Avaliação não encontrada.");
            }

            logger.info("Avaliação retornada com sucesso!");
            return response.success(res, "Avaliação encontrada com sucesso!", avaliacao);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> buscarAvaliacao()");
            return response.error(res, "Erro ao procurar a avaliação solicitada.");
        }
    }

    async buscarTodasAvaliacoesPorLocal(req, res) {
        const { id_local } = req.params;
        const id = Number(id_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador do local informado deve ser um número válido.");
        }

        try {
            const avaliacoes = await prisma.localAvaliacao.findMany({
                where: { id_local: id }
            });

            if (!avaliacoes || avaliacoes.length === 0) {
                return response.notFound(res, "Nenhuma avaliação encontrada para este local.");
            }

            logger.info("Avaliações listadas com sucesso!");
            return response.success(res, "Avaliações recuperadas com sucesso!", avaliacoes);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> buscarTodasAvaliacoesPorLocal()");
            return response.error(res, "Erro ao listar as avaliações do local.");
        }
    }

    async cadastrarAvaliacao(req, res) {
        const { id_local, id_usuario, valor_avaliacao, comentario } = req.body;

        if (!id_local || !id_usuario || valor_avaliacao === undefined) {
            return response.error(res, "Os campos 'id_local', 'id_usuario' e 'valor_avaliacao' são obrigatórios.");
        }

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novaAvaliacao = await tx.localAvaliacao.create({
                    data: {
                        id_local: Number(id_local),
                        id_usuario: Number(id_usuario),
                        valor_avaliacao: Number(valor_avaliacao),
                        comentario: comentario ?? null
                    }
                });
                return { avaliacao: novaAvaliacao };
            });

            logger.info("Avaliação criada com sucesso!");
            return response.created(res, "Avaliação registada com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> criarAvaliacao()");
            return response.error(res, "Falha ao registar a avaliação. Nenhuma alteração foi gravada.");
        }
    }

    async atualizarAvaliacao(req, res) {
        const { id_avaliacao_local } = req.params;
        const { valor_avaliacao, comentario } = req.body;
        const id = Number(id_avaliacao_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const avaliacaoExistente = await prisma.localAvaliacao.findUnique({
                where: { id_avaliacao_local: id }
            });

            if (!avaliacaoExistente) {
                return response.notFound(res, "Avaliação não encontrada para atualização.");
            }

            const resultado = await prisma.$transaction(async (tx) => {
                const avaliacaoAtualizada = await tx.localAvaliacao.update({
                    where: { id_avaliacao_local: id },
                    data: {
                        valor_avaliacao: valor_avaliacao !== undefined ? Number(valor_avaliacao) : undefined,
                        comentario: comentario !== undefined ? comentario : undefined
                    }
                });
                return { avaliacao: avaliacaoAtualizada };
            });

            logger.info("Avaliação atualizada com sucesso!");
            return response.created(res, "Avaliação atualizada com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> atualizarAvaliacao()");
            return response.error(res, "Falha ao atualizar a avaliação. Nenhuma alteração foi gravada.");
        }
    }

    async excluirAvaliacao(req, res) {
        const { id_avaliacao_local } = req.params;
        const id = Number(id_avaliacao_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const avaliacaoExistente = await prisma.localAvaliacao.findUnique({
                where: { id_avaliacao_local: id }
            });

            if (!avaliacaoExistente) {
                return response.notFound(res, "Avaliação não encontrada para exclusão.");
            }

            await prisma.$transaction(async (tx) => {
                await tx.locais_avaliacao.delete({
                    where: { id_avaliacao_local: id }
                });
            });

            logger.info("Avaliação excluída com sucesso!");
            return response.success(res, "Avaliação removida com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> excluirAvaliacao()");
            return response.serverError(res, "Erro ao eliminar a avaliação solicitada.");
        }
    }
}

module.exports = new LocaisAvaliacoesController();