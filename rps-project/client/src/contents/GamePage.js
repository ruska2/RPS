import React, { Component } from 'react';
import GameHeader from "./GameHeader";
import './GamePageStyle.css'
import Game from "./Game";



class GamePage extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
        };
    }

    render(){
        return  <div>
            <GameHeader username={this.state.username}/>
            <div style={{marginTop: '70px'}}>
                <Game/>
            </div>
        </div>
    }
}

export default GamePage;
