/**
 * Mock alinhado ao schema do backend (Memoria).
 * Usado apenas com VITE_USE_MEMORIAS_MOCK=true.
 */
export const MEMORIAS_MOCK = [
  {
    _id: 'mock-mem-1',
    titulo: 'Nascimento',
    data: '3267-01-01T00:00:00.000Z',
    descricao:
      'Nasce Rafael Almeida, filho de uma professora de História e de um técnico em eletrônica. São Paulo, SP.',
    palavraChave: 'nascimento',
    integrity: 95,
    nodeColor: 'purple',
  },
  {
    _id: 'mock-mem-2',
    titulo: 'Primeira paixão por números',
    data: '3274-01-01T00:00:00.000Z',
    descricao:
      'Aos 7 anos, aprende a fazer contas de cabeça com o pai. Desenvolve fascínio por padrões e problemas matemáticos.',
    palavraChave: 'numeros',
    integrity: 85,
    nodeColor: 'blue',
  },
  {
    _id: 'mock-mem-3',
    titulo: 'O acidente na estrada',
    data: '3278-01-01T00:00:00.000Z',
    descricao:
      'Aos 11 anos, sofre um acidente de carro durante uma viagem familiar. Sai fisicamente ileso, mas passa a sentir ansiedade intensa ao viajar de carro em estradas.',
    palavraChave: 'acidente',
    integrity: 40,
    nodeColor: 'red',
  },
]
