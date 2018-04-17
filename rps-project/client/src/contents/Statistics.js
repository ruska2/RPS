import React, { Component } from 'react';
import GameHeader from "./GameHeader";
import axios from "axios/index";


class Statistics extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            score: props.score,
            team: props.team,
            toptenusers: {}
        };
    }

    componentWillMount(){
        this.getTopTenRequest();
    }

    render(){
        return <div>
            <div>{this.state.toptenusers.succes}</div>
            STATISTICS
            <GameHeader username={this.state.username} score={this.state.score} team={this.state.team}/>
        </div>
    }

    getTopTenRequest = (userData) => {
        return axios.post('/gettoptenusers',userData).then(
            (response) => {
                this.setState({toptenusers: response.data});
            })
            .catch ((error) => {
                console.log(error)
            });
    }
}

export default Statistics;
