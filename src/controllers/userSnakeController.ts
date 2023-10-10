import {Snake} from '@app/logic/snake'
import {InputManager, warpCoords, getNextCoordsByDirection} from '@app/shared'
import {GridGraph} from '@app/shared/graph'

export type SnakeUserControllerParams = {
  snake: Snake
  inputManager: InputManager
  graph: GridGraph
}

export function snakeUserController({
  snake,
  graph,
  inputManager,
}: SnakeUserControllerParams) {
  const inputDirection = inputManager.getDirection()

  const nextCoords = warpCoords(
    getNextCoordsByDirection(snake.head, snake.direction),
    graph
  )

  return {
    nextCoords,
    nextDirection: inputDirection,
  }
}
