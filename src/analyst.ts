import { IConclusion, IPairResponse } from './interfaces'
import _ from 'lodash'
import { Conclusions } from './enum'

enum ActivityDirection {
  UP,
  DOWN
}
export class Analyst {
  static activityReduce(value: number[], direction: ActivityDirection) {
    return value.reduce((acc: number, v: number) => {
      return direction === ActivityDirection.UP
        ? v > 0
          ? acc + 1
          : acc
        : v < 0
        ? acc + 1
        : acc
    })
  }

  static activityConclusion(response: IPairResponse): IConclusion {
    for (const [key, value] of Object.entries(response)) {
      if (this.activityReduce(value, ActivityDirection.UP) >= 4) {
        return { status: true, action: Conclusions.BUY }
      }
      if (this.activityReduce(value, ActivityDirection.DOWN) >= 4) {
        return { status: true, action: Conclusions.SELL }
      }
    }

    return { status: false, action: Conclusions.AWAIT }
  }

  static activityAndDifferentConclusion(
    current: IPairResponse,
    last: IPairResponse
  ): IConclusion {
    const activityConclusion = this.activityConclusion(current)

    if (activityConclusion.status && !_.isEqual(current, last)) {
      return activityConclusion
    }

    return { status: false, action: Conclusions.AWAIT }
  }
}
