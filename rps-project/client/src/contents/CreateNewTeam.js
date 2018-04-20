import React, { Component } from 'react';
import Login from '../auth/Login'
import axios from 'axios';

class CreateNewTeam extends Component{

    constructor(props) {
        super(props);
        this.state = {
            alert: 'block',
            teamname: '',
            error:''
        };
    }

    render(){
        return  <div>
            {Login.staticProperty.team !=='' && <div className="alert" style={{display: this.state.alert}}>
                <span className="closebtn" onClick={this.hideAlert}>&times;</span>
                You have to leave your presnt team to create new!
            </div>}
            {Login.staticProperty.team === '' && <div id="teamnameholder">
                <div className='form-group'><label htmlFor="teamname">Name:</label>
                <br/>
                    {this.state.error !== '' && <span className='help-block'>{this.state.error}</span>}
                    <input id={this.state.error !== '' ? 'has-error': 'teamid'} className='form-control' size={30} name='teamname' value={this.state.teamname} type='text' onChange={this.onChange}/></div>
                <br/>
                <div className='form-group'><div id="create" className='btn btn-primary' onClick={this.onSubmit}>Create</div></div>
            </div>}
        </div>
    }

    hideAlert = () =>{
        this.setState({
            alert: 'none'
        })
    };

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
        })
    };

    onSubmit = () => {
        let userData = {name: this.state.teamname};
        axios.post('/getteamexists',userData).then((response) =>{
            if(response.data.succes) {
                this.setState({
                   error: ''
                });
                Login.staticProperty.team = this.state.teamname;
                axios.post('/addteam',{name: Login.staticProperty.username, team: this.state.teamname});
                window.location.reload();
                return;
            }
            this.setState({
                error: response.data.error
            })
        })
    }
}

export default CreateNewTeam;
