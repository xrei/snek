import {Snake} from './Snake'
import * as model from './model'

export const SnakeModel = {
  Snake,
  ...model,
}

export type * from './Snake'
export type * from './model'
