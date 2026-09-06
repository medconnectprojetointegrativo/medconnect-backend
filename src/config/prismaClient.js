const { loadEnvFile } = require('node:process');
loadEnvFile();

const { PrismaClient } = require('../models/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// 1. Configura o pool de conexão do PostgreSQL
const pool = new Pool({
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_USER_PASSWORD,
});

// 2. Cria o adaptador do Prisma
const adapter = new PrismaPg(pool);

// 3. Instancia o cliente injetando o adaptador
const prisma = new PrismaClient({ adapter });

module.exports = prisma;