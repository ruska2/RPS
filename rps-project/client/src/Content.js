import React, { Component } from 'react';
import './ContentStyle.css';
import Login from './auth/Login.js';
import Register from "./auth/Register";
import Route from "react-router-dom/es/Route";
import Redirect from "react-router-dom/es/Redirect";
import GameContent from "./GameContent";

class Content extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logged: props.logged
        };
        console.log(props.logged);
    }


    render() {
        return (
            <div>
                    <Route exact path='/' component={Login}/>
                    <Route exact path='/login' component={Login}/>
                    <Route path='/register' component={Register}/>
                    {this.state.logged === 'false'?
                        <Redirect to={{ pathname: '/login', state: { from: this.state.location } }} />
                        : null}
                    <Route path='/game/'exact render={ props => <GameContent username={Login.staticProperty.username} score={Login.staticProperty.score} team={Login.staticProperty.team}/>}/>
                    <Route path='/game/statistics' exact render={ props => <GameContent username={Login.staticProperty.username} score={Login.staticProperty.score} team={Login.staticProperty.team}/>}/>
                    <Route path='/game/teams' exact render={ props => <GameContent username={Login.staticProperty.username} score={Login.staticProperty.score} team={Login.staticProperty.team}/>}/>
            </div>
        );
    }

}

export default Content;