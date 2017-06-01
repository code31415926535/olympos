import { SUBMIT_REGISTER, SUBMIT_LOGIN } from '../actions'

const initialState = {
    username: null,
    permission: null,

    token: null,
};

const session = (state = initialState, action) => {
    switch (action.type) {
        case SUBMIT_REGISTER:
            return state;
        case SUBMIT_LOGIN:
            return state;
        default:
            return state;
    }
};

export default session