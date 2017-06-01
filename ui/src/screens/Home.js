import React, { Component } from 'react'
import NavBar from "../components/NavBar";
import FlexContainerCenter from "../containers/FlexContainerCenter";
import WellcomeMessage from "../components/WellcomeMessage";

class Home extends Component {
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
                    <WellcomeMessage />
                </FlexContainerCenter>
            </div>
        )
    }
}

export default Home