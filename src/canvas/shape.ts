import {CELL_SIZE, EDGE_GAP} from '@app/shared'
import {cellPosToPixelPos} from './utils'
import {Snake} from '@app/logic/snake/Snake'
import {GridGraph} from '@app/shared/graph'
import {GameModel} from '@app/logic/game'

type GenericDrawParams = {
  ctx: CanvasRenderingContext2D
  pos: Coords
  color?: string
  graph?: GridGraph
}

type DrawFoodParams = Omit<GenericDrawParams, 'pos'> & {
  food: Food[]
}
type DrawSnakeParams = Omit<GenericDrawParams, 'pos'> & {
  snake: Snake
}

export function drawSquare({ctx, pos, color = 'green'}: GenericDrawParams) {
  const [x, y] = cellPosToPixelPos(pos)
  const size = CELL_SIZE

  ctx.fillStyle = color
  ctx.fillRect(x + EDGE_GAP, y + EDGE_GAP, size, size)
}

export function drawText({
  ctx,
  pos,
  color = 'black',
  graph,
}: GenericDrawParams) {
  const [x, y] = cellPosToPixelPos(pos)
  const idx = graph?.coordsToIndex(pos).toString() ?? ''

  ctx.font = `${Math.floor(CELL_SIZE * 0.45)}px Arial`
  ctx.fillStyle = color
  ctx.textAlign = 'center'

  ctx.fillText(
    idx,
    1 + EDGE_GAP + x + CELL_SIZE / 2,
    2 + EDGE_GAP + y + CELL_SIZE / 2
  )
}

export function drawFood({ctx, food}: DrawFoodParams) {
  for (const val of food) {
    drawSquare({ctx, pos: val[0]})
  }
}

export function drawSnake({ctx, snake, graph}: DrawSnakeParams) {
  const isDebug = GameModel.$isDebug.getState()

  for (const segment of snake.body) {
    const isDead = snake.isDead
    const isHead = snake.head === segment
    const color = isHead ? snake.color.head : snake.color.tail
    const deadColor = '#212'

    drawSquare({
      ctx,
      pos: segment,
      color: isDead ? deadColor : color,
    })

    if (isDebug) {
      drawText({
        ctx,
        pos: segment,
        graph,
      })
    }
  }
}
