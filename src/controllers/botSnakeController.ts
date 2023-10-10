import {Snake} from '@app/logic/snake/Snake'
import {createPathfinder, findReachableClosestObject} from '@app/pathfinding'
import {
  DIRECTIONS,
  DIRECTION_PRIORITY,
  calcNextDirection,
  getNextCoordsByDirection,
  warpCoords,
} from '@app/shared'
import {GridGraph, Vertex} from '@app/shared/graph'
import {SnakeControllerReturnParams} from './types'

export type SnakeBotControllerParams = {
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

function getNextNearestMove(
  start: Vertex,
  body: Coords[],
  graph: GridGraph,
  currDirection: DIRECTIONS
) {
  const directionsPriority = DIRECTION_PRIORITY[currDirection]

  for (const direction of directionsPriority) {
    const nextCoords = warpCoords(
      getNextCoordsByDirection(graph.indexToCoords(start.index), direction),
      graph
    )

    const cellIndex = graph.coordsToIndex(nextCoords)
    const cell = graph.getVertex(cellIndex)

    if (
      cell &&
      cell.value.type !== graph.CELL_TYPE.snake &&
      !isPartOfSnakeBody(nextCoords, body)
    ) {
      return nextCoords
    }
  }

  return null
}

export function snakeBotController({
  snake,
  graph,
  foods,
}: SnakeBotControllerParams): SnakeControllerReturnParams {
  const pathfinder = createPathfinder(snake.aiStrategy!)
  const startVertex = graph.coordsToVertex(snake.head)!

  const reachableFood = findReachableClosestObject({
    fromPoint: snake.head,
    objects: foods.map((v) => v[0]),
    strategy: snake.aiStrategy!,
    graph,
  })

  if (reachableFood) {
    const res = pathfinder({
      goal: reachableFood,
      graph,
      start: startVertex,
    })

    if (res && res.path.length) {
      return res
    }
  }

  const nextMove = getNextNearestMove(
    startVertex,
    snake.body,
    graph,
    snake.direction
  )
  if (nextMove) {
    const nextDirection = calcNextDirection(snake.head, nextMove)
    return {
      path: [],
      processed: [],
      nextMove,
      nextDirection,
    }
  }

  // dead
  return {path: [], processed: [], nextMove: null, nextDirection: null}
}
