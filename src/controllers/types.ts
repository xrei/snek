import {DIRECTIONS} from '@app/shared'

export type SnakeControllerReturnParams = {
  path: number[]
  processed: number[]
  nextMove: Coords | null
  nextDirection: DIRECTIONS | null
}
