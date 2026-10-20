const prisma = require("../config/prismaClient");
const logger = require("../utils/logger");
const response = require("../utils/response");

class VacinasDosesEsquemaController {
  async buscarDoseEsquema(req, res) {
    const { id_esquema } = req.params;

    try {
      const doseEsquema = await prisma.vacinaDoseEsquema.findUnique({
        where: { id_esquema: Number(id_esquema) },
        include: {
          vacina: true,
        },
      });

      if (!doseEsquema) {
        return response.notFound(res, "Esquema de dose não encontrado.");
      }

      logger.info("Esquema de dose retornado com sucesso!");
      return response.success(
        res,
        "Esquema de dose encontrado com sucesso!",
        doseEsquema,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: VacinasDosesEsquemaController -> buscarDoseEsquema()",
      );
      return response.error(
        res,
        "Erro ao buscar o esquema de dose solicitado.",
      );
    }
  }

  async buscarTodasDosesEsquema(req, res) {
    const { id_vacina } = req.query;

    try {
      const where = id_vacina ? { id_vacina: Number(id_vacina) } : {};
      const dosesEsquema = await prisma.vacinaDoseEsquema.findMany({ where });

      if (!dosesEsquema || dosesEsquema.length === 0) {
        return response.notFound(res, "Nenhum esquema de dose encontrado.");
      }

      logger.info("Esquemas de dose retornados com sucesso!");
      return response.success(
        res,
        "Esquemas de dose encontrados com sucesso!",
        dosesEsquema,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: VacinasDosesEsquemaController -> buscarTodasDosesEsquema()",
      );
      return response.error(
        res,
        "Erro ao buscar os esquemas de dose solicitados.",
      );
    }
  }

  async criarDoseEsquema(req, res) {
    const {
      id_esquema, // Atenção: id_esquema não tem autoincrement no schema!
      id_vacina,
      identificador_dose,
      idade_recomendada_meses,
      intervalo_minimo_dias,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const novaDoseEsquema = await tx.vacinaDoseEsquema.create({
          data: {
            id_esquema: Number(id_esquema), // Obrigatório se não for autoincrement
            id_vacina: Number(id_vacina),
            identificador_dose,
            idade_recomendada_meses: idade_recomendada_meses
              ? Number(idade_recomendada_meses)
              : null,
            intervalo_minimo_dias: intervalo_minimo_dias
              ? Number(intervalo_minimo_dias)
              : null,
          },
        });

        return { doseEsquema: novaDoseEsquema };
      });

      logger.info("Esquema de dose criado com sucesso!");
      return response.created(
        res,
        "Esquema de dose criado com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: VacinasDosesEsquemaController -> criarDoseEsquema()",
      );
      return response.error(
        res,
        "Falha ao criar o esquema de dose. Nenhuma alteração foi salva.",
      );
    }
  }

  async atualizarDoseEsquema(req, res) {
    const { id_esquema } = req.params;
    const {
      id_vacina,
      identificador_dose,
      idade_recomendada_meses,
      intervalo_minimo_dias,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const doseAtualizada = await tx.vacinaDoseEsquema.update({
          where: { id_esquema: Number(id_esquema) },
          data: {
            ...(id_vacina && { id_vacina: Number(id_vacina) }),
            identificador_dose,
            ...(idade_recomendada_meses !== undefined && {
              idade_recomendada_meses: Number(idade_recomendada_meses),
            }),
            ...(intervalo_minimo_dias !== undefined && {
              intervalo_minimo_dias: Number(intervalo_minimo_dias),
            }),
          },
        });

        return { doseEsquema: doseAtualizada };
      });

      logger.info("Esquema de dose atualizado com sucesso!");
      return response.success(
        res,
        "Esquema de dose atualizado com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: VacinasDosesEsquemaController -> atualizarDoseEsquema()",
      );
      return response.error(
        res,
        "Falha ao atualizar o esquema de dose. Nenhuma alteração foi salva.",
      );
    }
  }

  async excluirDoseEsquema(req, res) {
    const { id_esquema } = req.params;

    try {
      const doseEsquema = await prisma.vacinaDoseEsquema.findUnique({
        where: { id_esquema: Number(id_esquema) },
      });

      if (!doseEsquema) {
        return response.notFound(res, "Esquema de dose não encontrado.");
      }

      await prisma.$transaction(async (tx) => {
        await tx.vacinaDoseEsquema.delete({
          where: { id_esquema: Number(id_esquema) },
        });
      });

      logger.info("Esquema de dose excluído com sucesso!");
      return response.success(res, "Esquema de dose excluído com sucesso!");
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: VacinasDosesEsquemaController -> excluirDoseEsquema()",
      );
      return response.serverError(res, "Falha ao excluir o esquema de dose.");
    }
  }
}

module.exports = new VacinasDosesEsquemaController();
