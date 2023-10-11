import {Strategies} from '@app/pathfinding/types'
import {DIRECTIONS, adjustBrightness, hexToRGBA} from '@app/shared'

const snakeColors = [
  '#F6a040',
  '#40C4FF',
  '#7ffB40',
  '#aEa7f0',
  '#69F0AE',
  '#ff62aa',
  '#aa5f2f',
  '#f4a5FF',
  '#03fafE',
  '#fff03a',
  '#ff00aa',
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
    processedColor: string
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

  setDead() {
    this.isDead = true
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

function pickColor() {
  const tail = snakeColors[Math.floor(Math.random() * snakeColors.length)]
  const head = adjustBrightness(tail, 0.7)
  const processedColor = hexToRGBA(tail, 0.15)
  return {head, tail, processedColor}
}
