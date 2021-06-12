import * as dotenv from 'dotenv'
import cron from 'node-cron'

import { getPairResponse, sendTelegramMessage } from './api'
import { Pairs, Chats, PairType } from './constants'
import { PairResponseNames, PairResponseResults } from './enums'
import { IPairResponse } from './interfaces'

dotenv.config()

function messageDispatchProcessing(pair: PairType, res: IPairResponse) {
  const availableChats = Chats.filter((chat) => {
    return chat.pairs.includes(pair)
  })

  const [first, second] = pair
  const { avarange, indicators, summary } = res

  const messageText =
    `Пара: ${first} / ${second}\n\n` +
    `Скол. средняя: ${PairResponseNames[avarange]}\n` +
    `Индикаторы: ${PairResponseNames[indicators]}\n` +
    `Заключение: ${PairResponseNames[summary]}\n`

  availableChats.forEach((chat) => {
    sendTelegramMessage(chat.id, messageText).catch((e) => {
      console.warn(
        `${pair[0]}/${pair[1]}: Ошибка отправки сообщения в чат ${chat.id}`,
        e
      )
    })
  })
}

function scheduleCallback() {
  Pairs.forEach((pair) => {
    getPairResponse(pair)
      .then((res) => {
        const values = Object.values(res)
        if (
          values.includes(PairResponseResults.BUY) ||
          values.includes(PairResponseResults.SELL)
        ) {
          messageDispatchProcessing(pair, res)
        }
      })
      .catch((e) => {
        console.warn(
          `${pair[0]}/${pair[1]}: Ошибка отправки запроса данных по паре`,
          e
        )
      })
  })
}

cron.schedule('*/5 * * * *', scheduleCallback)
