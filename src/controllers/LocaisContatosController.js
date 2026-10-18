const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');

class LocaisContatosController {
    async buscarContato(req, res) {
        const { id_contato_local } = req.params;
        const id = Number(id_contato_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const contato = await prisma.localContato.findUnique({
                where: { id_contato_local: id }
            });

            if (!contato) {
                return response.notFound(res, "Contato não encontrado.");
            }

            logger.info("Contato retornado com sucesso!");
            return response.success(res, "Contato encontrado com sucesso!", contato);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisContatosController -> buscarContato()");
            return response.error(res, "Erro ao procurar o contato solicitado.");
        }
    }

    async buscarTodosContatosPorLocal(req, res) {
        const { id_local } = req.params;
        const id = Number(id_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador do local informado deve ser um número válido.");
        }

        try {
            const contatos = await prisma.localContato.findMany({
                where: { id_local: id }
            });

            if (!contatos || contatos.length === 0) {
                return response.notFound(res, "Nenhum contato encontrado para este estabelecimento.");
            }

            logger.info("Contatos listados com sucesso!");
            return response.success(res, "Contatos recuperados com sucesso!", contatos);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisContatosController -> buscarTodosContatosPorLocal()");
            return response.error(res, "Erro ao listar os contatos do local.");
        }
    }

    async cadastrarContato(req, res) {
        const { id_local, id_tipo_contato, numero_contato, descricao } = req.body;

        if (!id_local || !id_tipo_contato || !numero_contato || !descricao) {
            return response.error(res, "Os campos 'id_local', 'id_tipo_contato', 'numero_contato' e 'descricao' são obrigatórios.");
        }

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoContato = await tx.localContato.create({
                    data: {
                        id_local: Number(id_local),
                        id_tipo_contato: Number(id_tipo_contato),
                        numero_contato,
                        descricao
                    }
                });
                return { contato: novoContato };
            });

            logger.info("Contato criado com sucesso!");
            return response.created(res, "Contato registado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisContatosController -> criarContato()");
            return response.error(res, "Falha ao registar o contato. Nenhuma alteração foi gravada.");
        }
    }

    async atualizarContato(req, res) {
        const { id_contato_local } = req.params;
        const { id_local, id_tipo_contato, numero_contato, descricao } = req.body;
        const id = Number(id_contato_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const contatoExistente = await prisma.localContato.findUnique({
                where: { id_contato_local: id }
            });

            if (!contatoExistente) {
                return response.notFound(res, "Contato não localizado para atualização.");
            }

            const resultado = await prisma.$transaction(async (tx) => {
                const contatoAtualizado = await tx.locais_contatos.update({
                    where: { id_contato_local: id },
                    data: {
                        id_local: id_local !== undefined ? Number(id_local) : undefined,
                        id_tipo_contato: id_tipo_contato !== undefined ? Number(id_tipo_contato) : undefined,
                        numero_contato: numero_contato !== undefined ? numero_contato : undefined,
                        descricao
                    }
                });
                return { contato: contatoAtualizado };
            });

            logger.info("Contato atualizado com sucesso!");
            return response.created(res, "Contato atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisContatosController -> atualizarContato()");
            return response.error(res, "Falha ao atualizar o contato. Nenhuma alteração foi gravada.");
        }
    }

    async excluirContato(req, res) {
        const { id_contato_local } = req.params;
        const id = Number(id_contato_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const contatoExistente = await prisma.localContato.findUnique({
                where: { id_contato_local: id }
            });

            if (!contatoExistente) {
                return response.notFound(res, "Contato não encontrado para exclusão.");
            }

            await prisma.$transaction(async (tx) => {
                await tx.localContato.delete({
                    where: { id_contato_local: id }
                });
            });

            logger.info("Contato excluído com sucesso!");
            return response.success(res, "Contato removido com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisContatosController -> excluirContato()");
            return response.serverError(res, "Erro ao eliminar o contato solicitado.");
        }
    }
}

module.exports = new LocaisContatosController();