import { CHANGE_THEME } from '../actions'

const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';

const initialState = LIGHT_THEME;

const theme = (state = initialState, action) => {
  switch(action.type) {
      case CHANGE_THEME:
          if (state === LIGHT_THEME) {
              return DARK_THEME
          } else {
              return LIGHT_THEME
          }
      default:
          return state
  }
};

export default theme
