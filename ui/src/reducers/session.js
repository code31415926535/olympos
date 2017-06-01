import { SUBMIT_LOGIN, LOGIN_OK, LOGIN_FAIL, loginOk, loginFail } from '../actions'
import { auth } from '../util'

const initialState = {
    error: null,

    token: null,
};

const session = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_LOGIN:
            auth(action.username, action.password, loginOk, loginFail);
            return state;
        case LOGIN_OK:
            return Object.assign({}, state, {
               token: action.token
            });
        case LOGIN_FAIL:
            return Object.assign({}, state, {
                error: action.error
            });
        default:
            return state;
    }
};

export default session