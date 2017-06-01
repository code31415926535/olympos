import React, { Component } from 'react'

import FlexContainerCenter from '../containers/FlexContainerCenter'

import LoginForm from '../components/LoginForm'
import NavBar from "../components/NavBar"

class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBar />
                <br />
                <br />
                <FlexContainerCenter>
                    <LoginForm />
                </FlexContainerCenter>
            </div>
        )
    }
}



export default Login