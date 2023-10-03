import {FoodModel} from './food'
import {GameModel} from './game'
import {GraphModel} from './graph'
import {createLoopFactory} from './loop'
import {SnakeModel} from './snake'
import {$state, State, updateState} from './state'

export const Logic = {
  $state,
  updateState,
  createLoopFactory,
  GameModel,
  FoodModel,
  GraphModel,
  SnakeModel,
}

export type {State}
