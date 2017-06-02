import React, { Component } from 'react'

import CheckCircle from 'material-ui/svg-icons/action/check-circle'
import { green500 } from 'material-ui/styles/colors'

class IconOk extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <CheckCircle color={green500} />
        )
    }
}

export default IconOk