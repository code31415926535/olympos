import { CHANGE_THEME } from '../actions'

const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

const initialState = {
    value: LIGHT_THEME
};

const theme = (state = initialState, action) => {
  switch(action.type) {
      case CHANGE_THEME:
          if (state.value === LIGHT_THEME) {
              return {
                  value: DARK_THEME
              }
          } else {
              return {
                  value: LIGHT_THEME
              }
          }
      default:
          return state
  }
};

export default theme
