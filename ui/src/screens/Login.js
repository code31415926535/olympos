import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import FlexContainerCenter from '../containers/FlexContainerCenter'

import LoginForm from '../components/LoginForm'
import NavBar from "../components/NavBar"

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { session, toScreen } = this.props;

        if (session.token !== null) {
            toScreen('/home');
            return null
        }

        return (
            <div>
                <NavBar screen='login'/>
                <br />
                <br />
                <FlexContainerCenter>
                    <LoginForm />
                </FlexContainerCenter>
            </div>
        )
    }
}

Login.propTypes = {
    session: PropTypes.object.isRequired,
    toScreen: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {
        session: state.session
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        toScreen: (name) => {
            dispatch(push(name))
        }
    }
};

const ReduxLogin = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default ReduxLogin
