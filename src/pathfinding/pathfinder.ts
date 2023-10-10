import {GridGraph, Vertex} from '@app/shared/graph'
import {bfs} from './bfs'
import {findPath, Strategies} from './types'
import {manhattanDistance} from './heuristic'
import {DIRECTIONS, calcNextDirection} from '@app/shared'

type NavigationResult = {
  path: number[]
  processed: number[]
  nextMove: Coords
  nextDirection: DIRECTIONS | null
}

type determinePathParams = {
  start: Vertex
  goal?: Vertex | null
  graph: GridGraph
}
export const StrategiesMap: Record<Strategies, findPath> = {
  [Strategies.bfs]: bfs,
  [Strategies.dfs]: bfs,
  [Strategies.dijkstra]: bfs,
  [Strategies.astar]: bfs,
}

export const determinePath =
  (strategy: findPath) =>
  ({goal, start, graph}: determinePathParams): NavigationResult | null => {
    if (!goal) return null

    const {path, processed} = strategy(start, goal, graph)

    if (!path.length) return null

    const startCoords = graph.indexToCoords(start.index)
    const nextMove = graph.indexToCoords(path[0])
    const nextDirection = calcNextDirection(startCoords, nextMove)

    return {
      path,
      processed,
      nextMove,
      nextDirection,
    }
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

export const findReachableClosestObject = ({
  fromPoint,
  strategy,
  graph,
  objects,
}: {
  fromPoint: Coords
  strategy: Strategies
  graph: GridGraph
  objects: Coords[]
}) => {
  const pathfinder = createPathfinder(strategy)

  const distances = objects.map((x) => ({
    coords: x,
    distance: manhattanDistance(fromPoint, x),
  }))

  distances.sort((a, b) => a.distance - b.distance)

  for (const {coords} of distances) {
    const startVertex = graph.coordsToVertex(fromPoint)!
    const goalVertex = graph.coordsToVertex(coords)!

    const result = pathfinder({
      start: startVertex,
      goal: goalVertex,
      graph,
    })

    if (result && result.path.length > 0) {
      return goalVertex
    }
  }

  return null
}
