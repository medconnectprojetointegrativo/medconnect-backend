// prisma/seed.js
const logger = require('../src/utils/logger');
const prisma = require('../src/config/prismaClient.js')
const bcrypt = require('bcryptjs');

async function seedAdmin() {
    const adminLogin = process.env.ADMIN_LOGIN;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminSenha = process.env.ADMIN_SENHA_INICIAL;

    // Gera o hash seguro da senha inicial
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminSenha, salt);

    // upsert: Cria se não existir, atualiza se já existir
    const admin = await prisma.usuario.upsert({
        where: {
            login: adminLogin,
        },
        update: {
            funcao: 'ADMIN',
        },
        create: {
            login: adminLogin,
            email: adminEmail,
            senha_hash: hashedPassword,
            funcao: 'ADMIN',
        },
    });

    logger.info(`Usuário administrador configurado: ${admin.email}`);
}

async function main() {
    await seedAdmin()
}

main()
    .catch((e) => {
        console.error('❌ Erro ao executar o seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });