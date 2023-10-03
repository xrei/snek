import {Strategies} from '@app/pathfinding/types'
import {DIRECTIONS} from '@app/shared'

const snakeColors = [
  '#F6a0f1',
  '#40C4FF',
  '#FFAB40',
  '#aEa7f0',
  '#69F0AE',
  '#ff62aa',
  '#FFD740',
  '#f0E5FF',
  '#03fafE',
  '#B2FF59',
]

type SnakeConstructor = {
  id: string
  initialPos: Coords
  isAi: boolean
  aiStrategy?: Strategies
}

export class Snake {
  id: string
  body: Coords[]
  score: number
  direction: DIRECTIONS
  isDead: boolean
  isAi: boolean
  color: {
    head: string
    tail: string
  }
  aiStrategy?: Strategies

  constructor({id, initialPos, isAi, aiStrategy}: SnakeConstructor) {
    this.id = id
    this.body = [initialPos, [initialPos[0] + 1, initialPos[1]]]
    this.isAi = isAi
    this.score = 0
    this.isDead = false
    this.direction = DIRECTIONS.LEFT
    this.color = pickColor()
    if (this.isAi) {
      this.aiStrategy = aiStrategy
    }
  }

  get head() {
    return this.body[0]
  }
  get tail() {
    return this.body[this.body.length - 1]
  }

  setDirection(dir: DIRECTIONS) {
    if (Math.abs(dir - this.direction) !== 2) {
      this.direction = dir
    }
  }

  updateScore() {
    this.score = this.score + 1
  }

  setDead(p: boolean) {
    this.isDead = p
  }

  move(newHeadPosition: Coords) {
    this.body = [newHeadPosition, ...this.body.slice(0, -1)]
  }

  grow(newPos: Coords) {
    this.body = [newPos, ...this.body]
    this.updateScore()
  }

  clone(): Snake {
    const cloned = new Snake({
      id: this.id,
      initialPos: this.head,
      isAi: this.isAi,
      aiStrategy: this.aiStrategy,
    })
    cloned.body = [...this.body]
    cloned.score = this.score
    cloned.direction = this.direction
    cloned.isDead = this.isDead
    cloned.color = {...this.color}

    return cloned
  }
}

function pickColor(): {head: string; tail: string} {
  const tail = snakeColors[Math.floor(Math.random() * snakeColors.length)]
  const head = adjustBrightness(tail, 0.9) // Increase brightness by 20% for the head
  return {head, tail}
}

function adjustBrightness(hex: string, factor: number): string {
  let [r, g, b] = [1, 3, 5].map((offset) =>
    parseInt(hex.slice(offset, offset + 2), 16)
  )
  ;[r, g, b] = [r, g, b].map((channel) =>
    Math.min(255, Math.max(0, Math.round(channel * factor)))
  )

  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
