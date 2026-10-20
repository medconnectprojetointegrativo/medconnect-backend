const prisma = require('../../config/prismaClient');
const logger = require('../../utils/logger');
const resposta = require('../../utils/resposta');

class LocaisTiposContatosController {
    async buscarTipoContato(req, res) {
        const { id_tipo_contato_local } = req.params;
        const id = Number(id_tipo_contato_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const tipoContato = await prisma.localTipoContato.findUnique({
                where: { id_tipo_contato_local: id }
            });

            if (!tipoContato) {
                return resposta.notFound(res, "Tipo de contacto não encontrado.");
            }

            logger.info("Tipo de contacto retornado com sucesso!");
            return resposta.success(res, "Tipo de contacto encontrado com sucesso!", tipoContato);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisTiposContatosController -> buscarTipoContato()");
            return resposta.error(res, "Erro ao procurar o tipo de contacto.");
        }
    }

    async buscarTodosTiposContatos(req, res) {
        try {
            const tipos = await prisma.localTipoContato.findMany();

            if (!tipos || tipos.length === 0) {
                return resposta.notFound(res, "Nenhum tipo de contacto encontrado.");
            }

            logger.info("Tipos de contacto listados com sucesso!");
            return resposta.success(res, "Tipos de contacto recuperados com sucesso!", tipos);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisTiposContatosController -> buscarTodosTiposContatos()");
            return resposta.error(res, "Erro ao listar os tipos de contacto.");
        }
    }

    async cadastrarTipoContato(req, res) {
        const { tipo } = req.body;

        if (!tipo) {
            return resposta.error(res, "O tipo do contato é obrigatório.");
        }

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoTipo = await tx.localTipoContato.create({
                    data: {
                        tipo
                    }
                });
                return { tipo_contato: novoTipo };
            });

            logger.info("Tipo de contacto criado com sucesso!");
            return resposta.created(res, "Tipo de contacto criado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisTiposContatosController -> criarTipoContato()");
            return resposta.error(res, "Falha ao criar o tipo de contacto. Nenhuma alteração foi gravada.");
        }
    }

    async atualizarTipoContato(req, res) {
        const { id_tipo_contato_local } = req.params;
        const { tipo } = req.body;
        const id = Number(id_tipo_contato_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const tipoExistente = await prisma.localTipoContato.findUnique({
                where: { id_tipo_contato_local: id }
            });

            if (!tipoExistente) {
                return resposta.notFound(res, "Tipo de contacto não encontrado para atualização.");
            }

            const resultado = await prisma.$transaction(async (tx) => {
                const tipoAtualizado = await tx.localTipoContato.update({
                    where: { id_tipo_contato_local: id },
                    data: {
                        tipo: tipo !== undefined ? tipo : undefined,
                    }
                });
                return { tipo_contato: tipoAtualizado };
            });

            logger.info("Tipo de contacto atualizado com sucesso!");
            return resposta.created(res, "Tipo de contacto atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisTiposContatosController -> atualizarTipoContato()");
            return resposta.error(res, "Falha ao atualizar o tipo de contacto. Nenhuma alteração foi gravada.");
        }
    }

    async excluirTipoContato(req, res) {
        const { id_tipo_contato_local } = req.params;
        const id = Number(id_tipo_contato_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const tipoExistente = await prisma.localTipoContato.findUnique({
                where: { id_tipo_contato_local: id }
            });

            if (!tipoExistente) {
                return resposta.notFound(res, "Tipo de contacto não encontrado para exclusão.");
            }

            await prisma.$transaction(async (tx) => {
                await tx.locais_tipos_contatos.delete({
                    where: { id_tipo_contato_local: id }
                });
            });

            logger.info("Tipo de contacto excluído com sucesso!");
            return resposta.success(res, "Tipo de contacto removido com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisTiposContatosController -> excluirTipoContato()");
            return resposta.serverError(res, "Erro ao eliminar o tipo de contacto solicitado.");
        }
    }
}

module.exports = new LocaisTiposContatosController();