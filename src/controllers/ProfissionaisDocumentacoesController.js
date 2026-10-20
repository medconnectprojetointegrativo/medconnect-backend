const prisma = require("../config/prismaClient");
const logger = require("../utils/logger");
const response = require("../utils/response");

class ProfissionaisDocumentacoesController {
  async buscarDocumento(req, res) {
    const { id_documento_profissional } = req.params;

    try {
      const documento = await prisma.profissionalDocumentacaoPessoal.findUnique(
        {
          where: {
            id_documento_profissional: Number(id_documento_profissional),
          },
          include: { profissional: true },
        },
      );

      if (!documento) {
        return response.notFound(res, "Documentação pessoal não encontrada.");
      }

      logger.info("Documentação pessoal retornada com sucesso!");
      return response.success(
        res,
        "Documentação encontrada com sucesso!",
        documento,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: ProfissionaisDocumentacoesController -> buscarDocumento()",
      );
      return response.error(res, "Erro ao buscar a documentação solicitada.");
    }
  }

  async buscarTodosDocumentos(req, res) {
    const { id_profissional } = req.query;

    try {
      const where = {};
      if (id_profissional) where.id_profissional = Number(id_profissional);

      const documentos = await prisma.profissionalDocumentacaoPessoal.findMany({
        where,
        include: { profissional: true },
      });

      if (!documentos || documentos.length === 0) {
        return response.notFound(
          res,
          "Nenhuma documentação pessoal encontrada.",
        );
      }

      logger.info("Documentações pessoais retornadas com sucesso!");
      return response.success(
        res,
        "Documentações encontradas com sucesso!",
        documentos,
      );
    } catch (err) {
      logger.error(
        { err },
        "Erro ao executar: ProfissionaisDocumentacoesController -> buscarTodosDocumentos()",
      );
      return response.error(res, "Erro ao buscar as documentações.");
    }
  }

  async criarDocumento(req, res) {
    const {
      id_profissional,
      tipo_documento,
      numero_documento,
      orgao_emissor,
      data_emissao,
      data_validade,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const novoDocumento = await tx.profissionalDocumentacaoPessoal.create({
          data: {
            tipo_documento,
            numero_documento,
            orgao_emissor,
            data_emissao: data_emissao ? new Date(data_emissao) : null,
            data_validade: data_validade ? new Date(data_validade) : null,
            profissional: {
              connect: { id_profissional: Number(id_profissional) },
            },
          },
        });

        return { documento: novoDocumento };
      });

      logger.info("Documentação pessoal criada com sucesso!");
      return response.created(
        res,
        "Documentação criada com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisDocumentacoesController -> criarDocumento()",
      );
      return response.error(res, "Falha ao criar a documentação pessoal.");
    }
  }

  async atualizarDocumento(req, res) {
    const { id_documento_profissional } = req.params;
    const {
      id_profissional,
      tipo_documento,
      numero_documento,
      orgao_emissor,
      data_emissao,
      data_validade,
    } = req.body;

    try {
      const resultado = await prisma.$transaction(async (tx) => {
        const documentoAtualizado =
          await tx.profissionalDocumentacaoPessoal.update({
            where: {
              id_documento_profissional: Number(id_documento_profissional),
            },
            data: {
              tipo_documento,
              numero_documento,
              orgao_emissor,
              ...(data_emissao !== undefined && {
                data_emissao: data_emissao ? new Date(data_emissao) : null,
              }),
              ...(data_validade !== undefined && {
                data_validade: data_validade ? new Date(data_validade) : null,
              }),
              ...(id_profissional !== undefined && {
                profissional: {
                  connect: { id_profissional: Number(id_profissional) },
                },
              }),
            },
          });

        return { documento: documentoAtualizado };
      });

      logger.info("Documentação pessoal atualizada com sucesso!");
      return response.success(
        res,
        "Documentação atualizada com sucesso!",
        resultado,
      );
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisDocumentacoesController -> atualizarDocumento()",
      );
      return response.error(res, "Falha ao atualizar a documentação pessoal.");
    }
  }

  async excluirDocumento(req, res) {
    const { id_documento_profissional } = req.params;

    try {
      const documento = await prisma.profissionalDocumentacaoPessoal.findUnique(
        {
          where: {
            id_documento_profissional: Number(id_documento_profissional),
          },
        },
      );

      if (!documento) {
        return response.notFound(res, "Documentação pessoal não encontrada.");
      }

      await prisma.$transaction(async (tx) => {
        await tx.profissionalDocumentacaoPessoal.delete({
          where: {
            id_documento_profissional: Number(id_documento_profissional),
          },
        });
      });

      logger.info("Documentação pessoal excluída com sucesso!");
      return response.success(res, "Documentação excluída com sucesso!");
    } catch (error) {
      logger.error(
        { err: error },
        "Erro ao executar: ProfissionaisDocumentacoesController -> excluirDocumento()",
      );
      return response.serverError(
        res,
        "Falha ao excluir a documentação pessoal.",
      );
    }
  }
}

module.exports = new ProfissionaisDocumentacoesController();
