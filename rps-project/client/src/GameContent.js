import React, { Component } from 'react';
import Route from "react-router-dom/es/Route";
import GamePage from "./contents/GamePage";
import Statistics from "./contents/Statistics";
import Teams from "./contents/Teams";

class GameContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
        };

    }

    render() {
        return (
            <div>
                <Route path='/game' exact render={ props => <GamePage username={this.state.username}/>}/>
                <Route path='/game/statistics' exact render={ props => <Statistics username={this.state.username}/>}/>
                <Route path='/game/teams' exact render={ props => <Teams username={this.state.username}  score={this.state.score}/>}/>
                <Route path='/login' exact render={ props => <GamePage username={this.state.username}/>}/>
                <Route path='/register/' exact render={ props => <GamePage username={this.state.username} />}/>
                <Route path='/' exact render={ props => <GamePage username={this.state.username}/>}/>
            </div>
        );
    }

}

export default GameContent;