import React, { Component } from 'react';
import GameHeader from "./GameHeader";
import axios from "axios/index";
import Table from "./Table.js";
import "./StatisticsStyle.css";


class Statistics extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            score: props.score,
            team: props.team,
            topTen:[],
            lastTenMatches:[],
        }
    };

    componentWillMount(){
        this.getStatistics({username:this.state.username});
    }

    render(){
        return <div>
            <GameHeader username={this.state.username} score={this.state.score} team={this.state.team}/>
            <div id="wrapper">
                <Table data={this.state.topTen} title='Top 10 players' type={1}/>
                <Table data={this.state.topTen} title='Last 10 matches' type={2}/>
                <Table data={this.state.topTen} title='Top 10 teams' type={3}/>
            </div>
        </div>
    }

    getStatistics = (userData) => {
        return axios.post('/getstatistics',{userData}).then(
            (response) => {
                this.setState({topTen: response.data.topten});
                console.log(this.state.topTen);
            })
            .catch ((error) => {
                console.log(error)
            });
    };
}

export default Statistics;
