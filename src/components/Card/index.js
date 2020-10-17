import React, { Component } from 'react';
import './stylesheet.scss';
import {Image, Icon} from 'semantic-ui-react'
import moment from 'moment';

class Card extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isUpvote: undefined
        }
    }

    handleIconClick = (isUpvote) => {
        this.setState({isUpvote: isUpvote});
        this.props.handleVote(this.props.link, isUpvote);
    };

    render() {
        const {title, description, image, pubDate, link} = this.props;
        const {isUpvote} = this.state;

        return (
            <div className="Card">
                <Icon style={isUpvote !== undefined && isUpvote ? {backgroundColor: 'palevioletred'} : {}} onClick={() => this.handleIconClick(true)} className="down-icon" size='large' name="arrow up"/>
                <Icon style={isUpvote !== undefined && !isUpvote ? {backgroundColor: 'palevioletred'} : {}} onClick={() => this.handleIconClick(false)}  className="up-icon" size='large' name="arrow down"/>
                <h3 className="title">{title}</h3>
                <span className="text">{moment(new Date(pubDate)).fromNow()}</span>
                <p className="text">{description}</p>
                <Image size='medium' wrapped src={image}/>
                <a href={link}/>

            </div>
        );
    }

}

export default Card