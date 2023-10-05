import {createEvent, createStore, sample} from 'effector'
import {Snake} from './Snake'
import {getRandomPosition} from '@app/canvas'
import {Strategies} from '@app/pathfinding/types'
import {Vertex} from '@app/shared/graph'
import {sortDescBy} from '@app/shared'

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

type SnakeNavigationDetails = {
  snakeId: string
  path: number[]
  processed: Vertex[]
}
export const $snakes = createStore<Snake[]>(initialSnakes())
export const $snakesByScore = $snakes.map((state) => sortDescBy('score', state))
export const $snakesPathData = createStore<{
  [key: string]: SnakeNavigationDetails
}>({})

export const addBotSnake = createEvent()
export const updateSnakes = createEvent<Snake[]>()
export const addSnakeNavDetails = createEvent<SnakeNavigationDetails>()
export const reset = createEvent()

sample({
  clock: updateSnakes,
  source: $snakes,
  fn: (_, updated) => updated,
  target: $snakes,
})

sample({
  clock: addBotSnake,
  source: $snakes,
  fn: (snakes) => {
    const len = snakes.filter((v) => v.isAi).length
    return [...snakes, createAiSnake(len + 1)]
  },
  target: $snakes,
})

sample({
  clock: addSnakeNavDetails,
  source: $snakesPathData,
  fn: (map, data) => {
    const id = data.snakeId
    const copy = {...map}

    copy[id] = data
    return copy
  },
  target: $snakesPathData,
})

sample({
  clock: reset,
  fn: () => initialSnakes(),
  target: [$snakes],
})

sample({
  clock: reset,
  target: $snakesPathData.reinit!,
})
