import {useUnit} from 'effector-react'
import styles from './app.module.css'
import {Logic} from '@app/logic'
import clsx from 'clsx'

export const App = () => {
  return (
    <div className={styles.app}>
      <div className="flex flex-col gap-3 p-4 bg-blue-400 bg-opacity-20 rounded">
        <span>Settings</span>
        <GameControls />
      </div>
    </div>
  )
}

const GameControls = () => {
  const [isPlaying] = useUnit([Logic.GameModel.$gameIsPlaying])
  const btnClass = clsx('w-full text-sm px-3 py-1 bg-white')

  return (
    <div className="flex gap-2">
      <button
        className={btnClass}
        onClick={() => {
          if (isPlaying) {
            Logic.GameModel.pause()
          } else {
            Logic.GameModel.play()
          }
        }}
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button className={btnClass} onClick={() => Logic.GameModel.restart()}>
        Reset
      </button>
    </div>
  )
}
