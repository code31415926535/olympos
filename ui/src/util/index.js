import request from 'superagent'

const API_BASE = "http://localhost:8080";

let dispatch = null;

const postDispatch = (url, data, token, onSuccessAction, onFailAction) => {

    let authHeader = '';
    if (token !== null) {
        authHeader = token
    }

    request
        .post(url)
        .send(data)
        .set('Content-Type','application/json')
        .set('Accept', 'application/json')
        .set('x-access-token', authHeader)
        .end((err, res) => {
            if (err || res.statusCode !== 200) {
                dispatch(onFailAction(res.statusCode))
            } else {
                dispatch(onSuccessAction(res.body))
            }
        })
};

const get = (url, token, onSuccessAction, onFailAction) => {
  request
      .get(url)
      .set('Accept', 'application/json')
      .set('x-access-token', token)
      .end((err, res) => {
          if (err || res.statusCode !== 200) {
              onFailAction(res.statusCode)
          } else {
              onSuccessAction(res.body)
          }
      })
};

export const auth = (username, password, onSuccessAction, onFailAction) => {

    const url = API_BASE + "/auth";
    const data = {
        username,
        password
    };

    postDispatch(url, data, null, onSuccessAction, onFailAction)
};

export const getEnvList = (token, onSuccessAction, onFailActon) => {

    const url = API_BASE + "/env";

    get(url, token, onSuccessAction, onFailActon)
};

export const getTestList = (token, onSuccessAction, onFailAction) => {

    const url = API_BASE + '/test';

    get(url, token, onSuccessAction, onFailAction)
};

export const getUserList = (token, onSuccessAction, onFailAction) => {

    const url = API_BASE + '/user';

    get(url, token, onSuccessAction, onFailAction)
};

export const getTaskList = (token, onSuccessAction, onFailAction) => {

    const url = API_BASE + '/task';

    get(url, token, onSuccessAction, onFailAction)
};

export const getTaskByName = (token, taskName, onSuccessAction, onFailAction) => {

    const url = API_BASE + '/task/' + taskName;

    get(url, token, onSuccessAction, onFailAction)
};

export const setDispatch = (d) => {
    dispatch = d
};