import {Vertex, GridGraph} from '@app/shared/graph'

export type findPath = (
  start: Vertex,
  goal: Vertex,
  graph: GridGraph
) => {path: number[]; processed: number[]}

export enum Strategies {
  'bfs' = 'bfs',
  'dfs' = 'dfs',
  'dijkstra' = 'dijkstra',
  'astar' = 'astar',
}
