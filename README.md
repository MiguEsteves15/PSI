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