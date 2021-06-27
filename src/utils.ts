import { IPairOutput } from './interfaces'

function MessagePairFormatter(output: IPairOutput): string {
  const { pair, current, last, conclusion } = output

  let messageText = `${pair.name}\n\n`
  if (last) {
    messageText +=
      `avarange:  (${last.avarange}) => (${current.avarange})\n` +
      `indicators: (${last.indicators}) => (${current.indicators})\n` +
      `summary: (${last.summary}) => (${current.summary})\n`
  } else {
    messageText +=
      `avarange: (${current.avarange})\n` +
      `indicators: (${current.indicators})\n` +
      `summary: (${current.summary})\n`
  }
  messageText += `\nconclusion: ${conclusion.action}\n`

  return messageText
}

export function MessageGenerator(
  outputs: IPairOutput[],
  index: number
): string {
  const output = outputs[index]
  let outputMessage = MessagePairFormatter(output)

  const mainCurrency = output.pair.name.split('/')[1]

  if (['ETH', 'BTC'].includes(mainCurrency)) {
    const secondOutput = outputs.find((el) => {
      return el.pair.name === `${mainCurrency}/USDT`
    })

    outputMessage =
      'Current pair:\n' +
      outputMessage +
      `\n\nMain pair:\n` +
      MessagePairFormatter(secondOutput)
  }

  return outputMessage
}
