import React, { Component } from 'react'
import FlexContainerCenter from "../containers/FlexContainerCenter";
import RegisterForm from "../components/RegisterForm";
import NavBar from "../components/NavBar";

class Register extends Component {
    constructor(props) {
        super(props);
    }

    render() {
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

export default Register