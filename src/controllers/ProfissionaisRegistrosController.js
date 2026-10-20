const prisma = require("../config/prismaClient");
const logger = require("../utils/logger");
const response = require("../utils/response");

class ProfissionaisRegistrosController {
  async buscarRegistro(req, res) {
    const { id_registro_profissional } = req.params;

    try {
      const registro = await prisma.profissionalRegistro.findUnique({
        where: { id_registro_profissional: Number(id_registro_profissional) },
        include: { profissional: true },
      });

      if (!registro) {
        return response.notFound(res, "Registro profissional não encontrado.");
      }

      logger.info("Registro profissional retornado com sucesso!");
      return response.success(
        res,
        "Registro profissional encontrado com sucesso!",
        registro,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: ProfissionaisRegistrosController -> buscarRegistro()",
      );
      return response.error(
        res,
        "Erro ao buscar o registro profissional solicitado.",
      );
    }
  }

  async buscarTodosRegistros(req, res) {
    const { id_profissional } = req.query;

    try {
      const where = {};
      if (id_profissional) where.id_profissional = Number(id_profissional);

      const registros = await prisma.profissionalRegistro.findMany({
        where,
        include: { profissional: true },
      });

      if (!registros || registros.length === 0) {
        return response.notFound(
          res,
          "Nenhum registro profissional encontrado.",
        );
      }

      logger.info("Registros profissionais retornados com sucesso!");
      return response.success(
        res,
        "Registros profissionais encontrados com sucesso!",
        registros,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: ProfissionaisRegistrosController -> buscarTodosRegistros()",
      );
      return response.error(res, "Erro ao buscar os registros profissionais.");
    }
  }

  async criarRegistro(req, res) {
    const {
      id_profissional,
      sigla_conselho_regional,
      numero_registro,
      uf_registro,
      data_validade,
      ativo,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const novoRegistro = await tx.profissionalRegistro.create({
          data: {
            sigla_conselho_regional,
            numero_registro,
            uf_registro,
            data_validade: data_validade ? new Date(data_validade) : null,
            ativo: ativo ?? true,
            profissional: {
              connect: { id_profissional: Number(id_profissional) },
            },
          },
        });

        return { registro: novoRegistro };
      });

      logger.info("Registro profissional criado com sucesso!");
      return response.created(
        res,
        "Registro profissional criado com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisRegistrosController -> criarRegistro()",
      );
      return response.error(res, "Falha ao criar o registro profissional.");
    }
  }

  async atualizarRegistro(req, res) {
    const { id_registro_profissional } = req.params;
    const {
      id_profissional,
      sigla_conselho_regional,
      numero_registro,
      uf_registro,
      data_validade,
      ativo,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const registroAtualizado = await tx.profissionalRegistro.update({
          where: { id_registro_profissional: Number(id_registro_profissional) },
          data: {
            sigla_conselho_regional,
            numero_registro,
            uf_registro,
            ...(data_validade !== undefined && {
              data_validade: data_validade ? new Date(data_validade) : null,
            }),
            ...(ativo !== undefined && { ativo }),
            ...(id_profissional !== undefined && {
              profissional: {
                connect: { id_profissional: Number(id_profissional) },
              },
            }),
          },
        });

        return { registro: registroAtualizado };
      });

      logger.info("Registro profissional atualizado com sucesso!");
      return response.success(
        res,
        "Registro profissional atualizado com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisRegistrosController -> atualizarRegistro()",
      );
      return response.error(res, "Falha ao atualizar o registro profissional.");
    }
  }

  async excluirRegistro(req, res) {
    const { id_registro_profissional } = req.params;

    try {
      const registro = await prisma.profissionalRegistro.findUnique({
        where: { id_registro_profissional: Number(id_registro_profissional) },
      });

      if (!registro) {
        return response.notFound(res, "Registro profissional não encontrado.");
      }

      await prisma.$transaction(async (tx) => {
        await tx.profissionalRegistro.delete({
          where: { id_registro_profissional: Number(id_registro_profissional) },
        });
      });

      logger.info("Registro profissional excluído com sucesso!");
      return response.success(
        res,
        "Registro profissional excluído com sucesso!",
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisRegistrosController -> excluirRegistro()",
      );
      return response.serverError(
        res,
        "Falha ao excluir o registro profissional.",
      );
    }
  }
}

module.exports = new ProfissionaisRegistrosController();
