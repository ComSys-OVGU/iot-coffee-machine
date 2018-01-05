// these are the buffers that are transferred from the machine

export const rxtxBuffers = [
  {
    name: 'DL_TxBuffer_LCD',
    type: 'lcd',
    use: 'tx'
  },
  {
    name: 'DL_RxBuffer_LCD',
    type: 'lcd',
    use: 'rx'
  },
  {
    name: 'DL_TxBuffer_PB',
    type: 'pb',
    use: 'tx'
  },
  {
    name: 'DL_RxBuffer_PB',
    type: 'pb',
    use: 'rx'
  }
]

export const overwriteBuffers = [
  {
    name: 'DLO_AndBuffer_LCD',
    type: 'lcd',
    use: 'and',
    display: '&'
  },
  {
    name: 'DLO_OrBuffer_LCD',
    type: 'lcd',
    use: 'or',
    display: '|'
  },
  {
    name: 'DLO_AndBuffer_PB',
    type: 'pb',
    use: 'and',
    display: '&'
  },
  {
    name: 'DLO_OrBuffer_PB',
    type: 'pb',
    use: 'or',
    display: '|'
  }
]

export const logBuffers = [
  {
    name: 'DLL_Buffer_LCD',
    type: 'lcd',
    use: 'log'
  },
  {
    name: 'DLL_Buffer_PB',
    type: 'pb',
    use: 'log'
  }
]

export const buffers = [
  ...rxtxBuffers,
  ...overwriteBuffers,
  ...logBuffers
]
