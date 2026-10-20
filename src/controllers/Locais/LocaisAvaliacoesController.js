const prisma = require('../../config/prismaClient');
const logger = require('../../utils/logger');
const resposta = require('../../utils/resposta');

class LocaisAvaliacoesController {
    async buscarAvaliacao(req, res) {
        const { id_avaliacao_local } = req.params;
        const id = Number(id_avaliacao_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const avaliacao = await prisma.localAvaliacao.findUnique({
                where: { id_avaliacao_local: id }
            });

            if (!avaliacao) {
                return resposta.notFound(res, "Avaliação não encontrada.");
            }

            logger.info("Avaliação retornada com sucesso!");
            return resposta.success(res, "Avaliação encontrada com sucesso!", avaliacao);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> buscarAvaliacao()");
            return resposta.error(res, "Erro ao procurar a avaliação solicitada.");
        }
    }

    async buscarTodasAvaliacoesPorLocal(req, res) {
        const { id_local } = req.params;
        const id = Number(id_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador do local informado deve ser um número válido.");
        }

        try {
            const avaliacoes = await prisma.localAvaliacao.findMany({
                where: { id_local: id }
            });

            if (!avaliacoes || avaliacoes.length === 0) {
                return resposta.notFound(res, "Nenhuma avaliação encontrada para este local.");
            }

            logger.info("Avaliações listadas com sucesso!");
            return resposta.success(res, "Avaliações recuperadas com sucesso!", avaliacoes);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> buscarTodasAvaliacoesPorLocal()");
            return resposta.error(res, "Erro ao listar as avaliações do local.");
        }
    }

    async cadastrarAvaliacao(req, res) {
        const { id_local, id_usuario, valor_avaliacao, comentario } = req.body;

        if (!id_local || !id_usuario || valor_avaliacao === undefined) {
            return resposta.error(res, "Os campos 'id_local', 'id_usuario' e 'valor_avaliacao' são obrigatórios.");
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
            return resposta.created(res, "Avaliação registada com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> criarAvaliacao()");
            return resposta.error(res, "Falha ao registar a avaliação. Nenhuma alteração foi gravada.");
        }
    }

    async atualizarAvaliacao(req, res) {
        const { id_avaliacao_local } = req.params;
        const { valor_avaliacao, comentario } = req.body;
        const id = Number(id_avaliacao_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const avaliacaoExistente = await prisma.localAvaliacao.findUnique({
                where: { id_avaliacao_local: id }
            });

            if (!avaliacaoExistente) {
                return resposta.notFound(res, "Avaliação não encontrada para atualização.");
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
            return resposta.created(res, "Avaliação atualizada com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> atualizarAvaliacao()");
            return resposta.error(res, "Falha ao atualizar a avaliação. Nenhuma alteração foi gravada.");
        }
    }

    async excluirAvaliacao(req, res) {
        const { id_avaliacao_local } = req.params;
        const id = Number(id_avaliacao_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const avaliacaoExistente = await prisma.localAvaliacao.findUnique({
                where: { id_avaliacao_local: id }
            });

            if (!avaliacaoExistente) {
                return resposta.notFound(res, "Avaliação não encontrada para exclusão.");
            }

            await prisma.$transaction(async (tx) => {
                await tx.locais_avaliacao.delete({
                    where: { id_avaliacao_local: id }
                });
            });

            logger.info("Avaliação excluída com sucesso!");
            return resposta.success(res, "Avaliação removida com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacaoController -> excluirAvaliacao()");
            return resposta.serverError(res, "Erro ao eliminar a avaliação solicitada.");
        }
    }

    async calcularMediaAvaliacoesPorLocal(req, res) {
        const { id_local } = req.params;
        const id = Number(id_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador do local informado deve ser um número válido.");
        }

        try {
            const agregacao = await prisma.localAvaliacao.aggregate({
                where: { id_local: id },
                _avg: {
                    valor_avaliacao: true
                },
                _count: {
                    valor_avaliacao: true
                }
            });

            const totalAvaliacoes = agregacao._count.valor_avaliacao;
            const mediaAvaliacao = agregacao._avg.valor_avaliacao;

            if (totalAvaliacoes === 0 || mediaAvaliacao === null) {
                return resposta.notFound(res, "Nenhuma avaliação encontrada para calcular a média deste local.");
            }

            const resultado = {
                id_local: id,
                total_avaliacoes: totalAvaliacoes,
                media_avaliacao: Number(mediaAvaliacao.toFixed(1)) // Arredonda para 1 casa decimal (ex: 4.5)
            };

            logger.info("Média de avaliações calculada com sucesso!");
            return resposta.success(res, "Média de avaliações calculada com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisAvaliacoesController -> calcularMediaAvaliacoesPorLocal()");
            return resposta.error(res, "Erro ao calcular as avaliações do local.");
        }
    }
}

module.exports = new LocaisAvaliacoesController();