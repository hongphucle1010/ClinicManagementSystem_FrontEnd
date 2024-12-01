import { combineReducers } from 'redux'
import userReducer from './userState'

const rootReducer = combineReducers({
  user: userReducer
})

export default rootReducer
