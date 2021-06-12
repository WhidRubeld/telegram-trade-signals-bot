import axios, { AxiosResponse } from 'axios'
import { PairType } from './constants'
import { IPairResponse } from './interfaces'
import { parsePairResponse } from './parser'

export function getPairResponse([
  first,
  second
]: PairType): Promise<IPairResponse> {
  return new Promise<IPairResponse>(async (resolve, reject) => {
    try {
      const response = await axios.get(
        `https://ru.investing.com/indices/investing.com-${first.toLowerCase()}-${second.toLowerCase()}`
      )
      const result = parsePairResponse(response)
      resolve(result)
    } catch (e) {
      reject(e)
    }
  })
}

export function sendTelegramMessage(
  chat_id: number,
  text: string
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
        {
          chat_id,
          text
        }
      )
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
