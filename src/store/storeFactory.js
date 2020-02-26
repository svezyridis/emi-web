import { createStore, combineReducers, applyMiddleware } from 'redux'
import { account, open, dark } from './reducers'

const logger = store => next => action => {
  console.groupCollapsed('dispatching', action.type)
  console.log('prev state', store.getState())
  console.log('action', action)
  next(action)
  console.log('next state', store.getState())
  console.groupEnd()
}

const saver = store => next => action => {
  const result = next(action)
  window.localStorage['redux-store'] = JSON.stringify(store.getState())
  return result
}

const storeFactory = () =>
  applyMiddleware(logger, saver)(createStore)(
    combineReducers({ account, open, dark }),
    window.localStorage['redux-store']
      ? JSON.parse(window.localStorage['redux-store'])
      : {}
  )
const store = storeFactory()

export default store
