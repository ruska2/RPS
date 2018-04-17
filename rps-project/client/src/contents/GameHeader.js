import React, { Component } from 'react';
import './GameHeaderStyle.css';
import TitleImage from './images/rpsfunny.png';
import LogoutImage from './images/logoutpng.png'
import axios from "axios/index";
import PropTypes from "prop-types";
import Login from '../auth/Login.js';
import Link from "react-router-dom/es/Link";
import Register from "../auth/Register";


class GameHeader extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            score: props.score,
            team: props.team
        };
    }

    render(){
        return (
            <div id="gameheader">
                <div id='headerbar'>
                    <div id="titlediv">
                        <img id='funnyimg'  src={TitleImage} alt='title-img'/>
                    </div>
                    <div id='usernamediv'>
                        <div id='usernamedisplay'>{this.state.username}</div>
                    </div>
                    <div id='scorediv'>
                        <div id='score'>SCORE: {this.state.score}</div>
                    </div>
                    <div id='teamdiv'>
                        <div id='team'>{this.state.team ? "TEAM: " : null} {this.state.team}</div>
                    </div>
                    <div id="logoutdiv" onClick={this.logoutClicked}>
                        <img id='logoutimg'  src={LogoutImage} alt='logout-img'/>
                    </div>
                    <div id="statisticsdiv">
                        <Link to='/game/statistics' id="statisticslink"> STATISTICS </Link>
                    </div>
                    <div id="teamsdiv">
                        <Link to='/game/teams' id="teamslink"> TEAMS </Link>
                    </div>
                    <div id="gamediv">
                        <Link to='/game' id="gamelink"> GAME </Link>
                    </div>
                </div>

            </div>
        )
    }

    logoutClicked = () =>{

        axios.post('/remlogged',{username: this.state.username}).then(
            (response) => {
                console.log(response.data.username);
                Register.staticProperty.msg = '';
                this.context.router.history.push("/login");
                if(Login.staticProperty.username === ''){
                    window.location.reload();
                }

            })
            .catch ((error) => {
                console.log(error)
            });
    }
}

GameHeader.contextTypes = {
    router: PropTypes.object
};

export default GameHeader;