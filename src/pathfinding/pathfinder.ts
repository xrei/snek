import {GridGraph, Vertex} from '@app/shared/graph'
import {bfs} from './bfs'
import {findPath, Strategies} from './types'
import {manhattanDistance} from './heuristic'

type NavigationResult = {
  path: Vertex[]
  processed: Vertex[]
  nextMove?: Coords
}

type determinePathParams = {
  start: Coords
  goal: Vertex | null
  graph: GridGraph
}

export const determinePath =
  (strategy: findPath) =>
  ({goal, start, graph}: determinePathParams): NavigationResult | false => {
    if (!goal) return false

    const startPos = graph.coordsToVertex(start)
    if (!startPos) return false

    const {path, processed} = strategy(startPos, goal, graph)

    if (!path.length) {
      for (const x of startPos.neighbors) {
        const cell = graph.getVertex(x)
        if (cell && cell.value.type !== graph.CELL_TYPE.snake) {
          return {
            path,
            processed,
            nextMove: graph.indexToCoords(cell.index),
          }
        }
      }
      return {path, processed}
    }
    const nextMove = graph.indexToCoords(path[0].index)

    return {
      path,
      processed,
      nextMove: nextMove,
    }
  }

export const StrategiesMap: Record<Strategies, findPath> = {
  [Strategies.bfs]: bfs,
  [Strategies.dfs]: bfs,
  [Strategies.dijkstra]: bfs,
  [Strategies.astar]: bfs,
}
export const createPathfinder = (strategyName: Strategies) => {
  const strategy = StrategiesMap[strategyName]

  return determinePath(strategy)
}

export const findClosesObject = (fromPoint: Coords, xs: Coords[]) => {
  let closest = xs[0]
  let distance = manhattanDistance(fromPoint, closest)

  for (let i = 1; i < xs.length; i++) {
    const currentDistance = manhattanDistance(fromPoint, xs[i])
    if (currentDistance < distance) {
      distance = currentDistance
      closest = xs[i]
    }
  }

  return closest
}
