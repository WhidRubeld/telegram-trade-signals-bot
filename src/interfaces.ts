import { Conclusions } from './enum'

export interface IPairResponse {
  avarange: number[]
  indicators: number[]
  summary: number[]
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
