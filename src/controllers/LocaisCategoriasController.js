const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');

class LocaisCategoriasController {
    /**
     * Procura uma categoria pelo ID.
     */
    async buscarCategoria(req, res) {
        const { id_categoria_local } = req.params;
        const id = Number(id_categoria_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const categoria = await prisma.localCategoria.findUnique({
                where: { id_categoria_local: id }
            });

            if (!categoria) {
                return response.notFound(res, "Categoria não encontrada.");
            }

            logger.info("Categoria retornada com sucesso!");
            return response.success(res, "Categoria encontrada com sucesso!", categoria);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisCategoriasController -> buscarCategoria()");
            return response.error(res, "Erro ao procurar a categoria solicitada.");
        }
    }

    /**
     * Lista todas as categorias cadastradas.
     */
    async buscarTodasCategorias(req, res) {
        try {
            const categorias = await prisma.localCategoria.findMany();

            if (!categorias || categorias.length === 0) {
                return response.notFound(res, "Nenhuma categoria encontrada.");
            }

            logger.info("Categorias listadas com sucesso!");
            return response.success(res, "Categorias recuperadas com sucesso!", categorias);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisCategoriasController -> buscarTodasCategorias()");
            return response.error(res, "Erro ao listar as categorias.");
        }
    }

    /**
     * Cria uma nova categoria de local.
     */
    async criarCategoria(req, res) {
        const { nome_categoria } = req.body;

        if (!nome_categoria || typeof nome_categoria !== 'string' || !nome_categoria.trim()) {
            return response.error(res, "O campo 'nome_categoria' é obrigatório.");
        }

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novaCategoria = await tx.localCategoria.create({
                    data: {
                        nome_categoria: nome_categoria.trim()
                    }
                });
                return { categoria: novaCategoria };
            });

            logger.info("Categoria criada com sucesso!");
            return response.created(res, "Categoria criada com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisCategoriasController -> criarCategoria()");
            return response.error(res, "Falha ao criar a categoria. Nenhuma alteração foi salva.");
        }
    }

    /**
     * Atualiza os dados de uma categoria existente.
     */
    async atualizarCategoria(req, res) {
        const { id_categoria_local } = req.params;
        const { nome_categoria } = req.body;

        const id = Number(id_categoria_local);
        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const categoriaExistente = await prisma.localCategoria.findUnique({
                where: { id_categoria_local: id }
            });

            if (!categoriaExistente) {
                return response.notFound(res, "Categoria não localizada para atualização.");
            }

            const resultado = await prisma.$transaction(async (tx) => {
                const categoriaAtualizada = await tx.localCategoria.update({
                    where: { id_categoria_local: id },
                    data: {
                        nome_categoria: nome_categoria !== undefined ? nome_categoria.trim() : undefined
                    }
                });
                return { categoria: categoriaAtualizada };
            });

            logger.info("Categoria atualizada com sucesso!");
            return response.created(res, "Categoria atualizada com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisCategoriasController -> atualizarCategoria()");
            return response.error(res, "Falha ao atualizar a categoria. Nenhuma alteração foi salva.");
        }
    }

    /**
     * Remove uma categoria do banco de dados.
     */
    async excluirCategoria(req, res) {
        const { id_categoria_local } = req.params;
        const id = Number(id_categoria_local);

        if (isNaN(id)) {
            return response.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const categoriaExistente = await prisma.localCategoria.findUnique({
                where: { id_categoria_local: id }
            });

            if (!categoriaExistente) {
                return response.notFound(res, "Categoria não encontrada para exclusão.");
            }

            await prisma.$transaction(async (tx) => {
                await tx.locaisCategorias.delete({
                    where: { id_categoria_local: id }
                });
            });

            logger.info("Categoria excluída com sucesso!");
            return response.success(res, "Categoria excluída com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisCategoriasController -> excluirCategoria()");
            return response.serverError(res, "Erro ao excluir a categoria solicitada.");
        }
    }
}

module.exports = new LocaisCategoriasController();