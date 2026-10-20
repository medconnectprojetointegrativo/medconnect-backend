const { loadEnvFile } = require('node:process');
loadEnvFile();

// Dependências
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Configuração do limitador de requisições global
const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // Janela de 5 minutos
    max: 100, // Limita cada IP a 100 requisições por janela
    message: { error: 'Muitas requisições deste IP, tente novamente em 5 minutos.' },
    standardHeaders: true, // Retorna os headers no padrão `RateLimit-*`
    legacyHeaders: false, // Desabilita os headers antigos `X-RateLimit-*`
});


// Configuração do CORS
const whitelist = [
    process.env.FRONTEND_PRD_URL,
    process.env.FRONTEND_DEV_URL
];
const corsConfig = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo CORS.'));
        }
    }
};


// Importação de rotas
const rotaDocumentacaoAPI = require('./docs/DocumentacaoAPIRota');
const rotaAutenticacao = require('./routes/AutenticacaoRota');
const rotaUsuarios = require('./routes/UsuariosRota');
const rotaPacientes = require('./routes/PacientesRota');
const rotaConvenios = require('./routes/ConveniosRota');
const rotaLocais = require('./routes/LocaisRota');

// Importação de Middlewares
const validadorJSON = require('./middlewares/validadorJsonMiddleware');

class App {
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cors(corsConfig));
        this.app.use(helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" }
        }));
        this.app.use(limiter);
        this.app.use(validadorJSON);
        this.app.use('/files', express.static(path.resolve(__dirname, '..', 'files')));
    }

    routes() {
        const apiRouter = express.Router();

        apiRouter.use('/docs', rotaDocumentacaoAPI);
        apiRouter.use('/autenticacao', rotaAutenticacao)

        apiRouter.use('/usuarios', rotaUsuarios);
        apiRouter.use('/pacientes', rotaPacientes);
        apiRouter.use('/convenios', rotaConvenios);
        apiRouter.use('/locais', rotaLocais);

        this.app.use('/api', apiRouter);
    }
}

module.exports = new App().app;