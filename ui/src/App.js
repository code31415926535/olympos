import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import { createStore, applyMiddleware } from 'redux'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { Provider } from 'react-redux'

import { setDispatch } from './util'

import AppRouter from "./AppRouter"
import reducer from './reducers'

const middleware = routerMiddleware(hashHistory);

const store = createStore(
    reducer,
    applyMiddleware(middleware)
);

setDispatch(store.dispatch);

const history = syncHistoryWithStore(hashHistory, store);
history.listen(location => console.log(location));

class App extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Provider store={store}>
                <AppRouter history={history}/>
            </Provider>
        )
    }
}

export default App