# Projeto PSI 2025/2026 - Gestor de Coleções de Álbuns

## Elementos do Grupo
* Diogo Pereira, nº61791
* João Oliveira, nº61873
* Miguel Esteves, nº61831
* Tomás Dias, nº61858

## Pré-requisitos
* [Node.js](https://nodejs.org/) (v22+)
* [MongoDB](https://www.mongodb.com/) (a correr localmente no porto `27017`)
* [Angular CLI](https://angular.dev/tools/cli) (v21+)

## Como executar a aplicação

### 1. Backend (API)
Abra um terminal na raiz do projeto e execute:
```bash
# Instalar as Dependências
npm install

# Popular a Base de Dados Com os Álbuns Iniciais
npm run seed

# Arrancar o Servidor (Nodemon)
npm run dev
```
(O servidor ficará à escuta em http://localhost:3000)

### Endpoint do perfil do utilizador autenticado
Depois de fazer login, usa o token JWT no header:
```bash
Authorization: Bearer <token>
```

Endpoint disponível:
```bash
GET /api/users/me
```

Este endpoint devolve os dados do utilizador autenticado sem a password e com o artista favorito populado, se existir.

### 2. Frontend (Angular)
Abra um terminal na raiz do projeto e execute:
```bash
cd frontend
npm install   # (apenas na 1ª vez)
npm start     # (ou ng serve)
```
(Aceda à interface em http://localhost:4200)

## Limpar e Reiniciar a Base de Dados
Para voltar ao estado limpo inicial (apenas com os álbuns iniciais):
1. Abra o MongoDB Compass.
2. Conecte-te ao seu localhost.
3. Elimine a base de dados chamada psi (clicando no ícone do caixote do lixo).
4. No terminal da raiz do projeto (Backend), corra novamente o comando de seed:

```Bash
npm run seed
```





### O que por no .yaml para testar no Swagger
openapi: 3.0.3
info:
  title: PSI API
  version: 1.0.0
  description: API de utilizadores e artistas
servers:
  - url: http://localhost:3000
tags:
  - name: Users
  - name: Artists
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
  schemas:
    RegisterRequest:
      type: object
      required:
        - username
        - email
        - password
        - dataNascimento
      properties:
        username:
          type: string
          example: joao123
        email:
          type: string
          format: email
          example: joao@email.com
        password:
          type: string
          example: Password123
        dataNascimento:
          type: string
          format: date
          example: 2000-05-21

    LoginRequest:
      type: object
      required:
        - identifier
        - password
      properties:
        identifier:
          type: string
          example: joao123
        password:
          type: string
          example: Password123

    UpdateUsernameRequest:
      type: object
      required:
        - username
      properties:
        username:
          type: string
          example: novoUsername

    UpdatePasswordRequest:
      type: object
      required:
        - currentPassword
        - newPassword
      properties:
        currentPassword:
          type: string
          example: Password123
        newPassword:
          type: string
          example: NewPassword123

paths:
  /api/users/register:
    post:
      tags:
        - Users
      summary: Registar utilizador
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/RegisterRequest'
      responses:
        '201':
          description: Utilizador criado

  /api/users/login:
    post:
      tags:
        - Users
      summary: Login
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Login com sucesso (devolve token JWT)

  /api/users/me:
    get:
      tags:
        - Users
      summary: Perfil do utilizador autenticado
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Perfil devolvido
        '401':
          description: Nao autenticado

  /api/users/me/username:
    put:
      tags:
        - Users
      summary: Atualizar username
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateUsernameRequest'
      responses:
        '200':
          description: Username atualizado

  /api/users/me/password:
    put:
      tags:
        - Users
      summary: Atualizar password
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdatePasswordRequest'
      responses:
        '200':
          description: Password atualizada

  /api/users/me/favorite-artist:
    delete:
      tags:
        - Users
      summary: Remover artista favorito
      security:
        - bearerAuth: []
      responses:
        '200':
          description: Artista favorito removido

  /api/artists/search:
    get:
      tags:
        - Artists
      summary: Pesquisar artistas
      parameters:
        - in: query
          name: q
          required: true
          schema:
            type: string
          example: metallica
      responses:
        '200':
          description: Lista de artistas

  /api/artists/{id}:
    get:
      tags:
        - Artists
      summary: Obter artista por ID
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Detalhe do artista

  /api/artists/{id}/albums:
    get:
      tags:
        - Artists
      summary: Obter albuns de um artista
      parameters:
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Lista de albuns do artista
