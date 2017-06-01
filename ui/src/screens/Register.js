import React, { Component } from 'react'
import FlexContainerCenter from "../containers/FlexContainerCenter";
import RegisterForm from "../components/RegisterForm";

class Register extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FlexContainerCenter>
                <RegisterForm />
            </FlexContainerCenter>
        )
    }
}

export default Register