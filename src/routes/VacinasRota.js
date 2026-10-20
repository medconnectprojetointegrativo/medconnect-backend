const { Router } = require("express");

class VacinasRota {
  constructor() {
    this.router = new Router();
    this.controllers();
    this.middlewares();
    this.routes();
  }

  controllers() {
    this.vacinasController = require("../controllers/VacinasController");
    this.vacinasDosesEsquema = require("../controllers/VacinasDosesEsquemaController");
    this.pacientesVacinacoesController = require("../controllers/PacientesVacinacoesController");
  }

  routes() {
    this.vacinasRota();
    this.vacinasDosesEsquemaRota();
    this.pacientesVacinacoesRota();
  }

  middlewares() {}

  // Definição de rotas para Vacinas
  vacinasRota() {
    this.router.get("/", this.vacinasController.buscarTodasVacinas);
    this.router.get("/:id_vacina", this.vacinasController.buscarVacina);
    this.router.post("/", this.vacinasController.criarVacina);
    this.router.put("/:id_vacina", this.vacinasController.atualizarVacina);
    this.router.delete("/:id_vacina", this.vacinasController.excluirVacina);
  }

  // Definição de rotas para Esquemas de Doses
  vacinasDosesEsquemaRota() {
    this.router.get("/esquemas", this.vacinasDosesEsquema.buscarTodasDosesEsquema);
    this.router.get("/esquemas/:id_esquema", this.vacinasDosesEsquema.buscarDoseEsquema);
    this.router.post("/esquemas", this.vacinasDosesEsquema.criarDoseEsquema);
    this.router.put("/esquemas/:id_esquema", this.vacinasDosesEsquema.atualizarDoseEsquema);
    this.router.delete("/esquemas/:id_esquema", this.vacinasDosesEsquema.excluirDoseEsquema);
  }

  // Definição de rotas para Vacinações de Pacientes
  pacientesVacinacoesRota() {
    this.router.get("/vacinacoes", this.pacientesVacinacoesController.buscarTodasVacinacoes);
    this.router.get("/vacinacoes/:id_vacinacao", this.pacientesVacinacoesController.buscarVacinacao);
    this.router.post("/vacinacoes", this.pacientesVacinacoesController.criarVacinacao);
    this.router.put("/vacinacoes/:id_vacinacao", this.pacientesVacinacoesController.atualizarVacinacao);
    this.router.delete("/vacinacoes/:id_vacinacao", this.pacientesVacinacoesController.excluirVacinacao);
  }
}

module.exports = new VacinasRota().router;