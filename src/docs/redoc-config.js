const redocConfig = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'MedConnect API',
            version: '1.0.0',
            description: 'Documentação da API do projeto MedConnect - Gestão de Pacientes, Profissionais e Convênios',
            contact: {
                name: 'Equipe MedConnect',
                email: 'projeto.integrativo.medconnect@gmail.com'
            },
        },
        'x-tagGroups': [
            {
                name: 'Usuário',
                tags: ['Usuários', 'Autenticação', 'Funções e Permissões']
            },
            {
                name: 'Paciente',
                tags: ['Pacientes', 'Documentações de Paciente', 'Vínculos com Convênios', 'Vacinações']
            },
            {
                name: 'Profissional',
                tags: ['Profissionais', 'Documentações de Profissional', 'Registros Profissionais', 'Categorias']
            },
            {
                name: 'Convênio',
                tags: ['Convênios', 'Planos de Convênio']
            },
            {
                name: 'Operacional',
                tags: ['Procedimentos', 'Locais de Avaliação', 'Pagamentos']
            }
        ],
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento',
            },
        ],
    },
    apis: ['./src/docs/**/**/*.yaml'],
};

module.exports = redocConfig;