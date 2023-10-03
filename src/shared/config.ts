export const EDGE_GAP = 4
export const CELL_SIZE = 16
export const PAGE_HEIGHT = () => window.innerHeight
export const PAGE_WIDTH = () => window.innerWidth
export const PAGE_WIDTH_ADJ = () => PAGE_WIDTH() - 2 * EDGE_GAP
export const PAGE_HEIGHT_ADJ = () => PAGE_HEIGHT() - 2 * EDGE_GAP

export const getSize = () => ({w: PAGE_WIDTH(), h: PAGE_HEIGHT()})
export const getAdjustedSize = () => ({
  w: PAGE_WIDTH_ADJ(),
  h: PAGE_HEIGHT_ADJ(),
})

export enum CELL_TYPE {
  empty,
  food,
  snake,
}

export enum GAME_STATE {
  play = 'playing',
  paused = 'paused',
  end = 'end',
}

export enum DIRECTIONS {
  LEFT = 0,
  UP = 1,
  RIGHT = 2,
  DOWN = 3,
}

export const KEY_TO_DIRECTION: Record<string, DIRECTIONS> = {
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowUp: DIRECTIONS.UP,
  ArrowRight: DIRECTIONS.RIGHT,
  ArrowDown: DIRECTIONS.DOWN,
}
