import {Vertex, GridGraph} from '@app/shared/graph'

export type findPath = (
  start: Vertex,
  goal: Vertex,
  graph: GridGraph,
  returnProcessed?: boolean
) => {path: number[]; processed: number[]}

export enum Strategies {
  'bfs' = 'bfs',
  'dfs' = 'dfs',
  'dijkstra' = 'dijkstra',
  'astar' = 'astar',
}
