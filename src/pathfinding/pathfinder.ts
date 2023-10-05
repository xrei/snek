import {GridGraph, Vertex} from '@app/shared/graph'
import {bfs} from './bfs'
import {findPath, Strategies} from './types'
import {manhattanDistance} from './heuristic'

type NavigationResult = {
  path: number[]
  processed: Vertex[]
  nextMove?: Coords
}

type determinePathParams = {
  start: Vertex
  goal: Vertex | undefined
  graph: GridGraph
}

export const determinePath =
  (strategy: findPath) =>
  ({goal, start, graph}: determinePathParams): NavigationResult | null => {
    if (!goal) return null

    const startPos = start

    const {path, processed} = strategy(startPos, goal, graph)

    if (!path.length) return null

    const nextMove = graph.indexToCoords(path[0])
    return {
      path,
      processed,
      nextMove,
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

export const findClosestObject = (fromPoint: Coords, xs: Coords[]) => {
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
