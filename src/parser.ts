import { parse, HTMLElement } from 'node-html-parser'
import { AxiosResponse } from 'axios'

import { IPairResponse } from './interfaces'

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

function getFinalResultFromLine(line: HTMLElement): number[] {
  const columns: HTMLElement[] = line.querySelectorAll('td').splice(1)
  const results: number[] = columns.map((column) => {
    const text = column.text

    switch (text) {
      case 'Активно продавать':
        return -2
      case 'Продавать':
        return -1
      case 'Покупать':
        return 1
      case 'Активно покупать':
        return 2
      default:
        return 0
    }
  })

  return results
}
