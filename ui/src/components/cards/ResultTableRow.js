import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { getJobResult } from '../../util/index'

import {CircularProgress, TableRow, TableRowColumn} from "material-ui"

import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import SubmissionFileInfo from "../dialogs/SubmissionFileInfo";
import SubmissionResultInfo from "../dialogs/SubmissionResultInfo";

class ResultTableRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            result: null,
            error: null
        }
    }

    componentWillMount() {
        const { session, submission: { jobUuid } } = this.props;

        getJobResult(session.token, jobUuid, (result) => {
            this.setState(() => {
                return {
                    result: result,
                    error: null
                }
            })
        }, () => {
            this.setState(() => {
                return {
                    result: null,
                    error: true
                }
            })
        })
    }

    render() {
        const { submission: { id, by, file } } = this.props;
        const { result, error } = this.state;

        let resultValue = null;
        if (error !== null) {
            resultValue (<ErrorOutline />)
        }

        if (result === null) {
            resultValue =  (<CircularProgress size={40} />)
        }

        console.log(result);

        return (
            <TableRow>
                <TableRowColumn> {id + 1} </TableRowColumn>
                <TableRowColumn> {by} </TableRowColumn>
                <TableRowColumn> <SubmissionFileInfo submissionFile={file.content} /> </TableRowColumn>
                <TableRowColumn> <SubmissionResultInfo resultModel={result} /> </TableRowColumn>
            </TableRow>
        )
    }
}

ResultTableRow.propTypes = {
    session: PropTypes.object.isRequired,
    submission: PropTypes.object.isRequired
};

export default ResultTableRow