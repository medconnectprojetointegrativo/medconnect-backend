const { Router } = require("express");
const profissionaisController = require("../controllers/ProfissionaisController");
const categoriasController = require("../controllers/ProfissionaisCategoriasController");
const documentacoesController = require("../controllers/ProfissionaisDocumentacoesController");
const registrosController = require("../controllers/ProfissionaisRegistrosController");

class ProfissionaisRotas {
  constructor() {
    this.router = new Router();
    this.routes();
  }

  routes() {
    
    // 1. ROTAS DE PROFISSIONAIS
    
    this.router.get("/", profissionaisController.buscarTodosProfissionais);
    this.router.get(
      "/:id_profissional",
      profissionaisController.buscarProfissional,
    );
    this.router.post("/", profissionaisController.criarProfissional);
    this.router.put(
      "/:id_profissional",
      profissionaisController.atualizarProfissional,
    );
    this.router.delete(
      "/:id_profissional",
      profissionaisController.excluirProfissional,
    );

    
    // 2. ROTAS DE CATEGORIAS PROFISSIONAIS
   
    this.router.get(
      "/categorias/todas",
      categoriasController.buscarTodasCategorias,
    );
    this.router.get(
      "/categorias/:id_categoria_profissional",
      categoriasController.buscarCategoria,
    );
    this.router.post("/categorias", categoriasController.criarCategoria);
    this.router.put(
      "/categorias/:id_categoria_profissional",
      categoriasController.atualizarCategoria,
    );
    this.router.delete(
      "/categorias/:id_categoria_profissional",
      categoriasController.excluirCategoria,
    );

    
    // 3. ROTAS DE DOCUMENTAÇÕES PESSOAIS
    
    this.router.get(
      "/documentacoes/todas",
      documentacoesController.buscarTodosDocumentos,
    );
    this.router.get(
      "/documentacoes/:id_documento_profissional",
      documentacoesController.buscarDocumento,
    );
    this.router.post("/documentacoes", documentacoesController.criarDocumento);
    this.router.put(
      "/documentacoes/:id_documento_profissional",
      documentacoesController.atualizarDocumento,
    );
    this.router.delete(
      "/documentacoes/:id_documento_profissional",
      documentacoesController.excluirDocumento,
    );

    
    // 4. ROTAS DE REGISTROS PROFISSIONAIS (Conselhos)
    
    this.router.get(
      "/registros/todos",
      registrosController.buscarTodosRegistros,
    );
    this.router.get(
      "/registros/:id_registro_profissional",
      registrosController.buscarRegistro,
    );
    this.router.post("/registros", registrosController.criarRegistro);
    this.router.put(
      "/registros/:id_registro_profissional",
      registrosController.atualizarRegistro,
    );
    this.router.delete(
      "/registros/:id_registro_profissional",
      registrosController.excluirRegistro,
    );
  }
}

module.exports = new ProfissionaisRotas().router;
