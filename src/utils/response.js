// Função base para montar a resposta e evitar repetição de código
const sendResponse = (res, statusCode, status, message, data) => {
    const response = { status, statusCode, message };

    if (data !== undefined) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

exports.success = (res, message, data) =>
    sendResponse(res, 200, 'OK', message, data);

exports.created = (res, message, data) =>
    sendResponse(res, 201, 'CREATED', message, data);

exports.error = (res, message) =>
    sendResponse(res, 400, 'BAD REQUEST', message);

exports.unauthorized = (res, message) =>
    sendResponse(res, 401, 'UNAUTHORIZED', message);

exports.notFound = (res, message) =>
    sendResponse(res, 404, 'NOT FOUND', message);

exports.serverError = (res, message = 'Erro interno do servidor.') =>
    sendResponse(res, 500, 'INTERNAL SERVER ERROR', message);

exports.forbidden = (res, message = 'Acesso restrito.') =>
    sendResponse(res, 403, 'FORBIDDEN', message);