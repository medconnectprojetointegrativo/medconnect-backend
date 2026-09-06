const { Router } = require('express');

class PacientesRota {
    constructor() {
        this.router = new Router();
        this.controllers();
        this.middlewares();
        this.routes();
    }

    controllers() {
        this.pacientesController = require('../controllers/PacientesController');
        this.pacientesDocumentosController = require('../controllers/PacientesDocumentosController');
        this.pacientesConveniosController = require('../controllers/PacientesConveniosController');
    }

    routes() {
        this.pacientesRota();
        this.pacientesDocumentosRota();
        this.pacientesConveniosRota();
    }

    middlewares() {

    }

    // Definição de rotas
    // Rota padrão: /api/pacientes
    pacientesRota() {
        this.router.get('/:id_paciente', this.pacientesController.buscarPaciente);
        this.router.get('/', this.pacientesController.buscarTodosPacientes);
        this.router.post('/', this.pacientesController.criarPaciente);
        this.router.put('/:id_paciente', this.pacientesController.atualizarPaciente);
        this.router.delete('/:id_paciente', this.pacientesController.excluirPaciente);
    }

    pacientesDocumentosRota() {
        this.router.post('/:id_paciente/documentos', this.pacientesDocumentosController.criarDocumento);
        this.router.put('/documentos/:id_documento_paciente', this.pacientesDocumentosController.atualizarDocumento);
        this.router.delete('/documentos/:id_documento_paciente', this.pacientesDocumentosController.excluirDocumento);
    }

    pacientesConveniosRota() {
        this.router.post('/:id_paciente/convenios', this.pacientesConveniosController.vincularConvenio);
        this.router.put('/convenios/:id_convenio_paciente', this.pacientesConveniosController.atualizarVinculo);
        this.router.delete('/convenios/:id_convenio_paciente', this.pacientesConveniosController.excluirVinculo);
    }
}

module.exports = new PacientesRota().router;