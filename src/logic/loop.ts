import {
  Store,
  attach,
  createEffect,
  createEvent,
  createStore,
  merge,
  sample,
} from 'effector'
import {GameModel} from './game'

const _loopFx = createEffect((fps: number) => wait(1000 / fps))

type CreateLoopPayload<T> = {
  GameModel: typeof GameModel
  $state: Store<T>
  updateFn: (x: {state: T}) => void
  renderFn: (x: {state: T}) => void
}

export const createLoopFactory = <T>({
  GameModel,
  $state,
  updateFn,
  renderFn,
}: CreateLoopPayload<T>) => {
  const $tick = createStore(0)
  const start = createEvent()

  const loopFx = attach({
    source: GameModel.$gameFps,
    mapParams: (_, fps) => fps,
    effect: _loopFx,
  })

  const willTick = merge([loopFx.done, GameModel.play])

  $tick
    .on(loopFx.done, (_, {params}) => params as number)
    .reset(GameModel.restart)

  sample({
    clock: [start, willTick],
    source: $tick,
    filter: GameModel.$gameIsPlaying,
    fn: (tick) => tick + 1,
    target: loopFx,
  })

  const doUpdate = sample({clock: loopFx, source: $state})
  const renderPause = sample({clock: start, filter: GameModel.$gameIsPaused})
  const doRender = sample({clock: [loopFx.done, renderPause], source: $state})

  doUpdate.watch((state) => {
    updateFn({state})
  })

  doRender.watch((state) => renderFn({state}))

  GameModel.restart.watch(() => {
    renderFn({state: $state.getState()})
  })

  return {
    start,
    $tick,
  }
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
