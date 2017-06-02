import React, { Component } from 'react'

import RemoveCircle from 'material-ui/svg-icons/content/remove-circle'
import { grey500 } from 'material-ui/styles/colors'

class IconUnknown extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <RemoveCircle color={grey500} />
        )
    }
}

export default IconUnknown