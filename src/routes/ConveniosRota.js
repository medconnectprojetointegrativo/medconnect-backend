const { Router } = require('express');

class PacientesRota {
    constructor() {
        this.router = new Router();
        this.controllers();
        this.middlewares();
        this.routes();
    }

    controllers() {
        this.conveniosController = require('../controllers/ConveniosController');
        this.conveniosPlanosController = require('../controllers/ConveniosPlanosController');
    }

    routes() {
        this.conveniosRota();
        this.conveniosPlanosRota();
    }

    middlewares() {

    }

    // Definição de rotas
    // Rota padrão: /api/convenios
    conveniosRota() {
        this.router.post('/', this.conveniosController.criarConvenio);
        this.router.put('/:id_convenio', this.conveniosController.atualizarConvenio);
    }

    conveniosPlanosRota() {
        this.router.post('/planos', this.conveniosPlanosController.criarPlano);
        this.router.put('/planos/:id_plano_convenio', this.conveniosPlanosController.atualizarPlano);
    }
}

module.exports = new PacientesRota().router;