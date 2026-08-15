export const MEMORIAS_MOCK = {
  stats: [
    { label: 'INTEGRIDADE MÉDIA', value: '65%', tone: 'green' },
    { label: 'MEMÓRIAS INDEXADAS', value: '7', tone: 'purple' },
    { label: 'ARQUIVOS CRÍTICOS', value: '2', tone: 'yellow' },
    { label: 'CAPACIDADE USADA', value: '16.1 GB', tone: 'blue' },
  ],
  memories: [
    {
      id: 'MEM-0x7A3F',
      title: 'PRIMEIRA INFÂNCIA',
      year: 2009,
      date: '2009-03-14',
      integrity: 94,
      tags: ['#familia', '#afeto'],
      fragment:
        'A luz da manhã atravessava a cortina amarela. Alguém ria no corredor — e por um instante o mundo cabia numa janela.',
    },
    {
      id: 'MEM-0x91B2',
      title: 'PROTOCOLO ESCOLAR',
      year: 2012,
      date: '2012-08-22',
      integrity: 81,
      tags: ['#rotina', '#aprendizado'],
      fragment:
        'Corredores longos, cheiro de giz. O sinal ecoava como um checkpoint — reiniciar, avançar, gravar.',
    },
    {
      id: 'MEM-0xB21C',
      title: 'COLAPSO / EVENTO-17',
      year: 2015,
      date: '2015-11-03',
      integrity: 42,
      tags: ['#ruptura', '#alerta'],
      fragment:
        'Fragmentos desalinhados. O áudio corta. Há um gap de 00:17 onde o índice se recusa a reconstruir.',
    },
    {
      id: 'MEM-0xC44E',
      title: 'NOITE NA REDE',
      year: 2017,
      date: '2017-06-19',
      integrity: 68,
      tags: ['#cidade', '#neon'],
      fragment:
        'Telas refletidas na chuva. Um handle desconhecido piscou no chat — e sumiu antes do dump completar.',
    },
    {
      id: 'MEM-0xD01A',
      title: 'LINK AFETIVO',
      year: 2019,
      date: '2019-02-14',
      integrity: 88,
      tags: ['#vinculo', '#sinal'],
      fragment:
        'Dois pulsos sincronizados. O vault marcou a sessão como âncora — baixa perda, alta saliência.',
    },
    {
      id: 'MEM-0xE77F',
      title: 'FALHA DE BOOT',
      year: 2021,
      date: '2021-09-30',
      integrity: 55,
      tags: ['#kernel', '#recovery'],
      fragment:
        'Stack trace incompleto. Memória volátil evaporou antes do snapshot. Resta um checksum e uma data.',
    },
    {
      id: 'MEM-0xF9A0',
      title: 'ÚLTIMO CHECKPOINT',
      year: 2024,
      date: '2024-01-08',
      integrity: 76,
      tags: ['#presente', '#vault'],
      fragment:
        'O monitor acendeu sozinho. Neural link estável. O índice aponta para cá — e espera o próximo write.',
    },
  ],
  logs: [
    { t: '13:47:01', level: 'info', msg: 'INDEXADOR: varredura setorial concluída' },
    { t: '13:47:12', level: 'ok', msg: 'NEURAL LINK: latência 12ms — nominal' },
    { t: '13:47:18', level: 'warn', msg: 'AVISO: MEM-0xB21C abaixo do limiar crítico' },
    { t: '13:47:24', level: 'info', msg: 'CACHE: prefetch de cluster 0x7A3F' },
    { t: '13:47:31', level: 'ok', msg: 'INTEGRIDADE: média recalculada → 65%' },
    { t: '13:47:39', level: 'warn', msg: 'AVISO: 2 arquivos críticos requerem atenção' },
    { t: '13:47:44', level: 'info', msg: 'TIMELINE: nó 2009 selecionado pelo operador' },
    { t: '13:47:48', level: 'ok', msg: 'VAULT: sessão autenticada — MONITOR-01' },
  ],
}
