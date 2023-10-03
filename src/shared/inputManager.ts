import {DIRECTIONS, KEY_TO_DIRECTION} from './config'

export class InputManager {
  private currentDirection: DIRECTIONS = 0

  constructor() {
    document.addEventListener('keydown', this.handleEvent.bind(this))
  }

  handleEvent(event: KeyboardEvent) {
    const direction = KEY_TO_DIRECTION[event.code]
    if (direction !== undefined) {
      this.currentDirection = direction
    }
  }

  getDirection(): DIRECTIONS {
    return this.currentDirection
  }
}
