import React, { Component } from 'react';
import GameHeader from "./GameHeader";
import "./TeamsStyle.css";
import Login from "../auth/Login.js"


class Teams extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            score: props.score,
            team: props.team
        };
    }

    render(){
        return <div>
            <GameHeader username={this.state.username} score={this.state.score} team={this.state.team}/>
            <div id='actual-team'><div id='actual-team-const'>ACTUAL TEAM:</div> <div id='actual-team-name'>{Login.staticProperty.team}</div></div>

            <div id='navbar'>
                <ul>
                    <li><div>Left Team</div></li>
                    <li><div>New Team</div></li>
                    <li><div>Search Team</div></li>
                </ul>
            </div>
        </div>
    }
}

export default Teams;
