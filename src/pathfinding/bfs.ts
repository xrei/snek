import {Vertex} from '@app/shared/graph'
import {findPath} from './types'

export const bfs: findPath = (start, goal, graph) => {
  const frontier = [start]
  const parent: Record<number, Vertex> = {}
  let found = false

  if (!goal || !start) return {path: [], processed: []}

  while (frontier.length !== 0) {
    const current = frontier.shift()!

    if (current.index === goal.index) {
      found = true
      break
    }

    for (const n of current.neighbors) {
      const vertex = graph.getVertex(n)
      if (vertex && !parent[n] && vertex.value.type !== graph.CELL_TYPE.snake) {
        frontier.push(vertex)
        parent[n] = current
      }
    }
  }
  const path: Vertex[] = []

  if (found) {
    let current = goal

    while (current.index !== start.index) {
      path.unshift(current)
      current = parent[current.index]
    }
  }

  const processed = Object.values(parent)

  return {
    path,
    processed,
  }
}
