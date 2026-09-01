# Especificação - Document Management System

## 1. Objetivo

Fornecer um sistema web simples para que usuários enviem, listem e baixem
documentos, com armazenamento local em disco e gestão básica por usuário.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário (associação de documentos a um `owner`)

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Autenticação/autorização robusta (não há login; o `owner` é apenas um
  identificador informado pelo cliente)
- Edição ou exclusão de documentos

## 3. Requisitos funcionais

| ID    | Requisito                                                              |
| ----- | ----------------------------------------------------------------------|
| RF-01 | O usuário pode enviar um documento                                    |
| RF-02 | O usuário pode listar os documentos enviados                          |
| RF-03 | O usuário pode baixar um documento pelo identificador                 |
| RF-04 | Cada documento enviado é associado ao `owner` informado no upload     |
| RF-05 | O download de um `id` inexistente retorna erro 404                    |
| RF-06 | O upload sem arquivo anexado retorna erro 400                         |
| RF-07 | A listagem pode ser filtrada por `owner` através de query string      |

## 4. Requisitos não funcionais

| ID     | Requisito                                                              |
| ------ | ------------------------------------------------------------------------|
| RNF-01 | Arquivos gravados no filesystem local via multer (`diskStorage`)        |
| RNF-02 | Metadados mantidos em memória nesta fase                                |
| RNF-03 | Configuração via variáveis de ambiente (12-Factor)                       |
| RNF-04 | Backend em Clean Architecture simples (routes → controllers → services → repositories), com dependência unidirecional |
| RNF-05 | Testes de backend com o runner nativo `node:test`                       |
| RNF-06 | Tamanho máximo de upload configurável via variável de ambiente (ex.: `MAX_UPLOAD_SIZE_MB`, padrão 10 MB) |
| RNF-07 | Nome do arquivo sanitizado/gerado internamente para evitar path traversal |

## 5. Modelo de dados (metadados do documento)

| Campo        | Tipo   | Descrição                                                  |
| ------------ | ------ | ----------------------------------------------------------|
| id           | string | Identificador único do documento (`crypto.randomUUID()`)   |
| originalName | string | Nome original do arquivo enviado                           |
| storedName   | string | Nome interno do arquivo em disco (`id` + extensão original), uso interno, não exposto na API |
| mimeType     | string | Tipo de conteúdo do arquivo                                 |
| size         | number | Tamanho em bytes                                            |
| uploadedAt   | string | Data/hora do upload (ISO 8601)                              |
| owner        | string | Identificador do usuário dono, informado pelo cliente (padrão `"anonymous"` se ausente) |

## 6. Contratos de API

### POST /upload

- Entrada: `multipart/form-data`
  - `file` (obrigatório): arquivo a ser enviado
  - `owner` (opcional): identificador do usuário; padrão `"anonymous"` se ausente
- Saída (201 Created): metadados do documento criado
  - `{ id, originalName, mimeType, size, uploadedAt, owner }`
- Erros:
  - 400 Bad Request: nenhum arquivo enviado
  - 400 Bad Request: arquivo excede o tamanho máximo permitido

### GET /documents

- Entrada: query string opcional `owner` para filtrar por dono
- Saída (200 OK): lista de metadados de documentos
  - `[{ id, originalName, mimeType, size, uploadedAt, owner }, ...]`

### GET /documents/:id/download

- Saída (200 OK): conteúdo binário do arquivo
  - Header `Content-Type`: mimeType do documento
  - Header `Content-Disposition: attachment; filename="<originalName>"`
- Erros:
  - 404 Not Found: quando o `id` não corresponde a nenhum documento

## 7. Decisões arquiteturais

- Backend em Clean Architecture simples (`routes`, `controllers`, `services`,
  `repositories`), camadas internas não conhecem camadas externas.
- Repositório de metadados (em memória) separado do repositório/helper de
  armazenamento em disco; ambos usados pela camada de serviços.
- Identificadores de documento gerados com `crypto.randomUUID()` (nativo do
  Node.js, sem nova dependência).
- Nome do arquivo em disco é o `id` + extensão original, evitando colisões e
  path traversal; o `originalName` é preservado apenas nos metadados.
- Frontend baseado em componentes React (`components/`, `pages/`,
  `services/`), comunicação com o backend via `fetch` através do prefixo
  `/api` (proxy do Vite).
- Armazenamento estritamente local, sem provedores externos.

## 8. Plano de execução

1. Backend — camada `repositories` (metadados em memória e armazenamento em disco)
2. Backend — camada `services` (validação, geração de id, regras de negócio)
3. Backend — camada `controllers` (tratamento de entrada/saída HTTP)
4. Backend — camada `routes` (registro dos endpoints em `app.js`)
5. Backend — testes com `node:test` cobrindo os três endpoints
6. Frontend — serviço de API (`services/`) para upload, listagem e download
7. Frontend — páginas/componentes (formulário de upload, lista de documentos, ação de download)
8. Frontend — integração e testes manuais end-to-end
