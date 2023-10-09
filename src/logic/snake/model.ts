import {createEvent, createStore, sample} from 'effector'
import {Snake} from './Snake'
import {getRandomPosition} from '@app/canvas'
import {Strategies} from '@app/pathfinding/types'
import {getDigitsFromId, sortDescBy} from '@app/shared'

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

export type SnakeNavigationDetails = {
  snakeId: string
  path: number[]
  processed: number[]
}
export type SnakeNavDetsMap = {
  [key: string]: SnakeNavigationDetails
}
export const $snakes = createStore<Snake[]>(initialSnakes())
export const $snakesByScore = $snakes.map((state) => sortDescBy('score', state))
const $deadSnakes = $snakes.map((v) => v.filter((snake) => snake.isDead))
export const $snakesPathData = createStore<SnakeNavDetsMap>({})

export const addBotSnake = createEvent()
export const removeSnake = createEvent<string>()
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
    const ids = snakes.map((v) => (v.isAi ? getDigitsFromId(v.id) : 0))
    const len = !ids.length ? 0 : Math.max(...ids)
    return [...snakes, createAiSnake(len + 1)]
  },
  target: $snakes,
})

sample({
  clock: removeSnake,
  source: $snakes,
  fn: (snakes, id) => {
    return snakes.filter((snek) => snek.id !== id)
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
  clock: $deadSnakes,
  source: $snakesPathData,
  fn: (snakesData, snakes) => {
    const data = {...snakesData}
    for (const snake of snakes) {
      delete data[snake.id]
    }
    return data
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
