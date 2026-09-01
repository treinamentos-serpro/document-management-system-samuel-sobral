const { test } = require('node:test');
const assert = require('node:assert');
const { once } = require('node:events');

const app = require('../src/app');

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function startServer() {
  const server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  return { server, port };
}

test('POST /api/documents/upload salva documento e devolve metadados', async () => {
  const { server, port } = await startServer();

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['arquivo de teste'], { type: 'text/plain' }), 'sample.txt');
    formData.append('owner', 'alice');

    const response = await fetch(`http://127.0.0.1:${port}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(response.status, 201);

    const body = await response.json();
    assert.strictEqual(body.owner, 'alice');
    assert.strictEqual(body.originalName, 'sample.txt');
    assert.ok(body.id);
    assert.ok(body.uploadedAt);
  } finally {
    server.close();
  }
});

test('GET /api/documents lista documentos por owner', async () => {
  const { server, port } = await startServer();

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['arquivo de teste'], { type: 'text/plain' }), 'sample.txt');
    formData.append('owner', 'bob');

    await fetch(`http://127.0.0.1:${port}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    const response = await fetch(`http://127.0.0.1:${port}/api/documents?owner=bob`);
    assert.strictEqual(response.status, 200);

    const body = await response.json();
    assert.strictEqual(Array.isArray(body), true);
    assert.strictEqual(body.length >= 1, true);
    assert.strictEqual(body[0].owner, 'bob');
  } finally {
    server.close();
  }
});

test('GET /api/documents/:id/download retorna o arquivo salvo', async () => {
  const { server, port } = await startServer();

  try {
    const formData = new FormData();
    formData.append('file', new Blob(['conteúdo de teste para download'], { type: 'text/plain' }), 'report.txt');
    formData.append('owner', 'neto');

    const uploadResponse = await fetch(`http://127.0.0.1:${port}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    const uploaded = await uploadResponse.json();

    const downloadResponse = await fetch(`http://127.0.0.1:${port}/api/documents/${uploaded.id}/download`);
    const text = await downloadResponse.text();

    assert.strictEqual(downloadResponse.status, 200);
    assert.match(text, /conteúdo de teste para download/);
  } finally {
    server.close();
  }
});

test('POST /api/documents/upload ignora id informado pelo cliente', async () => {
  const { server, port } = await startServer();

  try {
    const formData = new FormData();
    formData.append('id', '../fora-do-storage');
    formData.append('file', new Blob(['conteúdo seguro'], { type: 'text/plain' }), 'safe.txt');
    formData.append('owner', 'carol');

    const response = await fetch(`http://127.0.0.1:${port}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(response.status, 201);

    const body = await response.json();
    assert.match(body.id, UUID_PATTERN);
    assert.notStrictEqual(body.id, '../fora-do-storage');
  } finally {
    server.close();
  }
});

test('POST /api/documents/upload sem arquivo retorna 400', async () => {
  const { server, port } = await startServer();

  try {
    const formData = new FormData();
    formData.append('owner', 'dora');

    const response = await fetch(`http://127.0.0.1:${port}/api/documents/upload`, {
      method: 'POST',
      body: formData,
    });

    assert.strictEqual(response.status, 400);

    const body = await response.json();
    assert.strictEqual(body.message, 'Arquivo obrigatório.');
  } finally {
    server.close();
  }
});

test('GET /api/documents/:id/download com id inexistente retorna 404', async () => {
  const { server, port } = await startServer();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/documents/00000000-0000-4000-8000-000000000000/download`);

    assert.strictEqual(response.status, 404);

    const body = await response.json();
    assert.strictEqual(body.message, 'Documento não encontrado.');
  } finally {
    server.close();
  }
});
