const fs = require('fs');
const path = require('path');
const logger = require('./logger');

/*
    inicializarArmazenamento.js
    Função de geração da pasta "files", no qual a API direciona arquivos para armazenamento físico.
*/
function inicializarPastasArmazenamento() {
    const diretorioBase = path.resolve(__dirname, '..', '..', 'files');

    // Lista de subpastas necessárias no projeto
    const subPastas = [
        'LocaisImagens'
        // Adicione outras conforme necessário: 'documentos', 'avatares', etc.
    ];

    try {
        // Cria a pasta raiz /files caso não exista
        if (!fs.existsSync(diretorioBase)) {
            fs.mkdirSync(diretorioBase, { recursive: true });
        }

        // Cria cada subpasta individualmente
        subPastas.forEach((pasta) => {
            const caminhoCompleto = path.join(diretorioBase, pasta);
            if (!fs.existsSync(caminhoCompleto)) {
                fs.mkdirSync(caminhoCompleto, { recursive: true });
            }
        });

        logger.info('Estrutura de diretórios de armazenamento verificada/criada com sucesso!');
    } catch (error) {
        logger.error({ err: error }, 'Erro ao criar a estrutura de diretórios de arquivos.');
        process.exit(1); // Encerra a aplicação caso falte permissão no sistema de ficheiros
    }
}

module.exports = inicializarPastasArmazenamento;