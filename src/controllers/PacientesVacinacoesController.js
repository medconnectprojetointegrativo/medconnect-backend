const prisma = require("../config/prismaClient");
const logger = require("../utils/logger");
const response = require("../utils/response");

class PacientesVacinacoesController {
  async buscarVacinacao(req, res) {
    const { id_vacinacao } = req.params;

    try {
      const vacinacao = await prisma.pacienteVacinacao.findUnique({
        where: { id_vacinacao: Number(id_vacinacao) },
        include: {
          paciente: true,
          vacina: true,
          local: true,
          profissional: true,
        },
      });

      if (!vacinacao) {
        return response.notFound(res, "Registro de vacinação não encontrado.");
      }

      logger.info("Registro de vacinação retornado com sucesso!");
      return response.success(
        res,
        "Registro de vacinação encontrado com sucesso!",
        vacinacao,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: PacientesVacinacoesController -> buscarVacinacao()",
      );
      return response.error(
        res,
        "Erro ao buscar o registro de vacinação solicitado.",
      );
    }
  }

  async buscarTodasVacinacoes(req, res) {
    const { id_paciente, id_vacina, status } = req.query;

    try {
      const where = {};
      if (id_paciente) where.id_paciente = Number(id_paciente);
      if (id_vacina) where.id_vacina = Number(id_vacina);
      if (status) where.status = status;

      const vacinacoes = await prisma.pacienteVacinacao.findMany({
        where,
        include: {
          paciente: true,
          vacina: true,
          local: true,
          profissional: true,
        },
      });

      if (!vacinacoes || vacinacoes.length === 0) {
        return response.notFound(
          res,
          "Nenhum registro de vacinação encontrado.",
        );
      }

      logger.info("Registros de vacinação retornados com sucesso!");
      return response.success(
        res,
        "Registros de vacinação encontrados com sucesso!",
        vacinacoes,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: PacientesVacinacoesController -> buscarTodasVacinacoes()",
      );
      return response.error(
        res,
        "Erro ao buscar os registros de vacinação solicitados.",
      );
    }
  }

  async criarVacinacao(req, res) {
    const {
      id_paciente,
      id_vacina,
      id_local,
      id_profissional,
      dose_aplicada,
      data_aplicacao,
      data_previsao_proxima_dose,
      lote,
      data_validade_lote,
      status,
      origem_registro,
      observacoes,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const novaVacinacao = await tx.pacienteVacinacao.create({
          data: {
            id_paciente: Number(id_paciente),
            id_vacina: Number(id_vacina),
            id_local: id_local ? Number(id_local) : null,
            id_profissional: id_profissional ? Number(id_profissional) : null,
            dose_aplicada,
            data_aplicacao: data_aplicacao
              ? new Date(data_aplicacao)
              : new Date(),
            data_previsao_proxima_dose: data_previsao_proxima_dose
              ? new Date(data_previsao_proxima_dose)
              : null,
            lote,
            data_validade_lote: data_validade_lote
              ? new Date(data_validade_lote)
              : null,
            status: status || "APLICADA",
            origem_registro: origem_registro || "SISTEMA_LOCAL",
            observacoes,
          },
        });

        return { vacinacao: novaVacinacao };
      });

      logger.info("Registro de vacinação criado com sucesso!");
      return response.created(
        res,
        "Registro de vacinação criado com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: PacientesVacinacoesController -> criarVacinacao()",
      );
      return response.error(
        res,
        "Falha ao registrar a vacinação. Nenhuma alteração foi salva.",
      );
    }
  }

  async atualizarVacinacao(req, res) {
    const { id_vacinacao } = req.params;
    const {
      id_paciente,
      id_vacina,
      id_local,
      id_profissional,
      dose_aplicada,
      data_aplicacao,
      data_previsao_proxima_dose,
      lote,
      data_validade_lote,
      status,
      origem_registro,
      observacoes,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const vacinacaoAtualizada = await tx.pacienteVacinacao.update({
          where: { id_vacinacao: Number(id_vacinacao) },
          data: {
            ...(id_paciente && { id_paciente: Number(id_paciente) }),
            ...(id_vacina && { id_vacina: Number(id_vacina) }),
            ...(id_local !== undefined && {
              id_local: id_local ? Number(id_local) : null,
            }),
            ...(id_profissional !== undefined && {
              id_profissional: id_profissional ? Number(id_profissional) : null,
            }),
            dose_aplicada,
            ...(data_aplicacao && { data_aplicacao: new Date(data_aplicacao) }),
            ...(data_previsao_proxima_dose !== undefined && {
              data_previsao_proxima_dose: data_previsao_proxima_dose
                ? new Date(data_previsao_proxima_dose)
                : null,
            }),
            lote,
            ...(data_validade_lote !== undefined && {
              data_validade_lote: data_validade_lote
                ? new Date(data_validade_lote)
                : null,
            }),
            status,
            origem_registro,
            observacoes,
          },
        });

        return { vacinacao: vacinacaoAtualizada };
      });

      logger.info("Registro de vacinação atualizado com sucesso!");
      return response.success(
        res,
        "Registro de vacinação atualizado com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: PacientesVacinacoesController -> atualizarVacinacao()",
      );
      return response.error(
        res,
        "Falha ao atualizar o registro de vacinação. Nenhuma alteração foi salva.",
      );
    }
  }

  async excluirVacinacao(req, res) {
    const { id_vacinacao } = req.params;

    try {
      const vacinacao = await prisma.pacienteVacinacao.findUnique({
        where: { id_vacinacao: Number(id_vacinacao) },
      });

      if (!vacinacao) {
        return response.notFound(res, "Registro de vacinação não encontrado.");
      }

      await prisma.$transaction(async (tx) => {
        await tx.pacienteVacinacao.delete({
          where: { id_vacinacao: Number(id_vacinacao) },
        });
      });

      logger.info("Registro de vacinação excluído com sucesso!");
      return response.success(
        res,
        "Registro de vacinação excluído com sucesso!",
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: PacientesVacinacoesController -> excluirVacinacao()",
      );
      return response.serverError(
        res,
        "Falha ao excluir o registro de vacinação.",
      );
    }
  }
}

module.exports = new PacientesVacinacoesController();
