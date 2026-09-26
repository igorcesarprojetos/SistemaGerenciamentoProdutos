# Sistema de Gerenciamento de Produtos

Sistema web para gestão de produtos, categorias, empresas, usuários e perfis de acesso, composto por uma **API REST em .NET 8** (arquitetura em camadas) e **dois front-ends** consumindo a mesma API: uma SPA em **Angular** e uma versão em **HTML/CSS/JS puro (sem framework)**.

O sistema conta com autenticação via **JWT**, controle de acesso por perfil, multiempresa (multi-tenant por empresa) e geração de **relatórios em PDF** (FastReport).

---

## Sumário

- [Visão geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Tecnologias utilizadas](#tecnologias-utilizadas)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Modelo de dados](#modelo-de-dados)
- [Funcionalidades](#funcionalidades)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação](#autenticação)
- [Como executar o projeto](#como-executar-o-projeto)
  - [1. Banco de dados](#1-banco-de-dados)
  - [2. API (.NET)](#2-api-net)
  - [3. Front-end Angular](#3-front-end-angular)
  - [4. Front-end sem framework](#4-front-end-sem-framework)
- [Configuração de ambiente](#configuração-de-ambiente)
- [Relatórios em PDF](#relatórios-em-pdf)
- [Licença](#licença)

---

## Visão geral

O **Sistema de Gerenciamento de Produtos** permite que empresas cadastradas controlem seu catálogo de produtos, organizado por categorias, e gerenciem os usuários que acessam o sistema, cada um vinculado a um perfil de acesso. O login é feito por usuário/senha e retorna um token JWT que identifica a empresa, o usuário e o perfil logado.

## Arquitetura

A API segue uma arquitetura em camadas (**Main → Domain → Repository**), com injeção de dependência, padrão *Repository* genérico, DTOs de entrada/saída e mapeamento via **AutoMapper**:

```
1-GerenciamentoProdutos.Main         → API (Controllers, Program.cs, Swagger, JWT, relatórios)
2-GerenciamentoProdutos.Domain       → Entidades, DTOs, Interfaces, Services e regras de negócio
3-GerenciamentoProdutos.Repository   → Contexto do Entity Framework Core e implementação dos repositórios
```

Fluxo de uma requisição:

```
Front-end (Angular ou HTML/JS)
        │  HTTP + Bearer Token
        ▼
Controller (Main)
        │  DTO → Entidade (AutoMapper)
        ▼
Service (Domain)
        │
        ▼
Repository (Repository)
        │  Entity Framework Core
        ▼
SQL Server
```

## Tecnologias utilizadas

### Back-end (API)
- **.NET 8** (ASP.NET Core Web API)
- **Entity Framework Core 8** (SQL Server)
- **AutoMapper** — mapeamento entre entidades e DTOs
- **JWT Bearer Authentication** — autenticação/autorização
- **Swagger / Swashbuckle** — documentação interativa da API
- **FastReport (OpenSource)** — geração de relatórios em PDF
- **Newtonsoft.Json**

### Front-end principal (Angular)
- **Angular 21** (standalone components, SSR com Express)
- **RxJS**
- **ngx-bootstrap**
- **ngx-mask**
- **Chart.js / ng2-charts** — gráficos do dashboard
- **Tailwind CSS**
- **TypeScript**

### Front-end alternativo (sem framework)
- **HTML5 / CSS3 / JavaScript** puro
- **Axios** — consumo da API
- Autenticação e sessão via `localStorage`

### Banco de dados
- **SQL Server** — script de criação (`.sql`) e backup (`.bak`) disponíveis em `BancoDeDados/`

## Estrutura do repositório

```
SistemaGerenciamentoProdutos/
├── 1-GerenciamentoProdutos.Main/          # API - Controllers, Program.cs, appsettings, relatórios (.frx)
├── 2-GerenciamentoProdutos.Domain/        # Entidades, DTOs, Services, Interfaces, Mapper
├── 3-GerenciamentoProdutos.Repository/    # DbContext, Configurations, Repositórios
├── BancoDeDados/                          # Script .sql e backup .bak do banco
├── Executavel FastReport/                 # Executáveis auxiliares do FastReport (x86/x64)
└── FrontEnd/
    ├── Framework Angular/sistgereprod/    # SPA Angular (front-end principal)
    ├── SemFramework/sistgereprod/         # Front-end em HTML/CSS/JS puro
    └── Diversos/                          # Versão estática de apoio/protótipo
```

### Módulos do back-end (Domain)

| Camada         | Conteúdo                                                                 |
|----------------|---------------------------------------------------------------------------|
| `Entities`     | `Produto`, `Categoria`, `Empresa`, `Usuario`, `Perfil` (+ `BaseEntitie`) |
| `DTOs`         | DTOs de `Create` e `Update` por entidade, além de `LoginDTO`/`AuthenticationDTO` |
| `Interface`    | Contratos de `Repository` e `Service` por entidade                      |
| `Service`      | Regras de negócio de cada entidade                                      |
| `Mapper`       | `ApplicationMapper` (perfis do AutoMapper)                              |
| `Helper`       | `HelperSHA256` — utilitário de hash                                     |

### Páginas do front-end (Angular)

| Página                | Descrição                                              |
|------------------------|---------------------------------------------------------|
| `login`                | Autenticação do usuário                                 |
| `registrar`            | Cadastro de nova empresa e usuário                       |
| `dashboard`            | Indicadores e gráficos (Chart.js)                        |
| `produtos`             | CRUD de produtos e emissão de relatório em PDF            |
| `categorias`           | CRUD de categorias de produtos                            |
| `empresa`              | CRUD de empresas                                          |
| `usuarios`             | CRUD de usuários                                           |
| `perfis`               | CRUD de perfis de acesso                                   |

O front-end sem framework (`FrontEnd/SemFramework`) replica as mesmas telas (`dashboard`, `empresas`, `login`, `perfis`, `produtos`, `usuarios`) em HTML/JS puro, útil como referência de integração direta com a API via Axios.

## Modelo de dados

- **Empresa**: `NomeFantasia`, `RazaoSocial`, `CNPJ`
- **Usuario**: `Nome`, `Login`, `Senha`, `Email`, `EmpresaId`, `PerfilId`, `IndAtivo`
- **Perfil**: `DescricaoPerfil`
- **Categoria**: `Descricao`
- **Produto**: `Codigo`, `Nome`, `Descricao`, `Marca`, `QuantidadeEstoque`, `Preco`, `CategoriaId`

Todas as entidades herdam de `BaseEntitie` (chave primária `Id`) e possuem validações de obrigatoriedade/tamanho via *Data Annotations*.

## Funcionalidades

- Cadastro público de **empresa** e **usuário com perfil de "Registro Inicial"** (tela de registro)
- **Login** com geração de token JWT (contendo usuário, empresa e perfil)
- CRUD completo de **Produtos**, **Categorias**, **Empresas**, **Usuários** e **Perfis** . **OBS: Para ter acesso a todos esses CRUDs o usuario terá que alterar seu perfil para "Administrador"
- Endpoints protegidos por `[Authorize]` (exceto login e registro)
- **Dashboard** com indicadores e gráficos no front-end Angular
- **Emissão de relatório em PDF** de Produtos e de Categorias (FastReport)
- Documentação interativa via **Swagger UI**, com suporte a autenticação Bearer

## Endpoints da API

Todos os endpoints (exceto os de `Authentication`) exigem o cabeçalho `Authorization: Bearer <token>`.

### Authentication
| Método | Rota                                      | Descrição                              |
|--------|--------------------------------------------|------------------------------------------|
| POST   | `/Authentication/login`                    | Autentica o usuário e retorna o token JWT |
| POST   | `/Authentication/registrar-usuario`        | Registra um novo usuário                  |
| POST   | `/Authentication/registrar-empresa`        | Registra uma nova empresa                 |
| GET    | `/Authentication/obter-empresa-registro`   | Lista empresas disponíveis para vínculo   |

### Produto
| Método | Rota                        | Descrição                    |
|--------|------------------------------|-------------------------------|
| GET    | `/Produto`                  | Lista todos os produtos       |
| GET    | `/Produto/{id}`              | Busca produto por id          |
| POST   | `/Produto`                  | Cria um produto               |
| PUT    | `/Produto/{id}`              | Atualiza um produto            |
| PATCH  | `/Produto/{id}`              | Atualiza parcialmente          |
| DELETE | `/Produto/{id}`              | Remove um produto               |
| GET    | `/Produto/RelatorioPdf`      | Gera relatório de produtos em PDF |

### Categoria
| Método | Rota                          | Descrição                       |
|--------|--------------------------------|-----------------------------------|
| GET    | `/Categoria`                  | Lista todas as categorias         |
| GET    | `/Categoria/{id}`              | Busca categoria por id            |
| POST   | `/Categoria`                  | Cria uma categoria                |
| PUT    | `/Categoria/{id}`              | Atualiza uma categoria             |
| PATCH  | `/Categoria/{id}`              | Atualiza parcialmente              |
| DELETE | `/Categoria/{id}`              | Remove uma categoria                |
| GET    | `/Categoria/RelatorioPdf`      | Gera relatório de categorias em PDF |

### Empresa
| Método | Rota              | Descrição             |
|--------|--------------------|------------------------|
| GET    | `/Empresa`        | Lista todas as empresas |
| GET    | `/Empresa/{id}`    | Busca empresa por id    |
| POST   | `/Empresa`        | Cria uma empresa         |
| PUT    | `/Empresa/{id}`    | Atualiza uma empresa      |
| PATCH  | `/Empresa/{id}`    | Atualiza parcialmente     |
| DELETE | `/Empresa/{id}`    | Remove uma empresa         |

### Usuario
| Método | Rota               | Descrição              |
|--------|---------------------|--------------------------|
| GET    | `/Usuario`         | Lista todos os usuários  |
| GET    | `/Usuario/{id}`     | Busca usuário por id     |
| POST   | `/Usuario`         | Cria um usuário           |
| PUT    | `/Usuario/{id}`     | Atualiza um usuário        |
| PATCH  | `/Usuario/{id}`     | Atualiza parcialmente      |
| DELETE | `/Usuario/{id}`     | Remove um usuário           |

### Perfil
| Método | Rota             | Descrição            |
|--------|-------------------|------------------------|
| GET    | `/Perfil`        | Lista todos os perfis  |
| GET    | `/Perfil/{id}`    | Busca perfil por id     |
| POST   | `/Perfil`        | Cria um perfil           |
| PUT    | `/Perfil/{id}`    | Atualiza um perfil        |
| PATCH  | `/Perfil/{id}`    | Atualiza parcialmente      |
| DELETE | `/Perfil/{id}`    | Remove um perfil            |

> A documentação completa e interativa (Swagger) fica disponível em `/swagger` assim que a API é executada.

## Autenticação

1. O front-end envia `login` e `senha` para `POST /Authentication/login`.
2. A API valida as credenciais e gera um **token JWT** contendo `usuario`, `empresa` e o **perfil** (`role`) do usuário, válido por **120 minutos**.
3. O token retornado deve ser enviado em todas as requisições subsequentes no cabeçalho:
   ```
   Authorization: Bearer <token>
   ```
4. Nos front-ends, o token e os dados do usuário são armazenados em `localStorage` (`token`/`user` no Angular; `gp_token`/`gp_user` no front-end sem framework) e reaplicados automaticamente a cada requisição via interceptor.

## Como executar o projeto

### Pré-requisitos

- [.NET SDK 8](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/sql-server) (Express ou superior)
- [Node.js](https://nodejs.org/) e npm (para o front-end Angular)
- Visual Studio 2022 / VS Code (opcional, facilita a execução)

### 1. Banco de dados

Os artefatos do banco estão em `BancoDeDados/`:
- `SistemaGerenciamentoProdutos.sql` — script de criação das tabelas
- `SistemaGerenciamentoProdutos.bak` — backup completo do banco

Restaure o `.bak` no SQL Server Management Studio ou execute o script `.sql` para criar o banco `SistemaGerenciamentoProdutos` do zero.

### 2. API (.NET)

```bash
cd 1-GerenciamentoProdutos.Main
dotnet restore
dotnet run
```

Configure a *connection string* e as chaves JWT em `appsettings.Development.json` (veja [Configuração de ambiente](#configuração-de-ambiente)). Por padrão a API é servida com Swagger habilitado em `/swagger`.

### 3. Front-end Angular

```bash
cd "FrontEnd/Framework Angular/sistgereprod"
npm install
npm start        # ng serve — http://localhost:4200
```

Antes de rodar, ajuste a URL da API em `src/environments/environment.development.ts` (ambiente local) e `environment.production.ts` (produção), conforme o endereço onde a API estiver publicada.

Outros comandos úteis:
```bash
npm run build     # build de produção em dist/
npm test          # testes unitários
```

### 4. Front-end sem framework

Basta servir a pasta `FrontEnd/SemFramework/sistgereprod/src` com qualquer servidor estático (ex.: extensão *Live Server* do VS Code) e abrir `index.html` / `pages/login/login.html`.

Ajuste a constante `BASE_URL` no arquivo `src/common.js` para apontar para o endereço da API:
```js
const BASE_URL = 'https://localhost:7204/';
```

## Configuração de ambiente

No arquivo `1-GerenciamentoProdutos.Main/appsettings.Development.json` (ou `appsettings.json` em produção), configure:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=SEU_SERVIDOR;Initial Catalog=SistemaGerenciamentoProdutos;User ID=SEU_USUARIO;Password=SUA_SENHA;Encrypt=False"
  },
  "Jwt": {
    "Key": "sua-chave-secreta-com-tamanho-adequado",
    "Issuer": "SistemaGerenciamentoProdutos",
    "Audience": "ClienteSistemaGerenciamentoProdutos"
  }
}
```

> ⚠️ **Importante**: não versione credenciais reais de banco de dados e chaves JWT em repositórios públicos. Substitua os valores acima pelos dados do seu ambiente e, preferencialmente, use *user secrets* ou variáveis de ambiente em produção.

## Relatórios em PDF

Os endpoints `GET /Produto/RelatorioPdf` e `GET /Categoria/RelatorioPdf` geram relatórios usando **FastReport OpenSource**, a partir dos templates `.frx` localizados em `1-GerenciamentoProdutos.Main/Reports/`. O PDF é gerado em memória e retornado diretamente na resposta HTTP (`application/pdf`).

## Licença

Projeto de uso educacional/portfólio. Ajuste esta seção conforme a licença desejada (ex.: MIT) antes de publicar o repositório.
