import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import SyntaxHighlighter from 'react-syntax-highlighter'
import { atelierCaveDark, atelierCaveLight } from 'react-syntax-highlighter/dist/styles'

class Syntax extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const { filename, children, theme } = this.props;

        const extension = filename.split('.').pop();

        let language = "less";
        if (extension === "py") {
            language = "python";
        } else if (extension === "c" || extension === "cpp") {
            language = "cpp";
        } else if (extension === "yaml" || extension === "yml") {
            language = "yaml";
        }

        let style = null;
        if (theme === 'dark') {
            style = atelierCaveDark
        } else {
            style = atelierCaveLight
        }

        return (
            <SyntaxHighlighter language={language} style={style}>
                {children}
            </SyntaxHighlighter>
        )
    }
}

Syntax.propTypes = {
    filename: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired
};

const mapStateToProps = (state) => {
    return {
        theme: state.theme.value
    }
};

const mapDispatchToProps = () => {
    return {}
};

const ReduxSyntax = connect(
    mapStateToProps,
    mapDispatchToProps
)(Syntax);

export default ReduxSyntax