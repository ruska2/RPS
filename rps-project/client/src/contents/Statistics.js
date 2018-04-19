import React, { Component } from 'react';
import GameHeader from "./GameHeader";
import axios from "axios/index";
import Table from "./Table.js";
import "./StatisticsStyle.css";
import Login from "../auth/Login"


class Statistics extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            score: props.score,
            team: props.team,
            topTen:[],
            lastTenMatches:[],
            topTeams:[],
            toptenInTeam:[],
            position: null,
            posinteam: null
        }
    };

    componentWillMount(){
        this.getStatistics({username:this.state.username});
    }

    render(){
        return <div>
            <GameHeader username={this.state.username} score={this.state.score} team={this.state.team}/>
            <div id="wrapper">
                <h3 id='pos'>
                    Overall position: {this.state.position}.<br/>
                    Position in team: {this.state.posinteam}.
                </h3>
                <Table data={this.state.topTen} title='Top 10 players' type={1}/>
                <Table data={this.state.lastTenMatches} title='Last 20 matches' type={2}/>
                <Table data={this.state.topTeams} title='Top 10 teams' type={3}/>
                <Table data={this.state.toptenInTeam} title={'Top 10 in ' + Login.staticProperty.team} type={4}/>
            </div>
        </div>
    }

    getStatistics = (userData) => {
        return axios.post('/getstatistics',{userData}).then(
            (response) => {
                this.setState({topTen: response.data.topten,
                    lastTenMatches: response.data.lastten,
                    topTeams: response.data.topteams,
                    position: response.data.position,
                    posinteam: response.data.posinteam,
                    toptenInTeam: response.data.topteninteam
                });
                console.log(this.state.topTeams);
            })
            .catch ((error) => {
                console.log(error)
            });
    };
}

export default Statistics;
