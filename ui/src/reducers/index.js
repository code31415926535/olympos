import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import session from './session'
import theme from './theme'

const reducer = combineReducers({
    session,
    theme,
    routing: routerReducer
});

export default reducer