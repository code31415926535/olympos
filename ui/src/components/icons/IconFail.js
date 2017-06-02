import React, { Component } from 'react'

import Cancel from 'material-ui/svg-icons/navigation/cancel'
import { red500 } from 'material-ui/styles/colors'

class IconFail extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Cancel color={red500} />
        )
    }
}

export default IconFail