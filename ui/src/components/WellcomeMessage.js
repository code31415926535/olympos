import React, { Component } from 'react'
import {Paper} from "material-ui";
import Header from "./basic/Header";
import Paragraph from "./basic/Paragraph";

class WellcomeMessage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const intro = "Wellcome to olympos, a modern solution to help you improve your programming skills! Olympos is still in it's early stages, so a lot of things are bound to improve";

        const suggestion = "Let's get started! We have a couple of tasks set up for you! Go check them out!";

        return (
            <Paper zDepth={2}
                   style={{
                       padding: "35px"
                   }}>
                <div style={{textAlign: "center", margin: "10px"}}>
                    <Header size='large' text="Wellcome to Olympos" />
                </div>

                <div style={{textAlign: "center", padding: "35px"}}>
                    <Paragraph color='primary' text={intro} />
                    <br />
                    <Paragraph text={suggestion} color='primary' />
                </div>
            </Paper>
        )
    }
}

export default WellcomeMessage