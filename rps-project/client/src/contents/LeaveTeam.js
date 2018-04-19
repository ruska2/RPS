import React, { Component } from 'react';
import Login from '../auth/Login'
import axios from 'axios';

class LeaveTeam extends Component{

    constructor(props) {
        super(props);
        this.state = {
            alert: 'block'
        };
    }

    render(){
        return  <div>
            {Login.staticProperty.team ==='' && <div className="alert" style={{display: this.state.alert}}>
                <span className="closebtn" onClick={this.hideAlert}>&times;</span>
                You are not a member of any team !
            </div>}
            {Login.staticProperty.team !== '' && <div id="leavingdiv"><div>You really want to leave team: {Login.staticProperty.team} ?</div> <button onClick={this.clickLeave} id='leaving'>Yes</button></div>}
        </div>
    }

    hideAlert = () =>{
        this.setState({
            alert: 'none'
        })
    };

    clickLeave = () => {
        this.setState({team: ''});
        Login.staticProperty.team = '';
        let userData = {name: Login.staticProperty.username};
        axios.post('/deleteuserteam',userData);
        window.location.reload();
    }
}

export default LeaveTeam;
