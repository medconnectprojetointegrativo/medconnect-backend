const prisma = require('../config/prismaClient');
const logger = require('../utils/logger');
const response = require('../utils/response');

class LocaisEnderecosController {
    async buscarEndereco(req, res) {
        const { id_endereco_local } = req.params;

        try {
            const endereco = await prisma.localEndereco.findUnique({
                where: { id_endereco_local: Number(id_endereco_local) }
            });

            if (!endereco) {
                return response.notFound(res, "Endereço não encontrado.");
            }

            logger.info("Endereço retornado com sucesso!");
            return response.success(res, "Endereço encontrado com sucesso!", endereco);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: EnderecoController -> buscarEndereco()");
            return response.error(res, "Erro ao procurar o endereço solicitado.");
        }
    }

    /**
     * Lista todos os endereços registados.
     */
    async buscarTodosEnderecos(req, res) {
        try {
            const enderecos = await prisma.localEndereco.findMany();

            if (!enderecos || enderecos.length === 0) {
                return response.notFound(res, "Nenhum endereço encontrado.");
            }

            logger.info("Endereços listados com sucesso!");
            return response.success(res, "Endereços recuperados com sucesso!", enderecos);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: EnderecoController -> buscarTodosEnderecos()");
            return response.error(res, "Erro ao listar os endereços.");
        }
    }

    /**
     * Regista um novo endereço.
     */
    async cadastrarEndereco(req, res) {
        const {
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            latitude,
            longitude
        } = req.body;

        if (!cep || !logradouro || !numero || !bairro || !cidade || !estado) {
            return response.error(res, "Por favor, preencha todos os campos obrigatórios.");
        }

        try {
            const resultado = await prisma.$transaction(async (tx) => {
                const novoEndereco = await tx.localEndereco.create({
                    data: {
                        cep,
                        logradouro,
                        numero,
                        complemento: complemento ?? null,
                        bairro,
                        cidade,
                        estado,
                        latitude: latitude !== undefined ? Number(latitude) : null,
                        longitude: longitude !== undefined ? Number(longitude) : null
                    }
                });
                return { endereco: novoEndereco };
            });

            logger.info("Endereço criado com sucesso!");
            return response.created(res, "Endereço criado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: EnderecoController -> criarEndereco()");
            return response.error(res, "Falha ao registar o endereço. Nenhuma alteração foi gravada.");
        }
    }

    /**
     * Atualiza os dados de um endereço existente.
     */
    async atualizarEndereco(req, res) {
        const { id_endereco_local } = req.params;
        const {
            cep,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            estado,
            latitude,
            longitude
        } = req.body;

        try {
            const id = Number(id_endereco_local);

            const enderecoExistente = await prisma.localEndereco.findUnique({
                where: { id_endereco_local: id }
            });

            if (!enderecoExistente) {
                return response.notFound(res, "Endereço não localizado para atualização.");
            }

            const resultado = await prisma.$transaction(async (tx) => {
                const enderecoAtualizado = await tx.localEndereco.update({
                    where: { id_endereco_local: id },
                    data: {
                        cep: cep !== undefined ? cep : undefined,
                        logradouro: logradouro !== undefined ? logradouro : undefined,
                        numero: numero !== undefined ? numero : undefined,
                        complemento: complemento !== undefined ? complemento : undefined,
                        bairro: bairro !== undefined ? bairro : undefined,
                        cidade: cidade !== undefined ? cidade : undefined,
                        estado: estado !== undefined ? estado : undefined,
                        latitude: latitude !== undefined ? Number(latitude) : undefined,
                        longitude: longitude !== undefined ? Number(longitude) : undefined
                    }
                });
                return { endereco: enderecoAtualizado };
            });

            logger.info("Endereço atualizado com sucesso!");
            return response.created(res, "Endereço atualizado com sucesso!", resultado);
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: EnderecoController -> atualizarEndereco()");
            return response.error(res, "Falha ao atualizar o endereço. Nenhuma alteração foi gravada.");
        }
    }

    /**
     * Remove um endereço da base de dados.
     */
    async excluirEndereco(req, res) {
        const { id_endereco_local } = req.params;

        try {
            const id = Number(id_endereco_local);

            const enderecoExistente = await prisma.localEndereco.findUnique({
                where: { id_endereco_local: id }
            });

            if (!enderecoExistente) {
                return response.notFound(res, "Endereço não encontrado para exclusão.");
            }

            await prisma.$transaction(async (tx) => {
                await tx.localEndereco.delete({
                    where: { id_endereco_local: id }
                });
            });

            logger.info("Endereço excluído com sucesso!");
            return response.success(res, "Endereço removido com sucesso!");
        } catch (error) {
            logger.error({ err: error }, "Erro ao executar: EnderecoController -> excluirEndereco()");
            return response.serverError(res, "Erro ao eliminar o endereço solicitado.");
        }
    }
}

module.exports = new LocaisEnderecosController();