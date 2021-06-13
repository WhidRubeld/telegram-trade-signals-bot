import { IConclusion, IPairResponse } from './interfaces'
import _ from 'lodash'
import { Conclusions } from './enum'

export class Analyst {
  static activityConclusion(response: IPairResponse): IConclusion {
    for (const [key, value] of Object.entries(response)) {
      if (value.every((el: number) => el > 0)) {
        return { status: true, action: Conclusions.BUY }
      }
      if (value.every((el: number) => el < 0)) {
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

    console.log(!_.isEqual(current, last), current, last)

    if (activityConclusion.status && !_.isEqual(current, last)) {
      return activityConclusion
    }

    return { status: false, action: Conclusions.AWAIT }
  }
}
