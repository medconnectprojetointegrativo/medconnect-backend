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
    windowMs: 5 * 60 * 1000, // Janela de 15 minutos
    max: 100, // Limita cada IP a 100 requisições por janela
    message: { error: 'Muitas requisições deste IP, tente novamente em 15 minutos.' },
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
const rotaDocumentacao = require('./docs/DocumentacaoRota');
const rotaAutenticacao = require('./routes/AutenticacaoRota');
const rotaUsuarios = require('./routes/UsuariosRota');
const rotaPacientes = require('./routes/PacientesRota');
const rotaConvenios = require('./routes/ConveniosRota');
<<<<<<< Updated upstream
const rotaLocais = require('./routes/LocaisRota');
=======
const rotaVacinas = require("./routes/VacinasRota");
const rotaProfissionais = require("./routes/ProfissionaisRota"); 

>>>>>>> Stashed changes

// Importação de Middlewares
const validadorJSON = require('./middlewares/validadorJSON');

class App {
    constructor() {
        this.application = express();
        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.application.use(express.json());
        this.application.use(express.urlencoded({ extended: true }));
        this.application.use(cors(corsConfig));
        this.application.use(helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" }
        }));
        this.application.use(limiter);
        this.application.use(validadorJSON);
        this.application.use('/files', express.static(path.resolve(__dirname, '..', 'files')));
    }

    routes() {
        const apiRouter = express.Router();

        apiRouter.use('/docs', rotaDocumentacao);
        apiRouter.use('/autenticacao', rotaAutenticacao)

        apiRouter.use('/usuarios', rotaUsuarios);
        apiRouter.use('/pacientes', rotaPacientes);
        apiRouter.use('/convenios', rotaConvenios);
<<<<<<< Updated upstream
        apiRouter.use('/locais', rotaLocais);
=======
        apiRouter.use("/vacinas", rotaVacinas);
        apiRouter.use("/profissionais", rotaProfissionais);

>>>>>>> Stashed changes

        this.application.use('/api', apiRouter);
    }
}

module.exports = new App().application;