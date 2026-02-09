# Lantify

Requisitos:

- [Bun]("https://bun.com/")
- [Docker]("https://www.docker.com/")

Para rodar o projeto:

1. Instalar as dependências

```bash
bun install
```

2. Criar um .env conforme o .env.example e colocar a chave da API da steam

```bash
cp .env.example .env
```

3. Subir os containers do docker

```bash
docker compose up -d
```

4. Subir o schema do banco:

```bash
cd packages/database
bun run db:migrate
```

5. Popular o banco com os dados de demos

```bash
cd apps/parser
bun run parse --skip-demo-parse
```

6. Rodar o projeto na pasta raiz

```bash
bun run dev
```

7. Acessar o projeto em http://localhost:3000

8. Acessar o drizzle studio em https://local.drizzle.studio
