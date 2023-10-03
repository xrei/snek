import {createEvent, createStore, sample} from 'effector'
import {Snake} from './Snake'
import {getRandomPosition} from '@app/canvas'
import {Strategies} from '@app/pathfinding/types'

const initialSnakes = () => {
  const snake = new Snake({
    id: 'bot-1',
    initialPos: getRandomPosition(),
    isAi: true,
    aiStrategy: Strategies.bfs,
  })

  return [snake]
}

const createAiSnake = (id: number) =>
  new Snake({
    id: 'bot-' + id,
    initialPos: getRandomPosition(),
    isAi: true,
    aiStrategy: Strategies.bfs,
  })

export const $snakes = createStore<Snake[]>(initialSnakes())

export const addAiSnake = createEvent()
export const updateSnakes = createEvent<Snake[]>()
export const reset = createEvent()

sample({
  clock: updateSnakes,
  source: $snakes,
  fn: (_, updated) => updated,
  target: $snakes,
})

sample({
  clock: addAiSnake,
  source: $snakes,
  fn: (snakes) => {
    const len = snakes.filter((v) => v.isAi).length
    return [...snakes, createAiSnake(len + 1)]
  },
  target: $snakes,
})

sample({
  clock: reset,
  fn: () => initialSnakes(),
  target: $snakes,
})
