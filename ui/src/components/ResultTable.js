import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {CircularProgress, Paper, Table, TableBody, TableHeader, TableHeaderColumn, TableRow} from "material-ui"

import { getTaskSubmissions } from '../util'

import ErrorOutline from 'material-ui/svg-icons/alert/error-outline'
import ResultTableRow from "./cards/ResultTableRow";

class ResultTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            empty: false,
            submissions: [],
            error: null
        }
    }

    componentWillMount() {
        const { session, taskName } = this.props;

        getTaskSubmissions(session.token, taskName, (result) => {
            this.setState(() => {
                return {
                    empty: result.length === 0,
                    submissions: result,
                    error: null
                }
            })
        }, () => {
            this.setState(() => {
                return {
                    empty: false,
                    submissions: null,
                    error: true
                }
            })
        })
    }

    render() {
        const { session } = this.props;
        const { submissions, error, empty } = this.state;

        if (error !== null) {
            return (<ErrorOutline />)
        }

        if (submissions.length === 0 && !empty) {
            return (<CircularProgress size={60} />)
        }

        return (
            <Paper zDepth={1}>
                <Table>
                    <TableHeader displaySelectAll={false}
                                 adjustForCheckbox={false}
                                 selectable={false}>
                        <TableRow>
                            <TableHeaderColumn> ID </TableHeaderColumn>
                            <TableHeaderColumn> Submitted by </TableHeaderColumn>
                            <TableHeaderColumn> File </TableHeaderColumn>
                            <TableHeaderColumn> Result </TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submissions.reverse().map((item, key) => {
                            return (
                                <ResultTableRow session={session} submission={item} key={key} />
                            )
                        })}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

ResultTable.propTypes = {
    session: PropTypes.object.isRequired,
    taskName: PropTypes.string.isRequired
};

export default ResultTable