const { Router } = require('express');

class UsuariosRota {
    constructor() {
        this.router = new Router();
        this.controllers();
        this.middlewares();
        this.routes();
    }

    controllers() {
        this.usuariosController = require('../controllers/UsuariosController');
    }

    routes() {
        this.usuariosRota();
    }

    middlewares() {

    }

    // Definição de rotas
    // Rota padrão: /api/usuarios
    usuariosRota() {
        this.router.get('/:id_usuario', this.usuariosController.buscarUsuario);
        this.router.get('/', this.usuariosController.buscarTodosUsuarios);
        this.router.post('/paciente', this.usuariosController.criarUsuarioPaciente);
        this.router.post('/profissional', this.usuariosController.criarUsuarioProfissional);
        this.router.put('/:id_usuario', this.usuariosController.atualizarUsuario);
        this.router.delete('/:id_usuario', this.usuariosController.excluirUsuario);
    }
}

module.exports = new UsuariosRota().router;