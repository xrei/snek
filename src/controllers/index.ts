import {
  SnakeBotControllerParams,
  snakeBotController,
} from './botSnakeController'
import {
  SnakeUserControllerParams,
  snakeUserController,
} from './userSnakeController'

export function snakeController({
  graph,
  snake,
  foods,
  inputManager,
}: SnakeBotControllerParams & SnakeUserControllerParams) {
  if (snake.isAi) {
    const res = snakeBotController({snake, graph, foods})

    return {
      path: res?.path ?? [],
      processed: res?.processed ?? [],
      nextCoords: res?.nextMove,
      nextDirection: res.nextDirection,
    }
  } else {
    const {nextCoords, nextDirection} = snakeUserController({
      snake,
      graph,
      inputManager,
    })
    return {
      path: [],
      processed: [],
      nextCoords,
      nextDirection,
    }
  }
}
