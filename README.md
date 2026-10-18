# MedConnect API

O MedConnect é uma API RESTful desenvolvida em Node.js para a gestão unificada de pacientes, profissionais de saúde, usuários e convênios. Abaixo estão as instruções completas para configurar o ambiente, inicializar o banco de dados com Prisma ORM e executar a documentação automatizada.

## Tecnologias Utilizadas
* **Node.js & Express:** Roteamento e arquitetura MVC.
* **Prisma ORM:** Modelagem de dados e migrações.
* **PostgreSQL:** Banco de dados relacional principal.
* **Swagger/Redoc:** Geração e interface de documentação OpenAPI 3.0.

## Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 16.x ou superior)
* [PostgreSQL](https://www.postgresql.org/) rodando localmente ou em nuvem.

## Configuração Inicial

**1. Clone o repositório e instale as dependências**
```bash
git clone https://github.com/medconnectprojetointegrativo/medconnect-backend.git
cd medconnect-backend
npm install
```

**2. Configuração das Variáveis de Ambiente**
Na raiz do projeto, crie um arquivo chamado `.env` e configure as variáveis de ambiente conforme o arquivo .env.example:
```env
AMBIENTE=DESENVOLVIMENTO/PRODUÇÃO
BACKEND_PORT=3000

FRONTEND_PRD_URL=https://seu.site.com.br
FRONTEND_DEV_URL=http://localhost:5173

PRISMA_DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/medconnect?schema=public"
DATABASE=medconnect
DATABASE_USER=postgres
DATABASE_USER_PASSWORD=
DATABASE_HOST=localhost
DATABASE_PORT=5432

JWT_SECRET=
JWT_EXPIRES_IN=8h

ADMIN_LOGIN=admin
ADMIN_EMAIL=admin@admin.com
ADMIN_SENHA_INICIAL=
```

## Banco de Dados com Prisma

Com o `.env` configurado, você precisa criar as tabelas no PostgreSQL e gerar o cliente do Prisma para que o Node.js consiga se comunicar com o banco.

**1. Execute as Migrações**
Este comando lê os esquemas (como `pacientes.prisma` e `usuarios.prisma`), cria as tabelas no banco de dados e sincroniza o histórico de migrações.
```bash
npm run prisma-migrate --name init_medconnect
```

**2. Execute as Seeds**
Este comando executa as seeds de credenciais de admin.
```bash
npm run prisma-seed
```

**3. Gere o Prisma Client**
Sempre que você alterar seus arquivos `.prisma`, rode este comando para atualizar as tipagens no código JavaScript:
```bash
npm run prisma-generate-schemas
```
*(Nota: Se você possui um script customizado no `package.json`, pode usar `npm run prisma-generate-schemas`).*

## Executando a Aplicação

Inicie o servidor de desenvolvimento. O projeto deve escutar na porta definida no seu arquivo `.env` (padrão `3000`).

```bash
# Inicialização padrão
npm start

# Inicialização com recarregamento automático
npm run dev
```

## Documentação da API

O MedConnect utiliza arquivos `.yaml` independentes integrados via `swagger-jsdoc` e servidos em uma interface Redoc. Com o servidor rodando, você pode acessar as rotas e visualizar os *schemas* detalhados de requisição e resposta.

* **Interface da Documentação:** Acesse `http://localhost:3000/api/docs`.
* **JSON Raw da API:** A especificação pura gerada dinamicamente fica disponível em `http://localhost:3000/api/docs/api.json`.