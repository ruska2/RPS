import React, { Component } from 'react';
import GameHeader from "./GameHeader";



class GamePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            score: props.score,
            team: props.team
        };
    }

    render(){
        return  <GameHeader username={this.state.username} score={this.state.score} team={this.state.team}/>
    }
}

export default GamePage;
