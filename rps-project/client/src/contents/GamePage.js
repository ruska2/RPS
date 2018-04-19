import React, { Component } from 'react';
import GameHeader from "./GameHeader";



class GamePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
        };
    }

    render(){
        return  <GameHeader username={this.state.username}/>
    }
}

export default GamePage;
