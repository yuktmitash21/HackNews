import React, { Component } from 'react';
import './stylesheet.scss';
import { Search, Grid, Header, Segment, Menu, Button } from 'semantic-ui-react'
import {MenuCustom} from "../index";
import {Card} from '../index'

import * as firebase from 'firebase';


const CORS = "https://cors-anywhere.herokuapp.com/";
const NEWS_API = 'https://news.google.com/rss/search?q=';

const GOOGLE_SEARCH_IMAGE_META = 'og:image';
const GOOGLE_SEARCH_DESCRIPTION_META = 'og:description';

var data = require('./data.json');

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: '😊',
            newsArticles: [],
            text: '',
            votes: {},
            results: [],
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });


    componentDidMount() {

        const {newsArticles} = this.state;
        for (var i = 0; i < data.length; i++) {
            let currentItem = data[i];

            let div = document.createElement('div');
            div.innerHTML = currentItem.data;


            let metaTags = div.getElementsByTagName('meta');
            var description = "EMPTY";
            var image = '';
            for (var j = 0; j < metaTags.length; j++) {
                let tag = metaTags[j];
                let property = tag.getAttribute('property');
                let name = tag.getAttribute('name');
                if (property === GOOGLE_SEARCH_DESCRIPTION_META
                    || name === GOOGLE_SEARCH_DESCRIPTION_META) {
                    description = tag.content;
                } else if (property === GOOGLE_SEARCH_IMAGE_META
                    || name === GOOGLE_SEARCH_IMAGE_META) {
                    image = tag.content;
                }
            }


            let dataObj = {
                title: currentItem.title,
                link: currentItem.link,
                pubDate: currentItem.pubDate,
                description: currentItem.description,
                image,
                descriptionFetched: description,
            };

            newsArticles.push(dataObj);
        }

        const results = newsArticles.map(article => ({
            "description" : article.title,
            "image" : article.image,
        }));
        this.setState({newsArticles, results});

        const articles = newsArticles.map(article => ({
            description: article.description,
            descriptionFetched: article.descriptionFetched,
            pubDate: article.pubDate,
            image: article.image,
            title: article.title,
            upvotes: localStorage[article.link + '-upvotes'] ? Number.parseInt(localStorage[article.link + '-upvotes']) : 0,
            downvotes: localStorage[article.link + '-downvotes'] ? Number.parseInt(localStorage[article.link + '-downvotes']) : 0,

        }));

        firebase.database().ref('articles').set({
            articles
        });

        this.updateVotes();
    }

    handleSearchChange = (e, { value }) => {
        var {newsArticles, results} = this.state;
        this.setState({text: value});
        results = newsArticles.filter(article => article.title.includes(value)).map(article => ({
                "description" : article.title,
                "image" : article.image,

        }));

        this.setState({results});
    };

    handleSearch = () => {
        const {newsArticles} = this.state;
    };

    handleVote = (url, isUpvote) => {
        let votes = localStorage[url] ? Number.parseInt(localStorage[url]) : 0;
        votes += (isUpvote ? 1 : -1);
        localStorage[url] = votes;

        let upvotes = isUpvote ? 1 : 0;
        let downvotes = !isUpvote ? 1 : 0;


        localStorage[url + '-upvotes'] = localStorage[url + '-upvotes'] ? Number.parseInt(localStorage[url + '-upvotes']) + upvotes : upvotes;
        localStorage[url + '-downvotes'] = localStorage[url + '-downvotes'] ? Number.parseInt(localStorage[url + '-downvotes'])  + downvotes : downvotes;

        this.updateVotes();
    };

    updateVotes = () => {
        const {votes, newsArticles} = this.state;
        newsArticles.forEach((article) => {
            votes[article.link] = localStorage[article.link] ? Number.parseInt(localStorage[article.link]) : 0;
            votes[article.link + '-upvotes'] = localStorage[article.link + '-upvotes'] ? Number.parseInt(localStorage[article.link + '-upvotes']) : 0;
            votes[article.link + '-downvotes'] = localStorage[article.link + '-downvotes'] ? Number.parseInt(localStorage[article.link + '-downvotes']) : 0;
        });
        this.setState({votes});
    };

    handleResultSelect = (e, data) => {
        let description = data.result.description;
        let elements = document.getElementsByClassName('Card');
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].dataset['id'] === description) {
                console.log('found');
                elements[i].scrollIntoView();
            }
        }
    };

    render() {
        var {activeItem, newsArticles, votes, results, text} = this.state;

        console.log(results);

        let maxCount = 0;
        Object.keys(votes).forEach(key => {
            maxCount = Math.max(votes[key], maxCount);
        });
        newsArticles = newsArticles.sort((a, b) => {
            let upvotes = votes[a.link + '-upvotes'] || 0;
            let downvotes = votes[a.link + '-downvotes'] || 0;

            let percentA = Math.round(100 * upvotes / (upvotes + downvotes + 1));

            let upvotesB = votes[b.link + '-upvotes'] || 0;
            let downvotesB = votes[b.link + '-downvotes'] || 0;

            let percentB = Math.round(100 * upvotesB / (upvotesB + downvotesB + 1));

           return percentB - percentA;
        });



       let data = newsArticles.map(article => {
           let upvotes = votes[article.link + '-upvotes'] || 0;
           let downvotes = votes[article.link + '-downvotes'] || 0;

           let percent = Math.round(100 * upvotes / (upvotes + downvotes));
           return (
               <Card
                   percent={percent}
                   title={article.title}
                   description={article.descriptionFetched.replace(/[\u{0080}-\u{FFFF}]/gu,"")}
                   image={article.image}
                   pubDate={article.pubDate}
                   link={article.link}
                   upvotes={votes[article.link + '-upvotes'] || 0}
                   downvotes={votes[article.link + '-downvotes'] || 0}
                   handleVote={this.handleVote}
               />

           )
       });

        return (
            <div className="HomePage">
                <h3 className="title">HackNews</h3>
                <Search
                    value={text}
                    loading={false}
                    results={results}
                    onResultSelect={(e, data) => this.handleResultSelect(e, data)}
                    onSearchChange={this.handleSearchChange}
                    className="search"/>
                    <br/>
                    <br/>
                {/*<Button className="button-og" onClick={this.handleSearch}>Search</Button>*/}
                <br/>
                <br/>
                {data}
            </div>
        )
    }
}

export default HomePage