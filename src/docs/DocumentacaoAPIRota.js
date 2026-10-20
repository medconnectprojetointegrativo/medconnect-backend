const { Router } = require('express');
const path = require('path');

const swaggerJsdoc = require('swagger-jsdoc');

// Importe o arquivo que contém o redocOptions (ajuste o caminho conforme sua estrutura)
const redocConfig = require('./redoc-config');
// Gere a especificação da API dinamicamente
const apiSpecification = swaggerJsdoc(redocConfig);

// API
const apiJSONURL = "api.json";
const redocHTML =
    `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Redoc CE</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
        href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
        rel="stylesheet"
        />
        <style>
        body {
            margin: 0;
            padding: 0;
        }
        </style>
    </head>
    <body>
        <redoc spec-url="/api/docs/${apiJSONURL}"></redoc>
        <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
    </body>
    </html>
  	`
    ;

class DocumentacaoRota {
    constructor() {
        this.router = new Router();
        this.routes();
    }

    routes() {
        this.documentacaoRota();
    }

    documentacaoRota() {
        this.router.get('/', (req, res) => {
            res.setHeader(
                "Content-Security-Policy",
                "default-src * 'unsafe-inline' 'unsafe-eval'; script-src * 'unsafe-inline' 'unsafe-eval' cdn.redoc.ly; style-src * 'unsafe-inline' fonts.googleapis.com; font-src * fonts.gstatic.com;"
            );
            res.send(redocHTML);
        });

        this.router.get('/api.json', (req, res) => {
            res.json(apiSpecification);
        });

    }
}

module.exports = new DocumentacaoRota().router;
