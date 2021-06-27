import fs from 'fs'
import yaml from 'js-yaml'
import cron from 'node-cron'
import redis from 'redis'
import { promisify } from 'util'

import { getPairResponse, sendTelegramMessage } from './api'
import { Analyst } from './analyst'
import { Pairs } from './constants'
import {
  IConclusion,
  IConfig,
  IPairOutput,
  IPairResponse,
  IPairResult
} from './interfaces'
import { MessageGenerator } from './utils'

const isProduction = process.env.NODE_ENV === 'production'
const config = yaml.load(fs.readFileSync('config.yml', 'utf8')) as IConfig

const client = !isProduction
  ? redis.createClient()
  : redis.createClient(process.env.REDIS_URL)

const getCache = promisify(client.get).bind(client)
const setCache = promisify(client.set).bind(client)

function sendPairsResult(outputs: IPairOutput[]) {
  outputs.forEach((output, index) => {
    const { pair, conclusion } = output
    if (!conclusion.status) return

    const availableChats = config.chats.filter((chat) => {
      const { pairs, exlucde_pairs } = chat
      if (pairs) return pairs.includes(pair.name)
      if (exlucde_pairs) return !exlucde_pairs.includes(pair.name)
      return true
    })
    const message = MessageGenerator(outputs, index)

    availableChats.forEach((chat) => {
      sendTelegramMessage(config.telegram_token, chat.id, message).catch(() => {
        console.warn(`Ошибка отправки сообщения в чат ${chat.id}`)
      })
    })
  })
}

async function processPairResult(response: IPairResult[]) {
  let output: IPairOutput[] = []

  try {
    for (const item of response) {
      const lastJson = await getCache(`pair-${item.pair.name}`)
      let conclusion: IConclusion, last: IPairResponse | undefined

      if (lastJson) {
        last = JSON.parse(lastJson)
        conclusion = Analyst.activityAndDifferentConclusion(item.result, last)
      } else {
        conclusion = Analyst.activityConclusion(item.result)
      }
      output.push({ pair: item.pair, current: item.result, last, conclusion })
      await setCache(`pair-${item.pair.name}`, JSON.stringify(item.result))
    }
  } catch (e) {
    console.warn(e)
  }

  sendPairsResult(output)
}

function scheduleCallback(): void {
  Promise.all(Pairs.map(getPairResponse))
    .then(processPairResult)
    .catch((e) => {
      console.warn(e)
    })
}

// scheduleCallback()

cron.schedule('*/5 * * * *', scheduleCallback)
