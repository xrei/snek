import {CELL_TYPE} from '../config'

export type VertexVal = {
  type: CELL_TYPE
  id?: string
}

export type Vertex = {
  neighbors: number[]
  value: VertexVal
  index: number
}

export class GridGraph {
  w: number
  h: number
  graph: Vertex[]
  empty: Vertex[]

  constructor({w, h, graph}: {w: number; h: number; graph?: Vertex[]}) {
    this.w = w
    this.h = h
    this.empty = this.initGrid()
    this.graph = graph || [...this.empty]
  }

  private initGrid() {
    const size = this.w * this.h
    const grid = new Array<Vertex>(size)

    for (let index = 0; index < size; index++) {
      grid[index] = {
        neighbors: this.computeNeighbors(index),
        value: {type: CELL_TYPE.empty},
        index,
      }
    }

    return grid
  }

  private computeNeighbors(index: number) {
    const neighbors = []
    const [x, y] = this.indexToCoords(index)

    if (y > 0) neighbors.push(this.coordsToIndex([x, y - 1])) // Top
    if (x > 0) neighbors.push(this.coordsToIndex([x - 1, y])) // Left
    if (x < this.w - 1) neighbors.push(this.coordsToIndex([x + 1, y])) // Right
    if (y < this.h - 1) neighbors.push(this.coordsToIndex([x, y + 1])) // Bottom

    return neighbors
  }

  indexToCoords(index: number): Coords {
    return [index % this.w, Math.floor(index / this.w)]
  }

  coordsToIndex([x, y]: Coords) {
    return y * this.w + x
  }

  getVertexNeighbors(vertex: Vertex) {
    return vertex.neighbors.map((index) => this.graph[index])
  }

  getVertex(index?: number) {
    return index ? this.graph[index] : undefined
  }

  coordsToVertex(vx: Coords) {
    return this.getVertex(this.coordsToIndex(vx))
  }

  setValueByIndex(index: number, value: VertexVal) {
    if (this.graph[index]) {
      this.graph[index] = {...this.graph[index], value}
    }
  }

  clear() {
    this.graph = [...this.empty]
  }

  clone() {
    const clonedGraph = new GridGraph({
      w: this.w,
      h: this.h,
      graph: this.graph.slice(),
    })
    return clonedGraph
  }

  get CELL_TYPE() {
    return CELL_TYPE
  }
}

export function checkCellAhead(nextPos: Coords, graph: GridGraph) {
  const index = graph.coordsToIndex(nextPos)
  const vertex = graph.getVertex(index)

  return vertex
}
