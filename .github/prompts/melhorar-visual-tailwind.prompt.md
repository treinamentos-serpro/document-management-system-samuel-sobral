---
description: "Melhora o visual do frontend do DMS usando Tailwind CSS 3."
name: melhorar-visual-tailwind
argument-hint: "escopo opcional da melhoria visual"
agent: tailwind-ui
---

# Melhorar visual com Tailwind CSS 3

Implemente uma melhoria visual no frontend do Document Management System usando Tailwind CSS 3.

Escopo informado pelo usuário: `${input:escopo:melhorar a interface atual de upload, listagem, filtro e download}`.

## Contexto do projeto

- Frontend: React + Vite em `frontend`.
- Componentes atuais: `App.jsx`, `UploadComponent.jsx`, `DocumentList.jsx` e `DownloadButton.jsx`.
- Backend: Express com endpoints consumidos via `/api` pelo frontend.
- O DMS precisa continuar suportando upload, listagem, filtro por owner, atualização e download.

## Tarefa

1. Configure Tailwind CSS 3 no frontend, se ainda não estiver configurado.
2. Instale apenas as dependências necessárias no `frontend`, fixando Tailwind na versão 3.
3. Crie ou ajuste os arquivos de configuração do Tailwind e PostCSS.
4. Adicione o CSS global com as diretivas `@tailwind base`, `@tailwind components` e `@tailwind utilities`.
5. Importe o CSS global no entrypoint React.
6. Refatore os estilos inline dos componentes para classes Tailwind.
7. Crie uma interface mais moderna, responsiva e coerente com uma aplicação operacional de gestão de documentos.
8. Preserve comportamento, contratos da API, mensagens em português e acessibilidade básica.

## Direção visual

- Aparência limpa, profissional e utilitária.
- Layout focado em produtividade, com boa hierarquia entre upload, filtros e lista.
- Estados visuais claros para carregamento, erro, lista vazia, botões disabled e foco de campos.
- Evite aparência de landing page, hero promocional ou decoração excessiva.
- Evite paleta dominada por roxo, bege, marrom ou azul escuro em excesso.

## Validação obrigatória

Ao final, execute no diretório `frontend`:

```bash
npm run build
```

Se o build falhar, corrija a causa relacionada às mudanças e execute novamente.

## Resultado esperado

Entregue a implementação completa e resuma:

- Arquivos criados ou alterados.
- Principais melhorias visuais.
- Resultado da validação.