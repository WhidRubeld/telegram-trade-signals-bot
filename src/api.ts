import axios from 'axios'
import { PairType } from './constants'
import { IPairResponse } from './interfaces'
import { parsePairResponse } from './parser'

export function getPairResponse({ uri }: PairType): Promise<IPairResponse> {
  return new Promise<IPairResponse>(async (resolve, reject) => {
    try {
      const response = await axios.get(uri)
      const result = parsePairResponse(response)
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function sendTelegramMessage(
  token: string,
  chat_id: number,
  text: string
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id,
        text
      })
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
