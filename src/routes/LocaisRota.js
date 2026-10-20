const { Router } = require('express');
const { uploadFotosLocais } = require('../config/multerConfig');
class LocaisRota {
    constructor() {
        this.router = new Router();
        this.controllers();
        this.middlewares();
        this.routes();
    }

    controllers() {
        this.locaisController = require('../controllers/Locais/LocaisController');
        this.locaisEnderecosController = require('../controllers/Locais/LocaisEnderecosController');
        this.locaisCategoriasController = require("../controllers/Locais/LocaisCategoriasController");
        this.locaisTiposContatosController = require("../controllers/Locais/LocaisTiposContatosController");
        this.locaisContatosController = require("../controllers/Locais/LocaisContatosController");
        this.locaisAvaliacoesController = require("../controllers/Locais/LocaisAvaliacoesController");
        this.locaisFotosController = require("../controllers/Locais/LocaisFotosController")
    }

    routes() {
        this.locaisFotosRota();
        this.locaisAvaliacoesRota();
        this.locaisContatosRota();
        this.locaisTiposContatosRota();
        this.locaisCategoriasRota();
        this.locaisEnderecosRota();
        this.locaisRota();
    }

    middlewares() {

    }

    // Definição de rotas
    // Rota padrão: /api/locais
    locaisRota() {
        this.router.get('/:id_local', this.locaisController.buscarLocal);
        this.router.get('/', this.locaisController.buscarTodosLocais);
        this.router.post('/', this.locaisController.cadastrarLocal);
        this.router.put('/:id_local', this.locaisController.atualizarLocal);
        this.router.delete('/:id_local', this.locaisController.excluirLocal);
    }

    locaisEnderecosRota() {
        this.router.get('/enderecos/:id_endereco_local', this.locaisEnderecosController.buscarEndereco);
        this.router.get('/enderecos', this.locaisEnderecosController.buscarTodosEnderecos);
        this.router.post('/enderecos', this.locaisEnderecosController.cadastrarEndereco);
        this.router.put('/enderecos/:id_endereco_local', this.locaisEnderecosController.atualizarEndereco);
        this.router.delete('/enderecos/:id_endereco_local', this.locaisEnderecosController.excluirEndereco);
    }

    locaisCategoriasRota() {
        this.router.get('/categorias', this.locaisCategoriasController.buscarTodasCategorias);
        this.router.get('/categorias/:id_categoria_local', this.locaisCategoriasController.buscarCategoria);
        this.router.post('/categorias', this.locaisCategoriasController.criarCategoria);
        this.router.put('/categorias/:id_categoria_local', this.locaisCategoriasController.atualizarCategoria);
        this.router.delete('/categorias/:id_categoria_local', this.locaisCategoriasController.excluirCategoria);
    }

    locaisContatosRota() {
        this.router.get('/:id_local/contatos', this.locaisContatosController.buscarTodosContatosPorLocal);
        this.router.get('/contatos/:id_contato_local', this.locaisContatosController.buscarContato);
        this.router.post('/contatos', this.locaisContatosController.cadastrarContato);
        this.router.put('/contatos/:id_contato_local', this.locaisContatosController.atualizarContato);
        this.router.delete('/contatos/:id_contato_local', this.locaisContatosController.excluirContato);
    }

    locaisTiposContatosRota() {
        this.router.get('/tipos-contatos', this.locaisTiposContatosController.buscarTodosTiposContatos);
        this.router.get('/tipos-contatos/:id_tipo_contato_local', this.locaisTiposContatosController.buscarTipoContato);
        this.router.post('/tipos-contatos', this.locaisTiposContatosController.cadastrarTipoContato);
        this.router.put('/tipos-contatos/:id_tipo_contato_local', this.locaisTiposContatosController.atualizarTipoContato);
        this.router.delete('/tipos-contatos/:id_tipo_contato_local', this.locaisTiposContatosController.excluirTipoContato);
    }

    locaisAvaliacoesRota() {
        this.router.get('/:id_local/avaliacoes', this.locaisAvaliacoesController.buscarTodasAvaliacoesPorLocal);
        this.router.get('/avaliacoes/:id_avaliacao_local', this.locaisAvaliacoesController.buscarAvaliacao);
        this.router.post('/avaliacoes', this.locaisAvaliacoesController.cadastrarAvaliacao);
        this.router.put('/avaliacoes/:id_avaliacao_local', this.locaisAvaliacoesController.atualizarAvaliacao);
        this.router.delete('/avaliacoes/:id_avaliacao_local', this.locaisAvaliacoesController.excluirAvaliacao);
        this.router.get('/:id_local/calcular-avaliacao', this.locaisAvaliacoesController.calcularMediaAvaliacoesPorLocal);
    }

    locaisFotosRota() {
        this.router.get('/:id_local/fotos', this.locaisFotosController.buscarTodasFotosPorLocal);
        this.router.get('/fotos/:id_foto_local', this.locaisFotosController.buscarFoto);

        // Faz o upload para 'files/fotosLocais/'
        this.router.post('/fotos', uploadFotosLocais.single('foto'), this.locaisFotosController.cadastrarFoto);

        this.router.put('/fotos/:id_foto_local', this.locaisFotosController.atualizarFoto);
        this.router.delete('/fotos/:id_foto_local', this.locaisFotosController.excluirFoto);
    }
}

module.exports = new LocaisRota().router;