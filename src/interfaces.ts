import { Conclusions } from './enum'
import { PairType } from './constants'

export interface IPairResponse {
  avarange: number[]
  indicators: number[]
  summary: number[]
}

export interface IPairResult {
  pair: PairType
  result: IPairResponse
}

export interface IChat {
  id: number
  pairs?: string[]
  exlucde_pairs?: string[]
}

export interface IConfig {
  telegram_token: string
  chats: IChat[]
}

export interface IConclusion {
  status: boolean
  action: Conclusions
}

export interface IPairOutput {
  pair: PairType
  current: IPairResponse
  last: IPairResponse | undefined
  conclusion: IConclusion
}
