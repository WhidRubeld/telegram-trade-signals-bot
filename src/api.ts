import axios from 'axios'
import { PairType } from './constants'
import { IPairResult } from './interfaces'
import { parsePairResponse } from './parser'

export function getPairResponse(pair: PairType): Promise<IPairResult> {
  return new Promise<IPairResult>(async (resolve, reject) => {
    try {
      const response = await axios.get(pair.uri)
      const result = parsePairResponse(response)
      resolve({ pair, result })
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
