import React, { Component } from 'react';
import GameHeader from "./GameHeader";
import "./TeamsStyle.css";
import Search from './images/search.png'
import LeaveTeam from "./LeaveTeam";
import Login from '../auth/Login'
import CreateNewTeam from "./CreateNewTeam";
import SearchTeams from "./SearchTeams";

class Teams extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            active: ''
        };
    }

    render(){
        return <div>
            <GameHeader username={this.state.username}/>
            <div id="actialandbarholder">
                <div id='actual-team'><div id='actual-team-const'>ACTUAL TEAM:</div> <div id='actual-team-name'>{Login.staticProperty.team}</div></div>

                <div id='navbar'>
                    <ul>
                        <li>
                            <div id = 'srchdiv' onClick={this.navClick} style={this.state.active === 'srchdiv' ? {background: "#006CBA" ,color: "white"} : null}>
                                <img alt='srchimg'id="searchimg" src={Search}/>
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

                {this.state.active === 'srchdiv' && <SearchTeams/>}
                {this.state.active === 'lvdiv' &&
                <LeaveTeam/>}
                {this.state.active === 'newdiv' &&
                <CreateNewTeam/>
                }

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
