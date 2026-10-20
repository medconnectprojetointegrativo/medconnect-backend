const prisma = require('../../config/prismaClient');
const logger = require('../../utils/logger');
const resposta = require('../../utils/resposta');
const fs = require('fs');
const path = require('path');

const pastaLocaisImagens = "LocaisImagens"

class LocaisFotosController {
    async buscarFoto(req, res) {
        const { id_foto_local } = req.params;
        const id = Number(id_foto_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const foto = await prisma.localFoto.findUnique({
                where: { id_foto_local: id }
            });

            if (!foto) {
                return resposta.notFound(res, "Fotografia não encontrada.");
            }

            logger.info("Foto retornada com sucesso!");
            return resposta.success(res, "Fotografia encontrada com sucesso!", foto);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisFotosController -> buscarFoto()");
            return resposta.error(res, "Erro ao procurar o registo da foto.");
        }
    }

    async buscarTodasFotosPorLocal(req, res) {
        const { id_local } = req.params;
        const id = Number(id_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador do local informado deve ser um número válido.");
        }

        try {
            const fotos = await prisma.localFoto.findMany({
                where: { id_local: id }
            });

            if (!fotos || fotos.length === 0) {
                return resposta.notFound(res, "Nenhuma fotografia encontrada para este estabelecimento.");
            }

            logger.info("Fotos listadas com sucesso!");
            return resposta.success(res, "Fotografias recuperadas com sucesso!", fotos);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisFotosController -> buscarTodasFotosPorLocal()");
            return resposta.error(res, "Erro ao listar as fotografias do local.");
        }
    }

    async cadastrarFoto(req, res) {
        const { id_local, tipo_foto } = req.body;
        const arquivo = req.file;

        if (!arquivo) {
            return resposta.error(res, "Nenhum ficheiro de imagem foi fornecido.");
        }

        if (!id_local || !tipo_foto) {
            if (fs.existsSync(arquivo.path)) {
                fs.unlinkSync(arquivo.path);
            }
            return resposta.error(res, "Os campos 'id_local' e 'tipo_foto' são obrigatórios.");
        }

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novaFoto = await tx.localFoto.create({
                    data: {
                        id_local: Number(id_local),
                        nome_arquivo_original: arquivo.originalname,
                        nome_arquivo_padronizado: arquivo.filename,
                        // URL pública referenciando a subpasta específica
                        caminho_arquivo: `/files/${pastaLocaisImagens}/${arquivo.filename}`,
                        tipo_foto
                    }
                });
                return { foto: novaFoto };
            });

            logger.info("Foto criada com sucesso!");
            return resposta.created(res, "Fotografia registada com sucesso!", resultado);
        } catch (error) {
            if (fs.existsSync(arquivo.path)) {
                fs.unlinkSync(arquivo.path);
            }

            logger.error({ err: error }, "Erro ao executar: LocaisFotosController -> criarFoto()");

            if (error.code === 'P2003') {
                return resposta.error(res, "O 'id_local' informado não existe no sistema.");
            }

            return resposta.error(res, "Falha ao registar a fotografia. Nenhuma alteração foi gravada.");
        }
    }

    async atualizarFoto(req, res) {
        const { id_foto_local } = req.params;
        const { tipo_foto } = req.body;
        const id = Number(id_foto_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const fotoExistente = await prisma.localFoto.findUnique({
                where: { id_foto_local: id }
            });

            if (!fotoExistente) {
                return resposta.notFound(res, "Fotografia não localizada para atualização.");
            }

            const resultado = await prisma.$transaction(async (tx) => {
                const fotoAtualizada = await tx.localFoto.update({
                    where: { id_foto_local: id },
                    data: {
                        tipo_foto: tipo_foto !== undefined ? tipo_foto : undefined
                    }
                });
                return { foto: fotoAtualizada };
            });

            logger.info("Foto atualizada com sucesso!");
            return resposta.created(res, "Fotografia atualizada com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisFotosController -> atualizarFoto()");
            return resposta.error(res, "Falha ao atualizar o registo da fotografia.");
        }
    }

    async excluirFoto(req, res) {
        const { id_foto_local } = req.params;
        const id = Number(id_foto_local);

        if (isNaN(id)) {
            return resposta.error(res, "O identificador informado deve ser um número válido.");
        }

        try {
            const fotoExistente = await prisma.localFoto.findUnique({
                where: { id_foto_local: id }
            });

            if (!fotoExistente) {
                return resposta.notFound(res, "Fotografia não encontrada para exclusão.");
            }

            await prisma.$transaction(async (tx) => {
                await tx.localFoto.delete({
                    where: { id_foto_local: id }
                });
            });

            // Apaga da pasta files/fotosLocais/
            const ficheiroFisico = path.resolve(
                __dirname,
                '..',
                '..',
                'files',
                `${pastaLocaisImagens}`,
                fotoExistente.nome_arquivo_padronizado
            );

            if (fs.existsSync(ficheiroFisico)) {
                fs.unlinkSync(ficheiroFisico);
            }

            logger.info("Foto excluída com sucesso!");
            return resposta.success(res, "Fotografia removida com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisFotosController -> excluirFoto()");
            return resposta.serverError(res, "Erro ao eliminar a fotografia solicitada.");
        }
    }
}

module.exports = new LocaisFotosController();