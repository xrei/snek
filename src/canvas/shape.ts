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
  snakePath: number[]
  graph: GridGraph
}

type DrawPathParams = {
  ctx: CanvasRenderingContext2D
  path: number[]
  graph: GridGraph
  color: string
  offsetIdx: number
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

export function drawFood({ctx, food, graph}: DrawFoodParams) {
  const isDebug = GameModel.$isDebug.getState()

  for (const val of food) {
    drawSquare({ctx, pos: val[0]})

    if (isDebug) {
      drawText({
        ctx,
        pos: val[0],
        graph,
      })
    }
  }
}

export function drawSnake({ctx, snake, snakePath, graph}: DrawSnakeParams) {
  const isDebug = GameModel.$isDebug.getState()

  if (snake.isAi && isDebug) {
    drawPath({
      ctx,
      color: snake.isDead ? ctx.canvas.style.background : snake.color.head,
      graph,
      path: snakePath,
      offsetIdx: getDigitsFromId(snake.id),
    })
  }

  for (const segment of snake.body) {
    const isDead = snake.isDead
    const isHead = snake.head === segment
    const color = isHead ? snake.color.head : snake.color.tail
    const deadColor = isHead ? '#212' : '#333'

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

export function drawPath({ctx, path, graph, color, offsetIdx}: DrawPathParams) {
  if (!path.length) return

  const offsetAmount = 3
  const centered = (n: number) => n + EDGE_GAP + CELL_SIZE / 2
  const calcOffset = (n: number) =>
    n + offsetAmount * Math.sin((offsetIdx * 2 * Math.PI) / 4)

  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 2

  const startCoords = graph.indexToCoords(path[0])
  const startPxCoords = cellPosToPixelPos(startCoords)

  const adjCoords: Coords = [
    calcOffset(centered(startPxCoords[0])),
    calcOffset(centered(startPxCoords[1])),
  ]

  ctx.moveTo(...adjCoords)

  for (let i = 1; i < path.length; i++) {
    const coords = graph.indexToCoords(path[i])
    const pxCoords = cellPosToPixelPos(coords)

    const adjCoords: Coords = [
      calcOffset(centered(pxCoords[0])),
      calcOffset(centered(pxCoords[1])),
    ]

    ctx.lineTo(adjCoords[0], adjCoords[1])
  }
  ctx.stroke()
}

function getDigitsFromId(id: string) {
  const match = /\d+/.exec(id)
  return match ? Number(match[0]) : 0
}
