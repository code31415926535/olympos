/* Action types */
export const SUBMIT_LOGIN = "SUBMIT_LOGIN";

export const SUBMIT_REGISTER = "SUBMIT_REGISTER";

export const CHANGE_THEME = "CHANGE_THEME";

/* Action creators */
export const submitLogin = (username, password) => {
    return {
        type: SUBMIT_LOGIN,
        username,
        password
    }
};

export const submitRegister = (username, password, email) => {
    return {
        type: SUBMIT_REGISTER,
        username,
        password,
        email
    }
};

export const changeTheme = () => {
    return {
        type: CHANGE_THEME
    }
};