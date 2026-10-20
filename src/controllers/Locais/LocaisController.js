const prisma = require('../../config/prismaClient');
const logger = require('../../utils/logger');
const resposta = require('../../utils/resposta');

class LocaisController {
    async buscarLocal(req, res) {
        const { id_local } = req.params;

        try {
            const local = await prisma.local.findUnique({
                where: { id_local: Number(id_local) },
                include: {
                    endereco: true,
                    categoria: true,
                    contatos: true,
                    avaliacoes: true,
                    fotos: true
                }
            });

            if (!local) return resposta.notFound(res, "Local não encontrado.");

            logger.info("Local retornado com sucesso!");

            return resposta.success(res, "Local encontrado com sucesso!", local);
        } catch (err) {
            logger.error({ err }, "Erro ao executar: LocaisController -> buscarLocal()");

            return resposta.error(res, "Erro ao buscar o local solicitado.");
        }
    }

    async buscarTodosLocais(req, res) {
        try {
            const locais = await prisma.local.findMany({
                include: {
                    endereco: true,
                    categoria: true,
                    // Filtra a relação fotos trazendo apenas tipo_foto === "LOGO"
                    fotos: {
                        where: {
                            tipo_foto: "LOGO",
                        },
                        take: 1, // Pega apenas a primeira foto com esse tipo
                    },
                },
            });

            if (!locais || locais.length === 0) return resposta.notFound(res, "Locais não encontrados.");

            logger.info("Locais retornados com sucesso!");

            return resposta.success(res, "Locais encontrados com sucesso!", locais);
        } catch (err) {
            logger.error({ err }, "Erro ao executar: LocaisController -> buscarTodosLocais()");

            return resposta.error(res, "Erro ao buscar os locais solicitados.");
        }
    }

    async cadastrarLocal(req, res) {
        const { id_endereco, id_categoria, nome, cnpj, descricao } = req.body;

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoLocal = await tx.local.create({
                    data: {
                        id_endereco: id_endereco ? Number(id_endereco) : null,
                        id_categoria: id_categoria ? Number(id_categoria) : null,
                        nome,
                        cnpj,
                        descricao: descricao ?? null
                    }
                });

                return { local: novoLocal };
            });

            logger.info("Local criado com sucesso!");

            return resposta.created(res, "Local criado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisController -> criarLocal()");

            return resposta.error(res, "Falha ao criar o local. Nenhuma alteração foi salva.");
        }
    }

    async atualizarLocal(req, res) {
        const { id_local } = req.params;
        const { id_endereco, id_categoria, nome, cnpj, descricao } = req.body;

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const localAtualizado = await tx.local.update({
                    where: { id_local: Number(id_local) },
                    data: {
                        id_endereco: id_endereco !== undefined ? (id_endereco ? Number(id_endereco) : null) : undefined,
                        id_categoria: id_categoria !== undefined ? (id_categoria ? Number(id_categoria) : null) : undefined,
                        nome,
                        cnpj,
                        descricao
                    }
                });

                return { local: localAtualizado };
            });

            logger.info("Local atualizado com sucesso!");

            return resposta.created(res, "Local atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisController -> atualizarLocal()");

            return resposta.error(res, "Falha ao atualizar o local. Nenhuma alteração foi salva.");
        }
    }

    async excluirLocal(req, res) {
        const { id_local } = req.params;

        try {
            const local = await prisma.local.findUnique({
                where: { id_local: Number(id_local) }
            });

            if (!local) return resposta.notFound(res, "Local não encontrado.");

            await prisma.$transaction(async (tx) => {
                await tx.local.delete({
                    where: { id_local: Number(id_local) }
                });
            });

            logger.info("Local excluído com sucesso!");

            return resposta.success(res, "Local excluído com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: LocaisController -> excluirLocal()");

            return resposta.serverError(res, "Falha ao excluir o local.");
        }
    }
}

module.exports = new LocaisController();