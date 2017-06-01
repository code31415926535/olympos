import React, { Component } from 'react'
import {Paper} from "material-ui";
import muiThemeable from 'material-ui/styles/muiThemeable';

class NotFoundCard extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { muiTheme } = this.props;

        return (
            <Paper zDepth={2}
                   style={{
                       padding: "35px"
                   }}>
                <h2 style={{color: muiTheme.palette.textColor}}>
                    404 Not Found
                </h2>
                <br />
                <p style={{color: muiTheme.palette.textColor}}>
                    I'm afraid this is not the page you are looking for ...
                </p>
            </Paper>
        )
    }
}

export default muiThemeable()(NotFoundCard)