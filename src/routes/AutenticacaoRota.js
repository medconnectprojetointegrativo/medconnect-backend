const { Router } = require('express');

class AutenticacaoRota {
    constructor() {
        this.router = new Router();
        this.controllers();
        this.middlewares();
        this.routes();
    }

    controllers() {
        this.autenticacaoController = require('../controllers/AutenticacaoController');
    }

    routes() {
        this.autenticacaoRota();
    }

    middlewares() {

    }

    // Definição de rotas
    // Rota padrão: /api/autenticacao
    autenticacaoRota() {
        this.router.post('/login', this.autenticacaoController.login);
    }
}

module.exports = new AutenticacaoRota().router;