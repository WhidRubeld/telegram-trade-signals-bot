import { parse, HTMLElement } from 'node-html-parser'
import { AxiosResponse } from 'axios'

import { IPairResponse } from './interfaces'
import { PairResponseResults } from './enums'

export function parsePairResponse(response: AxiosResponse): IPairResponse {
  const { data } = response

  const DOM: HTMLElement = parse(data)
  const table: HTMLElement = DOM.querySelector('.technicalSummaryTbl')
  const tableBody: HTMLElement = table.querySelector('tbody')
  const lines: HTMLElement[] = tableBody.querySelectorAll('tr')

  const [avarangeLine, indicatorLine, summaryLine] = lines

  return {
    avarange: getFinalResultFromLine(avarangeLine),
    indicators: getFinalResultFromLine(indicatorLine),
    summary: getFinalResultFromLine(summaryLine)
  }
}

function getFinalResultFromLine(line: HTMLElement): PairResponseResults {
  const columns: HTMLElement[] = line.querySelectorAll('td').splice(1)
  const columnText: string[] = columns.map((column) => column.text)

  if (
    columnText.every((text: string) =>
      ['Покупать', 'Активно покупать'].includes(text)
    )
  ) {
    return PairResponseResults.BUY
  }

  if (
    columnText.every((text: string) =>
      ['Продавать', 'Активно продавать'].includes(text)
    )
  ) {
    return PairResponseResults.SELL
  }

  return PairResponseResults.NEUTRAL
}
