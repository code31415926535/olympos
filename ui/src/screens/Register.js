import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import FlexContainerCenter from "../containers/FlexContainerCenter"
import RegisterForm from "../components/RegisterForm"
import NavBar from "../components/NavBar"

class Register extends Component {
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
                <NavBar screen='register'/>
                <br />
                <br />
                <FlexContainerCenter>
                    <RegisterForm />
                </FlexContainerCenter>
            </div>
        )
    }
}

Register.propTypes = {
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

const ReduxRegister = connect(
    mapStateToProps,
    mapDispatchToProps
)(Register);

export default ReduxRegister