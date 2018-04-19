import React, { Component } from 'react';
import GameHeader from "./GameHeader";
import "./TeamsStyle.css";
import Search from './images/search.png'
import LeaveTeam from "./LeaveTeam";
import Login from '../auth/Login'

class Teams extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            active: ''
        };
    }

    componentWillMount(){
        console.log("teamsTeams" + Login.staticProperty.team);
    }

    render(){
        return <div>
            <GameHeader username={this.state.username}/>
            <div id="actialandbarholder">
                <div id='actual-team'><div id='actual-team-const'>ACTUAL TEAM:</div> <div id='actual-team-name'>{this.state.team}</div></div>

                <div id='navbar'>
                    <ul>
                        <li>
                            <div id = 'srchdiv' onClick={this.navClick} style={this.state.active === 'srchdiv' ? {background: "#006CBA" ,color: "white"} : null}>
                                <img id="searchimg" src={Search}/>
                            </div>
                        </li>
                        <li>
                            <div id = 'lvdiv' onClick={this.navClick}  style={this.state.active === 'lvdiv' ? {background: "#006CBA" ,color: "white"} : null}>
                                Leave Team
                            </div>
                        </li>
                        <li>
                            <div id = 'newdiv' onClick={this.navClick}  style={this.state.active === 'newdiv' ? {background: "#006CBA",color: "white"} : null}>
                                Create New Team
                            </div>
                        </li>
                    </ul>
                </div>
                <hr/>

                {this.state.active === 'srchdiv' && <div>
                </div>}
                {this.state.active === 'lvdiv' &&
                <LeaveTeam team={this.state.team}/>}
                {this.state.active === 'newdiv' && <div>NEWDIV</div>}

            </div>
        </div>
    }

    navClick = (e) =>{
        if(e.target.id === 'searchimg'){
            this.setState({
                active: 'srchdiv'
            });
            return;
        }
        this.setState({
            active: e.target.id
        });
        console.log(e.target.id);
    }
}

export default Teams;
