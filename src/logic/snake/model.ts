import {createEvent, createStore, sample} from 'effector'
import {Snake} from './Snake'
import {getRandomPosition} from '@app/canvas'

const initialSnakes = () => {
  const snake = new Snake({
    id: 'player-1',
    initialPos: getRandomPosition(),
    isAi: false,
  })

  return [snake]
}

export const $snakes = createStore<Snake[]>(initialSnakes())

export const updateSnakes = createEvent<Snake[]>()
export const reset = createEvent()

sample({
  source: $snakes,
  clock: updateSnakes,
  fn: (_, updated) => updated,
  target: $snakes,
})

sample({
  clock: reset,
  fn: () => initialSnakes(),
  target: $snakes,
})
