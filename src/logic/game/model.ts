import {GAME_STATE} from '@app/shared'
import {createEvent, createStore, restore, sample} from 'effector'

export const fpsChanged = createEvent<number>()
export const play = createEvent()
export const pause = createEvent()
export const restart = createEvent()

export const $gameFps = restore(fpsChanged, 10)
export const $gameState = createStore(GAME_STATE.paused)
export const $gameIsPaused = $gameState.map((v) => v === GAME_STATE.paused)
export const $gameIsPlaying = $gameState.map((v) => v === GAME_STATE.play)

sample({
  clock: play,
  fn: () => GAME_STATE.play,
  target: $gameState,
})

sample({
  clock: pause,
  fn: () => GAME_STATE.paused,
  target: $gameState,
})

sample({
  clock: restart,
  target: $gameState.reinit!,
})
