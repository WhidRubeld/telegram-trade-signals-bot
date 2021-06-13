import fs from 'fs'
import yaml from 'js-yaml'
import cron from 'node-cron'
import redis from 'redis'
import { promisify } from 'util'

import { getPairResponse, sendTelegramMessage } from './api'
import { Analyst } from './analyst'
import { Pairs, PairType } from './constants'
import { IConclusion, IConfig, IPairResponse } from './interfaces'

const isProduction = process.env.NODE_ENV === 'production'
const config = yaml.load(fs.readFileSync('config.yml', 'utf8')) as IConfig

const client = !isProduction
  ? redis.createClient()
  : redis.createClient(process.env.REDIS_URL)

const getCache = promisify(client.get).bind(client)
const setCache = promisify(client.set).bind(client)

function sendPairResult(
  conclusion: IConclusion,
  pair: PairType,
  current: IPairResponse,
  last?: IPairResponse
) {
  const availableChats = config.chats.filter((chat) => {
    const { pairs, exlucde_pairs } = chat

    if (pairs) return pairs.includes(pair.name)
    if (exlucde_pairs) return !exlucde_pairs.includes(pair.name)
    return true
  })

  let messageText = `${pair.name}\n\n`
  if (last) {
    messageText +=
      `avarange: (${current.avarange}) => (${last.avarange})\n` +
      `indicators: (${current.indicators}) => (${last.indicators})\n` +
      `summary: (${current.summary}) => (${last.summary})\n`
  } else {
    messageText +=
      `avarange: (${current.avarange})\n` +
      `indicators: (${current.indicators})\n` +
      `summary: (${current.summary})\n`
  }
  messageText += `\nconclusion: ${conclusion.action}\n`

  availableChats.forEach((chat) => {
    sendTelegramMessage(config.telegram_token, chat.id, messageText).catch(
      () => {
        console.warn(`Ошибка отправки сообщения в чат ${chat.id}`)
      }
    )
  })
}

async function processPairResult(pair: PairType, current: IPairResponse) {
  try {
    const lastJson = await getCache(`pair-${pair.name}`)

    if (lastJson) {
      const last: IPairResponse = JSON.parse(lastJson)
      const conclusion = Analyst.activityAndDifferentConclusion(current, last)
      // if (conclusion.status) sendPairResult(conclusion, pair, current, last)
    } else {
      const conclusion = Analyst.activityConclusion(current)
      // if (conclusion.status) sendPairResult(conclusion, pair, current)
    }

    await setCache(`pair-${pair.name}`, JSON.stringify(current))
  } catch (e) {
    console.warn(`Ошибка обработки пары ${pair.name}`)
  }
}

function scheduleCallback(): void {
  Pairs.forEach((pair) => {
    getPairResponse(pair)
      .then((res) => {
        processPairResult(pair, res)
      })
      .catch(() => {
        // console.error(e)
        console.warn(`Ошибка отправки запроса данных по паре ${pair.name}`)
      })
  })
}

// scheduleCallback()

cron.schedule('*/5 * * * *', scheduleCallback)
