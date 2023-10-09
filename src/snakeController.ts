import {Snake} from './logic/snake/Snake'
import {createPathfinder, findReachableClosestObject} from './pathfinding'
import {InputManager, getNextCoordsByDirection, warpCoords} from './shared'
import {GridGraph, Vertex} from './shared/graph'

type SnakeBotControllerParams = {
  snake: Snake
  graph: GridGraph
  foods: Food[]
}

function isPartOfSnakeBody(coords: Coords, body: Coords[]): boolean {
  for (const segment of body) {
    if (segment[0] === coords[0] && segment[1] === coords[1]) {
      return true
    }
  }
  return false
}

function getNextNearestMove(start: Vertex, body: Coords[], graph: GridGraph) {
  let nextMove

  for (const x of start.neighbors) {
    const cell = graph.getVertex(x)!
    const nextCoords = graph.indexToCoords(cell.index)

    if (
      cell &&
      cell.value.type !== graph.CELL_TYPE.snake &&
      !isPartOfSnakeBody(nextCoords, body)
    ) {
      nextMove = nextCoords
      break
    }
  }

  return nextMove
}

function snakeBotController({snake, graph, foods}: SnakeBotControllerParams) {
  const pathfinder = createPathfinder(snake.aiStrategy!)
  const startVertex = graph.coordsToVertex(snake.head)!

  const reachableFood = findReachableClosestObject({
    fromPoint: snake.head,
    objects: foods.map((v) => v[0]),
    graph,
    strategy: snake.aiStrategy!,
  })

  if (!reachableFood) {
    return {
      path: [],
      processed: [],
      nextMove: getNextNearestMove(startVertex, snake.body, graph),
    }
  }

  const res = pathfinder({
    goal: reachableFood,
    graph,
    start: startVertex,
  })

  if (res) return res

  const nextMove = getNextNearestMove(startVertex, snake.body, graph)

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
