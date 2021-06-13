export type PairType = [string, string]

export const Pairs: PairType[] = [
  ['ETH', 'BTC'],
  ['LTC', 'BTC'],
  ['BNB', 'ETH'],
  ['XRP', 'BTC']
]

export type ChatType = {
  id: number
  pairs: PairType[]
}

export const Chats: ChatType[] = [
  {
    id: 384938855,
    pairs: [Pairs[0], Pairs[1], Pairs[2], Pairs[3]]
  },
  {
    id: 163913615,
    pairs: [Pairs[0], Pairs[1], Pairs[2], Pairs[3]]
  },
  {
    id: 713111282,
    pairs: [Pairs[0], Pairs[1], Pairs[2], Pairs[3]]
  }
]
