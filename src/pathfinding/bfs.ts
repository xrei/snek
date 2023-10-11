import {findPath} from './types'
import {keys} from 'ramda'

export const bfs: findPath = (start, goal, graph) => {
  const frontier = [start]
  const parent: Record<number, number> = {}
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
        parent[n] = current.index
      }
    }
  }
  const path: number[] = []

  if (found) {
    let current = goal.index

    while (current !== start.index) {
      path.unshift(current)
      current = parent[current]
    }
  }

  const processed = keys(parent)

  return {
    path,
    processed,
  }
}
