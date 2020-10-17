import React, { Component } from 'react';
import './stylesheet.scss';
import { Search, Grid, Header, Segment } from 'semantic-ui-react'

class HomePage extends Component {
    render() {
        return (
            <div className="HomePage">
                <h3 className="title">First component</h3>
                <Search className="search"/>
            </div>
        )
    }
}

export default HomePage