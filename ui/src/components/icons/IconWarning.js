import React, { Component } from 'react'

import Warning from 'material-ui/svg-icons/alert/warning'
import { yellowA400 } from 'material-ui/styles/colors'

class IconWarning extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Warning color={yellowA400} />
        )
    }
}

export default IconWarning