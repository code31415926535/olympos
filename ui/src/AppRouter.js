import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router, Route, IndexRoute } from 'react-router'

import AppBody from './AppBody'

import { Root, Login, Register, NotFound, Home } from './screens'

class AppRouter extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { history } = this.props;

        return (
            <Router history={history}>
                <Route path="/" component={AppBody}>
                    <IndexRoute component={Root}/>
                    <Route path="login" component={Login} />
                    <Route path="register" component={Register} />
                    <Route path="home" component={Home} />
                    <Route path="*" component={NotFound} />
                </Route>
            </Router>
        )
    }
}

AppRouter.propTypes = {
    history: PropTypes.object.isRequired
};

export default AppRouter