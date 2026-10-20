const prisma = require('../../config/prismaClient'); //[cite: 4]
const logger = require('../../utils/logger'); //[cite: 4]
const resposta = require('../../utils/resposta'); //[cite: 4]

class PacientesDocumentosController {
    async criarDocumento(req, res) {
        const { id_paciente } = req.params;
        const { tipo_documento, numero_documento, orgao_emissor, data_emissao, data_validade } = req.body;

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoDocumento = await tx.pacienteDocumentacaoPessoal.create({
                    data: {
                        id_paciente: Number(id_paciente),
                        tipo_documento,
                        numero_documento,
                        orgao_emissor,
                        data_emissao: data_emissao ? new Date(data_emissao) : null,
                        data_validade: new Date(data_validade)
                    }
                });
                return { documento: novoDocumento };
            });
            logger.info("Documento criado com sucesso!");

            return resposta.created(res, "Documento criado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacientesDocumentosController -> criarDocumento()");

            return resposta.error(res, "Falha ao criar o documento.");
        }
    }

    async atualizarDocumento(req, res) {
        const { id_documento_paciente } = req.params;
        const { tipo_documento, numero_documento, orgao_emissor, data_emissao, data_validade } = req.body;

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const documentoAtualizado = await tx.pacienteDocumentacaoPessoal.update({
                    where: { id_documento_paciente: Number(id_documento_paciente) },
                    data: {
                        tipo_documento,
                        numero_documento,
                        orgao_emissor,
                        data_emissao: data_emissao ? new Date(data_emissao) : undefined,
                        data_validade: data_validade ? new Date(data_validade) : undefined
                    }
                });
                return { documento: documentoAtualizado };
            });

            logger.info("Documento atualizado com sucesso!");

            return resposta.created(res, "Documento atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacientesDocumentosController -> atualizarDocumento()");

            return resposta.error(res, "Falha ao atualizar o documento.");
        }
    }

    async excluirDocumento(req, res) {
        const { id_documento_paciente } = req.params;

        try {
            await prisma.$transaction(async (tx) => {
                await tx.pacienteDocumentacaoPessoal.delete({ where: { id_documento_paciente: Number(id_documento_paciente) } });
            });
            logger.info("Documento excluído com sucesso!");

            return resposta.success(res, "Documento excluído com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: PacientesDocumentosController -> excluirDocumento()");

            return resposta.serverError(res, "Falha ao excluir o documento.");
        }
    }
}
module.exports = new PacientesDocumentosController();