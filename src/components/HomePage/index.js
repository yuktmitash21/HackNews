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

class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeItem: '😊',
            newsArticles: [],
            text: '',
            votes: {},
        }
    }

    handleItemClick = (e, { name }) => this.setState({ activeItem: name });

    handleSearchChange = (e, { value }) => {
        const {newsArticles} = this.state;
        this.setState({text: value});
    };

    handleSearch = () => {
        var {text, newsArticles} = this.state;
        newsArticles = [];

        let val = CORS + NEWS_API + text + '%20' + 'yemen';
        fetch(val).then(res => {
           return res.text();
        }).then(data => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data,"text/xml");
            let items = xmlDoc.getElementsByTagName("item");
            for (var i = 0; i < 10; i++) {
                let currentItem = items[i];
                fetch(CORS + currentItem.getElementsByTagName('link')[0].textContent).then(res => res.text()).then(data => {
                   let div = document.createElement('div');
                   div.innerHTML = data;

                    let metaTags = div.getElementsByTagName('meta');
                    var description = "EMPTY";
                    var image = '';
                    for (var i = 0; i < metaTags.length; i++) {
                        let tag = metaTags[i];
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
                        title: currentItem.getElementsByTagName('title')[0].textContent,
                        link: currentItem.getElementsByTagName('link')[0].textContent,
                        pubDate: currentItem.getElementsByTagName('pubDate')[0].textContent,
                        description: currentItem.getElementsByTagName('description')[0].textContent,
                        image,
                        descriptionFetched: description,
                    };
                    newsArticles.push(dataObj);
                    this.setState({newsArticles});

                    localStorage['test-articles'] = JSON.stringify(newsArticles);
                    this.updateVotes();
                });
            }
        });



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

    render() {
        var {activeItem, newsArticles, votes} = this.state;

        let maxCount = 0;
        Object.keys(votes).forEach(key => {
            maxCount = Math.max(votes[key], maxCount);
        });
        newsArticles = newsArticles.sort((a, b) => {
            let upvotes = votes[a.link + '-upvotes'] || 0;
            let downvotes = votes[a.link + '-downvotes'] || 0;

            let percentA = Math.round(100 * upvotes / (upvotes + downvotes));

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
                   description={article.descriptionFetched}
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
                    onSearchChange={this.handleSearchChange}
                    className="search"/>
                    <br/>
                    <br/>
                <Button className="button-og" onClick={this.handleSearch}>Search</Button>
                <br/>
                <br/>
                <MenuCustom activeItem={activeItem} handleTabChange={this.handleItemClick}/>
                <br/>
                {data}
            </div>
        )
    }
}

export default HomePage