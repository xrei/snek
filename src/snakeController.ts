import {Snake} from './logic/snake/Snake'
import {createPathfinder, findClosestObject} from './pathfinding'
import {InputManager, getNextCoordsByDirection, warpCoords} from './shared'
import {GridGraph} from './shared/graph'

type SnakeBotControllerParams = {
  snake: Snake
  graph: GridGraph
  foods: Food[]
}

function isPartOfSnakeBody(coords: Coords, snake: Snake): boolean {
  for (const segment of snake.body) {
    if (segment[0] === coords[0] && segment[1] === coords[1]) {
      return true
    }
  }
  return false
}

function snakeBotController({snake, graph, foods}: SnakeBotControllerParams) {
  const pathfinder = createPathfinder(snake.aiStrategy!)
  const startVertex = graph.coordsToVertex(snake.head)!

  const res = pathfinder({
    goal: graph.coordsToVertex(
      findClosestObject(
        snake.head,
        foods.map((v) => v[0])
      )
    ),
    graph,
    start: startVertex,
  })

  if (res) return res

  let nextMove

  for (const x of startVertex.neighbors) {
    const cell = graph.getVertex(x)!
    const nextCoords = graph.indexToCoords(cell.index)

    if (
      cell &&
      cell.value.type !== graph.CELL_TYPE.snake &&
      !isPartOfSnakeBody(nextCoords, snake)
    ) {
      nextMove = nextCoords
      break
    }
  }

  return {path: [], processed: [], nextMove}
}

type SnakeUserControllerParams = {
  snake: Snake
  inputManager: InputManager
  graph: GridGraph
}

function snakeUserController({
  snake,
  graph,
  inputManager,
}: SnakeUserControllerParams) {
  const inputDirection = inputManager.getDirection()

  if (Number.isInteger(inputDirection)) {
    snake.setDirection(inputDirection)
  }
  const nextCoords = warpCoords(
    getNextCoordsByDirection(snake.head, snake.direction),
    graph
  )

  return nextCoords
}

export function snakeController({
  graph,
  snake,
  foods,
  inputManager,
}: SnakeBotControllerParams & SnakeUserControllerParams) {
  if (snake.isAi) {
    const res = snakeBotController({snake, graph, foods})
    console.log(res)
    return {
      path: res?.path ?? [],
      processed: res?.processed ?? [],
      nextCoords: res?.nextMove,
    }
  } else {
    const nextCoords = snakeUserController({snake, graph, inputManager})
    return {
      path: [],
      processed: [],
      nextCoords,
    }
  }
}
