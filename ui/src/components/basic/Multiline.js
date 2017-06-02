import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Paragraph from "./Paragraph";

class Multiline extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { text } = this.props;

        const lines = text.split('\n');

        return (
            <div>
                {lines.map((text, key) => {
                    return (
                        <Paragraph text={text} key={key} />
                    )
                })}
            </div>
        )
    }
}

Multiline.propTypes = {
    text: PropTypes.string.isRequired
};

export default Multiline