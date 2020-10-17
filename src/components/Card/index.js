import React, { Component } from 'react';
import './stylesheet.scss';
import {Image, Icon, Popup, Progress} from 'semantic-ui-react'
import moment from 'moment';
import { scaleLinear } from "d3-scale"

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

    componentDidUpdate(prevProps, prevState, snapshot) {
        const customScale = scaleLinear()
            .domain([1, 100])
            .range(['#FF0000','#00FF00']);

        let color = customScale(this.props.percent);

        let card = document.getElementById(this.props.link);
        let bar = card.getElementsByClassName('bar')[0];
        bar.style.background = color;

    }

    render() {
        const {title, description, image, pubDate, link, upvotes, downvotes, percent} = this.props;
        const {isUpvote} = this.state;



        return (
            <div id={link} className="Card">
                <Progress percent={percent} progress color="red" />
                <Popup
                    trigger={<Icon style={isUpvote !== undefined && isUpvote ? {backgroundColor: 'palevioletred'} : {}} onClick={() => this.handleIconClick(true)} className="down-icon" size='large' name="chevron up"/>}
                    content={upvotes + ' Realvotes'}
                    inverted
                />
                <br/>
                <br/>
                <Popup
                    trigger={ <Icon style={isUpvote !== undefined && !isUpvote ? {backgroundColor: 'palevioletred'} : {}} onClick={() => this.handleIconClick(false)}  className="up-icon" size='large' name="chevron down"/>}
                    content={downvotes + ' Fakevotes'}
                    inverted
                />
                <h3 className="title">
                    {title}
                </h3>
                <span className="text">{moment(new Date(pubDate)).fromNow()}</span>
                <p className="text">
                    <img className="img" src={image}/>
                    {description}
                </p>
                <a href={link}/>

            </div>
        );
    }

}

export default Card