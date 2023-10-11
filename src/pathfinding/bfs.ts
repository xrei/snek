import {findPath} from './types'

export const bfs: findPath = (start, goal, graph, returnProcessed) => {
  const frontier = [start]
  const parent: Record<number, number> = {}

  while (frontier.length !== 0) {
    const current = frontier.shift()!

    if (current.index === goal.index) {
      const path: number[] = []
      let pathIdx = goal.index

      while (pathIdx !== start.index) {
        path.unshift(pathIdx)
        pathIdx = parent[pathIdx]
      }

      const processed = returnProcessed
        ? (Object.keys(parent) as unknown as number[])
        : []
      return {
        path,
        processed,
      }
    }

    for (const n of current.neighbors) {
      const vertex = graph.getVertex(n)

      const emptyOrFood =
        vertex &&
        (vertex.value.type === graph.CELL_TYPE.empty ||
          vertex.value.type === graph.CELL_TYPE.food)

      if (parent[n] === undefined && emptyOrFood) {
        frontier.push(vertex)
        parent[n] = current.index
      }
    }
  }

  return {
    path: [],
    processed: [],
  }
}
