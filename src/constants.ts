export type PairType = [string, string]

export const Pairs: PairType[] = [
  ['ETH', 'BTC'],
  ['LTC', 'BTC'],
  ['BNB', 'ETH']
]

export type ChatType = {
  id: number
  pairs: PairType[]
}

export const Chats: ChatType[] = [
  {
    id: 384938855,
    pairs: [Pairs[0], Pairs[1], Pairs[2]]
  }
]
