import {useUnit} from 'effector-react'
import styles from './app.module.css'
import {Logic} from '@app/logic'
import clsx from 'clsx'
import {SnakeModel} from '@app/logic/snake'

const {GameModel} = Logic

export const App = () => {
  return (
    <div className={styles.app}>
      <div className="flex flex-col gap-3 p-4 bg-slate-100 bg-opacity-50 rounded max-h-[85vh]">
        <Settings />
        <GameControls />
        <Score />
      </div>
    </div>
  )
}

const Score = () => {
  const [snakes] = useUnit([Logic.SnakeModel.$snakesByScore])

  return (
    <div className=" overflow-y-scroll mb-2 pr-2">
      <div className="flex flex-col gap-1">
        {snakes.map((s) => (
          <div key={s.id} className="flex gap-4 items-center justify-center">
            <div className="flex-1 gap-4 flex font-semibold">
              <span style={{color: s.isDead ? 'black' : s.color.head}}>
                {s.id}
              </span>
              <span>{s.score}</span>
            </div>
            <div>
              <button
                className="px-1"
                onClick={() => Logic.SnakeModel.removeSnake(s.id)}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Settings = () => {
  const [isDebug, isDebugChanged, fps, fpsChanged] = useUnit([
    GameModel.$isDebug,
    GameModel.isDebugChanged,
    GameModel.$gameFps,
    GameModel.fpsChanged,
  ])
  const minFps = 1
  const maxFps = 240

  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-semibold">Settings</h3>
      <div className="flex gap-2 text-sm">
        <input
          id="debugInput"
          type="checkbox"
          checked={isDebug}
          onChange={(e) => isDebugChanged(e.target.checked)}
        />
        <label htmlFor="debugInput">Debug</label>
      </div>
      <div className="flex gap-2 text-sm items-center">
        <label htmlFor="fpsInput">Fps</label>
        <input
          id="fpsInput"
          className="p-1 border rounded-sm"
          type="number"
          min={minFps}
          max={maxFps}
          value={fps}
          onChange={(e) =>
            fpsChanged(Math.min(Math.max(+e.target.value, minFps), maxFps))
          }
        />
      </div>
    </div>
  )
}

const GameControls = () => {
  const [isPlaying, noPlayerSnake] = useUnit([
    GameModel.$gameIsPlaying,
    SnakeModel.$noPlayerSnakes,
  ])
  const btnClass = clsx(
    'm-0 p-1 leading-5 text-xl bg-transparent border-transparent border hover:border-cyan-400 focus:outline-1 outline-cyan-400 disabled:border-transparent disabled:pointer-events-none'
  )

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2 justify-between">
        <button
          title={isPlaying ? 'Pause' : 'Play'}
          className={btnClass}
          onClick={() => {
            if (isPlaying) {
              GameModel.pause()
            } else {
              GameModel.play()
            }
          }}
        >
          {isPlaying ? '⏸️' : '⏯️'}
        </button>
        <button
          title="Restart"
          className={btnClass}
          onClick={() => GameModel.restart()}
        >
          🔄
        </button>

        <button
          title="Add bot"
          className={btnClass}
          onClick={() => Logic.SnakeModel.addBotSnake()}
        >
          🤖
        </button>
        <button
          title="Add player"
          disabled={!noPlayerSnake}
          className={btnClass}
          onClick={() => Logic.SnakeModel.addPlayerSnake()}
        >
          {noPlayerSnake ? '👤' : '🚷'}
        </button>
      </div>
    </div>
  )
}
