const prisma = require("../config/prismaClient");
const logger = require("../utils/logger");
const response = require("../utils/response");

class ProfissionaisCategoriasController {
  async buscarCategoria(req, res) {
    const { id_categoria_profissional } = req.params;

    try {
      const categoria = await prisma.profissionalCategoria.findUnique({
        where: { id_categoria_profissional: Number(id_categoria_profissional) },
        include: { profissionais: true },
      });

      if (!categoria) {
        return response.notFound(res, "Categoria profissional não encontrada.");
      }

      logger.info("Categoria profissional retornada com sucesso!");
      return response.success(
        res,
        "Categoria profissional encontrada com sucesso!",
        categoria,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: ProfissionaisCategoriasController -> buscarCategoria()",
      );
      return response.error(
        res,
        "Erro ao buscar a categoria profissional solicitada.",
      );
    }
  }

  async buscarTodasCategorias(req, res) {
    try {
      const categorias = await prisma.profissionalCategoria.findMany({
        orderBy: { id_categoria_profissional: "asc" },
      });

      if (!categorias || categorias.length === 0) {
        return response.notFound(
          res,
          "Nenhuma categoria profissional encontrada.",
        );
      }

      logger.info("Categorias profissionais retornadas com sucesso!");
      return response.success(
        res,
        "Categorias profissionais encontradas com sucesso!",
        categorias,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: ProfissionaisCategoriasController -> buscarTodasCategorias()",
      );
      return response.error(res, "Erro ao buscar as categorias profissionais.");
    }
  }

  async criarCategoria(req, res) {
    const { categoria } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const novaCategoria = await tx.profissionalCategoria.create({
          data: { categoria },
        });

        return { categoria: novaCategoria };
      });

      logger.info("Categoria profissional criada com sucesso!");
      return response.created(
        res,
        "Categoria profissional criada com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisCategoriasController -> criarCategoria()",
      );
      return response.error(res, "Falha ao criar a categoria profissional.");
    }
  }

  async atualizarCategoria(req, res) {
    const { id_categoria_profissional } = req.params;
    const { categoria } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const categoriaAtualizada = await tx.profissionalCategoria.update({
          where: {
            id_categoria_profissional: Number(id_categoria_profissional),
          },
          data: { categoria },
        });

        return { categoria: categoriaAtualizada };
      });

      logger.info("Categoria profissional atualizada com sucesso!");
      return response.success(
        res,
        "Categoria profissional atualizada com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisCategoriasController -> atualizarCategoria()",
      );
      return response.error(
        res,
        "Falha ao atualizar a categoria profissional.",
      );
    }
  }

  async excluirCategoria(req, res) {
    const { id_categoria_profissional } = req.params;

    try {
      const categoria = await prisma.profissionalCategoria.findUnique({
        where: { id_categoria_profissional: Number(id_categoria_profissional) },
      });

      if (!categoria) {
        return response.notFound(res, "Categoria profissional não encontrada.");
      }

      await prisma.$transaction(async (tx) => {
        await tx.profissionalCategoria.delete({
          where: {
            id_categoria_profissional: Number(id_categoria_profissional),
          },
        });
      });

      logger.info("Categoria profissional excluída com sucesso!");
      return response.success(
        res,
        "Categoria profissional excluída com sucesso!",
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisCategoriasController -> excluirCategoria()",
      );
      return response.serverError(
        res,
        "Falha ao excluir a categoria profissional.",
      );
    }
  }
}

module.exports = new ProfissionaisCategoriasController();
