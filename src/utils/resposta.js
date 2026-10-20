/* 
    resposta.js
    Função de resposta padronizada da API.
*/
const mandarReposta = (res, statusCodigo, status, mensagem, dados) => {
    const resposta = { status, statusCodigo, mensagem };

    if (dados !== undefined) {
        resposta.dados = dados;
    }

    return res.status(statusCodigo).json(resposta);
};

exports.success = (res, mensagem, dados) =>
    mandarReposta(res, 200, 'OK', mensagem, dados);

exports.created = (res, mensagem, dados) =>
    mandarReposta(res, 201, 'CREATED', mensagem, dados);

exports.error = (res, mensagem) =>
    mandarReposta(res, 400, 'BAD REQUEST', mensagem);

exports.unauthorized = (res, mensagem) =>
    mandarReposta(res, 401, 'UNAUTHORIZED', mensagem);

exports.notFound = (res, mensagem) =>
    mandarReposta(res, 404, 'NOT FOUND', mensagem);

exports.serverError = (res, mensagem = 'Erro interno do servidor.') =>
    mandarReposta(res, 500, 'INTERNAL SERVER ERROR', mensagem);

exports.forbidden = (res, mensagem = 'Acesso restrito.') =>
    mandarReposta(res, 403, 'FORBIDDEN', mensagem);