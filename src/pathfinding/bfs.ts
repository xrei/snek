import {Vertex} from '@app/shared/graph'
import {findPath} from './types'
import {uniq} from 'ramda'

export const bfs: findPath = (start, goal, graph) => {
  const frontier = [start]
  const parent: Record<number, Vertex> = {}
  let found = false

  while (frontier.length !== 0) {
    const current = frontier.shift()!

    if (current.index === goal.index) {
      found = true
      break
    }

    for (const n of current.neighbors) {
      const vertex = graph.getVertex(n)
      const emptyOrFood =
        vertex &&
        (vertex.value.type === graph.CELL_TYPE.empty ||
          vertex.value.type === graph.CELL_TYPE.food)

      if (!parent[n] && emptyOrFood) {
        frontier.push(vertex)
        parent[n] = current
      }
    }
  }
  const path: number[] = []

  if (found) {
    let current = goal

    while (current.index !== start.index) {
      path.unshift(current.index)
      current = parent[current.index]
    }
  }

  const parentVals = Object.values(parent)
  const processed = parentVals.length
    ? uniq(parentVals.map((v) => v.index))
    : []

  return {
    path,
    processed,
  }
}
