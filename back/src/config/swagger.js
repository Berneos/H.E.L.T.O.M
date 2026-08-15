const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'H.E.L.T.O.M API',
    version: '1.0.0',
    description: 'API docs for Memoria and Skill endpoints',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Local server' }],
  components: {
    schemas: {
      Memoria: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          titulo: { type: 'string' },
          data: { type: 'string', format: 'date-time' },
          descricao: { type: 'string' },
          palavraChave: { type: 'string' },
          imagem: { type: 'string', description: 'base64 payload (no data URI prefix)' },
          imagemMimeType: { type: 'string' },
          integrity: { type: 'integer', minimum: 0, maximum: 100 },
          nodeColor: { type: 'string' },
        },
      },
      Skill: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          nome: { type: 'string' },
          data: { type: 'string', format: 'date-time' },
          nivel: { type: 'string' },
          categoria: { type: 'string' },
          active: { type: 'boolean' },
          tone: { type: 'string' },
        },
      },
    },
  },
  paths: {
    '/memory/': {
      get: {
        summary: 'List all memories',
        responses: { '200': { description: 'Array of memorias', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Memoria' } } } } } },
      },
      post: {
        summary: 'Create a new memory',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { titulo: { type: 'string' }, data: { type: 'string' }, descricao: { type: 'string' }, palavraChave: { type: 'string' }, imagem: { type: 'string' }, integrity: { type: 'integer' }, nodeColor: { type: 'string' } } } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Memoria' } } } } },
      },
      delete: {
        summary: 'Delete a memory',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } } } },
        responses: { '200': { description: 'Deleted' } },
      },
      patch: {
        summary: 'Update a memory',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' }, titulo: { type: 'string' }, data: { type: 'string' }, descricao: { type: 'string' }, palavraChave: { type: 'string' }, imagem: { type: 'string' }, integrity: { type: 'integer' }, nodeColor: { type: 'string' } }, required: ['id'] } } } },
        responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Memoria' } } } } },
      },
    },
    '/memory/{keyword}': {
      get: {
        summary: 'Get memories by keyword',
        parameters: [{ name: 'keyword', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Array of memorias', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Memoria' } } } } } },
      },
    },
    '/skill/': {
      get: {
        summary: 'List all skills',
        responses: { '200': { description: 'Array of skills', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Skill' } } } } } },
      },
      post: {
        summary: 'Create a new skill',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { nome: { type: 'string' }, data: { type: 'string' }, nivel: { type: 'string' }, categoria: { type: 'string' }, active: { type: 'boolean' }, tone: { type: 'string' } }, required: ['nome', 'data'] } } } },
        responses: { '201': { description: 'Created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } } } },
      },
      delete: {
        summary: 'Delete a skill',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' } }, required: ['id'] } } } },
        responses: { '200': { description: 'Deleted' } },
      },
      patch: {
        summary: 'Update a skill',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { id: { type: 'string' }, nome: { type: 'string' }, data: { type: 'string' }, nivel: { type: 'string' }, categoria: { type: 'string' }, active: { type: 'boolean' }, tone: { type: 'string' } }, required: ['id'] } } } },
        responses: { '200': { description: 'Updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Skill' } } } } },
      },
    },
  },
};

module.exports = swaggerSpec;
