const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * Cria uma instância do Multer configurada para uma subpasta específica dentro de /files
 * @param {string} subPasta Nome da pasta interna (ex: 'fotosLocais')
 */
const criarUploadImagemMulter = (subPasta) => {
    // Aponta para a raiz: ../../files/<subPasta>
    const destinoUpload = path.resolve(__dirname, '..', '..', 'files', subPasta);

    // Cria a pasta recursivamente caso ainda não exista
    if (!fs.existsSync(destinoUpload)) {
        fs.mkdirSync(destinoUpload, { recursive: true });
    }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, destinoUpload);
        },
        filename: (req, file, cb) => {
            const extensaoArquivo = path.extname(file.originalname);

            const timestamp = Date.now();
            const valorUnico = Math.round(Math.random() * 10000)
            const nomeArquivo =  `${timestamp}-${valorUnico}`;
            const nomeFormatado = `${nomeArquivo}${extensaoArquivo}`;

            cb(null, nomeFormatado);
        }
    });

    const fileFilter = (req, file, cb) => {
        const extensoesPermitidas = /jpeg|jpg|png|webp/;
        const extValida = extensoesPermitidas.test(path.extname(file.originalname).toLowerCase());
        const mimeValido = extensoesPermitidas.test(file.mimetype);

        if (extValida && mimeValido) {
            cb(null, true);
        } else {
            cb(new Error('Apenas ficheiros nos formatos JPEG, JPG, PNG ou WEBP são suportados.'));
        }
    };

    return multer({
        storage,
        limits: {
            fileSize: 5 * 1024 * 1024 // Limite de 5 MB
        },
        fileFilter
    });
};

module.exports = {
    uploadFotosLocais: criarUploadImagemMulter('LocaisImagens')
};