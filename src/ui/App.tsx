import {useUnit} from 'effector-react'
import styles from './app.module.css'
import {Logic} from '@app/logic'
import clsx from 'clsx'

const {GameModel} = Logic

export const App = () => {
  return (
    <div className={styles.app}>
      <div className="flex flex-col gap-3 p-4 bg-slate-200 bg-opacity-70 rounded">
        <Settings />
        <GameControls />
        <Score />
      </div>
    </div>
  )
}

const Score = () => {
  const [snakes] = useUnit([Logic.SnakeModel.$snakes])

  return (
    <div className="flex flex-col gap-1">
      {snakes.map((s) => (
        <div
          key={s.id}
          className="flex gap-4"
          style={{color: s.isDead ? 'black' : s.color.head}}
        >
          <span>{s.id}</span>
          <span>{s.score}</span>
        </div>
      ))}
    </div>
  )
}

const Settings = () => {
  const [isDebug, isDebugChanged] = useUnit([
    GameModel.$isDebug,
    GameModel.isDebugChanged,
  ])

  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-semibold">Settings</h3>
      <div className="flex gap-2">
        <input
          id="debugInput"
          type="checkbox"
          checked={isDebug}
          onChange={(e) => isDebugChanged(e.target.checked)}
        />
        <label htmlFor="debugInput">Debug</label>
      </div>
    </div>
  )
}

const GameControls = () => {
  const [isPlaying] = useUnit([GameModel.$gameIsPlaying])
  const btnClass = clsx('w-full text-sm px-3 py-1 bg-white')

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-2">
        <button
          className={btnClass}
          onClick={() => {
            if (isPlaying) {
              GameModel.pause()
            } else {
              GameModel.play()
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button className={btnClass} onClick={() => GameModel.restart()}>
          Reset
        </button>
      </div>
      <div>
        <button
          className={btnClass}
          onClick={() => Logic.SnakeModel.addBotSnake()}
        >
          Add bot
        </button>
      </div>
    </div>
  )
}
