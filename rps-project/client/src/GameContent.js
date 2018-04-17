import React, { Component } from 'react';
import Login from './auth/Login.js';
import Route from "react-router-dom/es/Route";
import GamePage from "./contents/GamePage";
import Statistics from "./contents/Statistics";
import Teams from "./contents/Teams";

class GameContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            score: Login.staticProperty.score,
            team: Login.staticProperty.team
        };
    }


    render() {
        return (
            <div>
                <Route path='/game' exact render={ props => <GamePage username={this.state.username} score={this.state.score} team={this.state.team}/>}/>
                <Route path='/game/statistics' exact render={ props => <Statistics username={this.state.username}  score={this.state.score} team={this.state.team}/>}/>
                <Route path='/game/teams' exact render={ props => <Teams username={this.state.username}  score={this.state.score} team={this.state.team}/>}/>
                <Route path='/login' exact render={ props => <GamePage username={this.state.username} score={this.state.score} team={this.state.team}/>}/>
                <Route path='/register/' exact render={ props => <GamePage username={this.state.username} score={this.state.score} team={this.state.team}/>}/>
                <Route path='/' exact render={ props => <GamePage username={this.state.username} score={this.state.score} team={this.state.team}/>}/>
            </div>
        );
    }

}

export default GameContent;