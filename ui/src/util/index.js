import request from 'superagent'

const API_BASE = "http://localhost:8080";

let dispatch = null;

const post = (url, data, onSuccessAction, onFailAction) => {

    request
        .post(url)
        .send(data)
        .set('Content-Type','application/json')
        .set('Accept', 'application/json')
        .end((err, res) => {
            if (err || res.statusCode !== 200) {
                dispatch(onFailAction(res.statusCode))
            } else {
                dispatch(onSuccessAction(res.body))
            }
        })
};

export const auth = (username, password, onSuccessAction, onFailAction) => {

    const url = API_BASE + "/auth";
    const data = {
        username,
        password
    };

    post(url, data, onSuccessAction, onFailAction)
};

export const setDispatch = (d) => {
    dispatch = d
};