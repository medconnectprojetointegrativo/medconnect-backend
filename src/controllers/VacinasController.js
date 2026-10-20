const prisma = require("../config/prismaClient");
const logger = require("../utils/logger");
const response = require("../utils/response");

class VacinasController {
  async buscarVacina(req, res) {
    const { id_vacina } = req.params;

    try {
      const vacina = await prisma.vacina.findUnique({
        where: { id_vacina: Number(id_vacina) },
        include: {
          dosesEsquema: true,
          pacientesVacinacoes: true,
        },
      });
      
      if (!vacina) {
        return response.notFound(res, "Vacina não encontrada.");
      }

      logger.info("Vacina retornada com sucesso!");

      return response.success(res, "Vacina encontrada com sucesso!", vacina);
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: VacinasController -> buscarVacina()",
      );

      return response.error(res, "Erro ao buscar a vacina solicitada.");
    }
  }

  async buscarTodasVacinas(req, res) {
    try {
      const vacinas = await prisma.vacina.findMany();

      if (!vacinas || vacinas.length === 0) {
        return response.notFound(res, "Vacinas não encontradas.");
      }

      logger.info("Vacinas retornadas com sucesso!");

      return response.success(res, "Vacinas encontradas com sucesso!", vacinas);
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: VacinasController -> buscarTodasVacinas()",
      );

      return response.error(res, "Erro ao buscar as vacinas solicitadas.");
    }
  }

  async criarVacina(req, res) {
    const {
      nome,
      sigla_codigo,
      fabricante,
      codigo_tuss_sipni,
      tipo_imunizante,
      ativo,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const novaVacina = await tx.vacina.create({
          data: {
            nome,
            sigla_codigo,
            fabricante,
            codigo_tuss_sipni,
            tipo_imunizante,
            ativo: ativo ?? true,
          },
        });

        return { vacina: novaVacina };
      });

      logger.info("Vacina criada com sucesso!");

      return response.created(res, "Vacina criada com sucesso!", resultado);
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: VacinasController -> criarVacina()",
      );

      return response.error(
        res,
        "Falha ao criar a vacina. Nenhuma alteração foi salva.",
      );
    }
  }

  async atualizarVacina(req, res) {
    const { id_vacina } = req.params;

    const {
      nome,
      sigla_codigo,
      fabricante,
      codigo_tuss_sipni,
      tipo_imunizante,
      ativo,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const vacinaAtualizada = await tx.vacina.update({
          where: { id_vacina: Number(id_vacina) },
          data: {
            nome,
            sigla_codigo,
            fabricante,
            codigo_tuss_sipni,
            tipo_imunizante,
            ativo,
          },
        });

        return { vacina: vacinaAtualizada };
      });

      logger.info("Vacina atualizada com sucesso!");

      return response.success(res, "Vacina atualizada com sucesso!", resultado);
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: VacinasController -> atualizarVacina()",
      );

      return response.error(
        res,
        "Falha ao atualizar a vacina. Nenhuma alteração foi salva.",
      );
    }
  }

  async excluirVacina(req, res) {
    const { id_vacina } = req.params;

    try {
      const vacina = await prisma.vacina.findUnique({
        where: { id_vacina: Number(id_vacina) },
      });

      if (!vacina) {
        return response.notFound(res, "Vacina não encontrada.");
      }

      await prisma.$transaction(async (tx) => {
        await tx.vacina.delete({
          where: { id_vacina: Number(id_vacina) },
        });
      });

      logger.info("Vacina excluída com sucesso!");

      return response.success(res, "Vacina excluída com sucesso!");
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: VacinasController -> excluirVacina()",
      );

      return response.serverError(res, "Falha ao excluir a vacina.");
    }
  }
}

module.exports = new VacinasController();
