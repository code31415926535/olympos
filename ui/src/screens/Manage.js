import React, { Component } from 'react'
import NavBar from "../components/NavBar";
import FlexContainerCenter from "../containers/FlexContainerCenter";

class Manage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <NavBar />
                <br />
                <br />
                <FlexContainerCenter>

                </FlexContainerCenter>
            </div>
        )
    }
}

export default Manage