export const SUBMIT_LOGIN = "SUBMIT_LOGIN";
export const LOGIN_OK = "LOGIN_OK";
export const LOGIN_FAIL = "LOGIN_FAIL";

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

export const loginOk = (result) => {
    return {
        type: LOGIN_OK,
        token: result.value
    }
};

export const loginFail = (statusCode) => {
    let error = "An unknown error occurred.";
    if (statusCode === 401) {
        error = "The username or password you entered is invalid."
    }

    return {
        type: LOGIN_FAIL,
        error
    }
}

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