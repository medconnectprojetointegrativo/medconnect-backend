const prisma = require("../config/prismaClient");
const logger = require("../utils/logger");
const response = require("../utils/response");

class ProfissionaisController {
  async buscarProfissional(req, res) {
    const { id_profissional } = req.params;

    try {
      const profissional = await prisma.profissional.findUnique({
        where: { id_profissional: Number(id_profissional) },
        include: {
          categoria: true,
          vacinacoesAplicadas: true,
        },
      });

      if (!profissional) {
        return response.notFound(res, "Profissional não encontrado.");
      }

      logger.info("Profissional retornado com sucesso!");

      return response.success(
        res,
        "Profissional encontrado com sucesso!",
        profissional,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: ProfissionaisController -> buscarProfissional()",
      );

      return response.error(res, "Erro ao buscar o profissional solicitado.");
    }
  }

  async buscarTodosProfissionais(req, res) {
    const { id_categoria_profissional, cpf } = req.query;

    try {
      const where = {};
      if (id_categoria_profissional)
        where.id_categoria_profissional = Number(id_categoria_profissional);
      if (cpf) where.cpf = cpf;

      const profissionais = await prisma.profissional.findMany({
        where,
        include: {
          categoria: true,
        },
      });

      if (!profissionais || profissionais.length === 0) {
        return response.notFound(res, "Nenhum profissional encontrado.");
      }

      logger.info("Profissionais retornados com sucesso!");

      return response.success(
        res,
        "Profissionais encontrados com sucesso!",
        profissionais,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: ProfissionaisController -> buscarTodosProfissionais()",
      );

      return response.error(
        res,
        "Erro ao buscar os profissionais solicitados.",
      );
    }
  }

  async criarProfissional(req, res) {
    const { id_categoria_profissional, nome, sobrenome, cpf, data_nascimento } =
      req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const novoProfissional = await tx.profissional.create({
          data: {
            nome,
            sobrenome, // Corrigido de sobrenomo para sobrenome
            cpf,
            data_nascimento: data_nascimento ? new Date(data_nascimento) : null,
            ...(id_categoria_profissional && {
              categoria: {
                connect: {
                  id_categoria_profissional: Number(id_categoria_profissional),
                },
              },
            }),
          },
        });

        return { profissional: novoProfissional };
      });

      logger.info("Profissional criado com sucesso!");

      return response.created(
        res,
        "Profissional criado com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisController -> criarProfissional()",
      );

      return response.error(
        res,
        "Falha ao criar o profissional. Nenhuma alteração foi salva.",
      );
    }
  }

  async atualizarProfissional(req, res) {
    const { id_profissional } = req.params;

    const { id_categoria_profissional, nome, sobrenome, cpf, data_nascimento } =
      req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const profissionalAtualizado = await tx.profissional.update({
          where: { id_profissional: Number(id_profissional) },
          data: {
            nome,
            sobrenome, // Corrigido de sobrenomo para sobrenome
            cpf,
            ...(data_nascimento !== undefined && {
              data_nascimento: data_nascimento
                ? new Date(data_nascimento)
                : null,
            }),
            ...(id_categoria_profissional !== undefined && {
              categoria: id_categoria_profissional
                ? {
                    connect: {
                      id_categoria_profissional: Number(
                        id_categoria_profissional,
                      ),
                    },
                  }
                : { disconnect: true },
            }),
          },
        });

        return { profissional: profissionalAtualizado };
      });

      logger.info("Profissional atualizado com sucesso!");

      return response.success(
        res,
        "Profissional atualizado com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisController -> atualizarProfissional()",
      );

      return response.error(
        res,
        "Falha ao atualizar o profissional. Nenhuma alteração foi salva.",
      );
    }
  }

  async excluirProfissional(req, res) {
    const { id_profissional } = req.params;

    try {
      const profissional = await prisma.profissional.findUnique({
        where: { id_profissional: Number(id_profissional) },
      });

      if (!profissional) {
        return response.notFound(res, "Profissional não encontrado.");
      }

      await prisma.$transaction(async (tx) => {
        await tx.profissional.delete({
          where: { id_profissional: Number(id_profissional) },
        });
      });

      logger.info("Profissional excluído com sucesso!");

      return response.success(res, "Profissional excluído com sucesso!");
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisController -> excluirProfissional()",
      );

      return response.serverError(res, "Falha ao excluir o profissional.");
    }
  }
}

module.exports = new ProfissionaisController();
