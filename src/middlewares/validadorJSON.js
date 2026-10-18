/**
 * Captura erros de parsing de JSON gerados pelo express.json() / body-parser
 * e retorna uma resposta amigável em vez de quebrar a aplicação.
 */
function validadorJSON(err, req, res, next) {
    // Verifica se é um erro de sintaxe do body-parser (status 400 e campo 'body')
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'Corpo da requisição contém um JSON inválido.',
            detalhes: err.message,
        });
    }

    // Se for outro tipo de erro, repassa para o próximo middleware de erro
    return next(err);
}

module.exports = validadorJSON;