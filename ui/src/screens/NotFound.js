import React, { Component } from 'react'

import FlexContainerCenter from '../containers/FlexContainerCenter'
import NavBar from "../components/NavBar"
import NotFoundCard from "../components/NotFoundCard";

class NotFound extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <NavBar screen='notfound'/>
                <br />
                <br />
                <FlexContainerCenter>
                    <NotFoundCard />
                </FlexContainerCenter>
            </div>
        )
    }
}

export default NotFound