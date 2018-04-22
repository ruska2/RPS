import React, { Component } from 'react';
import GameHeader from "../GameHeader";
import axios from 'axios';

class AdminContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
            loginlogs: [],
            logoutlogs: [],
            joinlogs: [],
            leftlogs: [],
            createlogs: [],
            users: [],
            teams: [],
            games: [],
            errors: {},
            deleteuser: '',
            deleteteam: ''
        }
    };

    componentWillMount(){
        this.getLogs();
    }

    render() {
        const logins = this.threeColumnTable(this.state.loginlogs, "Logins");
        const logouts = this.threeColumnTable(this.state.logoutlogs, "Logouts");
        const joins = this.fourColumnTable(this.state.joinlogs, "Users joins team");
        const lefts = this.fourColumnTable(this.state.leftlogs, "Users lefts team");
        const create = this.fourColumnTable(this.state.createlogs, "Users created team");
        const users = this.twoColumnTable(this.state.users, "Users");
        const teams = this.twoColumnTable(this.state.teams, "Teams");
        const games = this.fiveColumnTable(this.state.games, "Games");
        return (
            <div>
               <GameHeader username={this.state.username}/>
                {this.state.username !== 'admin123' && <div className="alert" onClick={this.hideAlert} style={{display: this.state.alert, margin: '10px'}}>
                    <span className="closebtn">&times;</span>
                    You are not ADMIN!
                </div> }
                {this.state.username === 'admin123' &&
                <div> {logins} {logouts} {joins} {lefts} {create}{users} {teams} {games} </div>
                }
                <div><div style={{textAlign: 'center', margin: 'auto'}}>
                    <div className='form-group' style={{width: '25%', margin: 'auto'}}>
                        <label style={{marginTop: '40px'}} htmlFor="delete-user">Delete users/teams</label>
                        {this.state.errors.deleteuser && <span className='help-block'>{this.state.errors.deleteuser}</span>}
                        <input id={this.state.errors.deleteuser ? 'has-error' : 'delete-user'} name='deleteuser' className="form-control" type='text' size='30' placeholder='User name..'  onChange={this.onChange}/>
                        <input className='btn btn-primary' id='deleteuser' type='submit' onClick={this.clickDeleteUser} value='Delete user'/>
                    </div>
                    <div className='form-group' style={{width: '25%', margin: 'auto'}}>
                        {this.state.errors.deleteteam && <span className='help-block'>{this.state.errors.deleteteam}</span>}
                        <input id={this.state.errors.deleteteam ? 'has-error' : 'delete-team'} name='deleteteam' className="form-control" type='text' size='30' placeholder='Team name..' onChange={this.onChange}/>
                        <input className='btn btn-primary' id='deleteteam' type='submit'  onClick={this.clickDeleteTeam} value='Delete team'/>
                    </div>
                </div></div>
            </div>
        );
    }

    hideAlert = () =>{
        this.setState({
            alert: 'none'
        })
    };

    getLogs = () => {
        axios.post('/getlogs', {}).then((response) => {
            this.handleLogs(response.data);
            }
        )
    };

    handleLogs = (serverdata) => {
        let data = serverdata[0];
        const logins = [];
        const logouts = [];
        const joins = [];
        const lefts = [];
        const news = [];
        for(let i = 0; i < data.length; i++){
            switch (data[i].type){
                case ('LOGIN'):
                    logins.push(data[i]);
                    break;
                case('LOGOUT'):
                    logouts.push(data[i]);
                    break;
                case('TEAM_JOIN'):
                    joins.push(data[i]);
                    break;
                case('TEAM_LEFT'):
                    lefts.push(data[i]);
                    break;
                case('CREATED_TEAM'):
                    news.push(data[i]);
                    break;
            }
        }

        this.setState({
            loginlogs: logins,
            logoutlogs: logouts,
            joinlogs: joins,
            leftlogs: lefts,
            createlogs: news,
            users: serverdata[1],
            teams: serverdata[2],
            games: serverdata[3]
        })
    };

    convertDate = (date) =>{
        if(date === null) return "";
        let t = date.split(/[- : T]/);
        return t[0] + '-' + t[1] + '-' + t[2] + " " + t[3] + ':' + t[4];
    };

    threeColumnTable = (datas,log_type) =>{
        let rows = [];
        let cells = [];
        ['Number', 'Name', 'Time'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#2980b9"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i = 0; i < datas.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number">{i + 1}{"."}</div>);
            cells.push(<div className='cell' data-title="Name">{datas[i].username}</div>);
            cells.push(<div className='cell' data-title="Score">{this.convertDate(datas[i].time)}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return <div style={{float:'left', margin: '20px'}}><h3>{log_type}</h3><div style={{height: '200px', overflow: 'scroll', boxShadow: '1px 1px #888888'}}>{rows}</div></div>;
    };

    fourColumnTable = (datas,log_type) =>{
        let rows = [];
        let cells = [];
        ['Number', 'User name','Team name', 'Time'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#2980b9"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i = 0; i < datas.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number">{i + 1}{"."}</div>);
            cells.push(<div className='cell' data-title="Name">{datas[i].username}</div>);
            cells.push(<div className='cell' data-title="Name">{datas[i].team_name}</div>);
            cells.push(<div className='cell' data-title="Time">{this.convertDate(datas[i].time)}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return <div id='threecolumntable' style={{float:'left'}}><h3>{log_type}</h3><div style={{height: '200px', float:'left', overflow: 'scroll', boxShadow: '1px 1px #888888'}}>{rows}</div></div>;
    };

    twoColumnTable = (datas,log_type) =>{
        let rows = [];
        let cells = [];
        ['Number', 'User name'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#A00"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i = 0; i < datas.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number">{i + 1}{"."}</div>);
            cells.push(<div className='cell' data-title="Name">{datas[i].name}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return <div id='twocolumntable' style={{float:'left'}}><h3>{log_type}</h3><div style={{height: '200px', float:'left', overflow: 'scroll', boxShadow: '1px 1px #888888'}}>{rows}</div></div>;
    };

    fiveColumnTable = (datas,log_type) =>{
        let rows = [];
        let cells = [];
        ['Number', 'Winner name','Lose name','Score', 'Time'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#005500"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i = 0; i < datas.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number">{i + 1}{"."}</div>);
            cells.push(<div className='cell' data-title="Name">{datas[i].winner}</div>);
            cells.push(<div className='cell' data-title="Name">{datas[i].loser}</div>);
            cells.push(<div className='cell' data-title="Score">{datas[i].score}</div>);
            cells.push(<div className='cell' data-title="Time">{this.convertDate(datas[i].time)}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return <div id='fivecolumntable' style={{float:'left'}}><h3>{log_type}</h3><div style={{height: '200px', float:'left', overflow: 'scroll', boxShadow: '1px 1px #888888'}}>{rows}</div></div>;
    };

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
        })
    };

    clickDeleteUser = (e) => {
        axios.post('/deleteuser',{name: this.state.deleteuser}).then( (response) =>{
            this.setState({
                errors: response.data.errors,
            });
            console.log(this.state.errors);
            if(this.state.errors.succes === true){
                window.location.reload();
            }
        });
    };

    clickDeleteTeam = (e) => {
        axios.post('/deleteteam',{name: this.state.deleteteam}).then( (response) =>{
            this.setState({
                errors: response.data.errors,
            });
            console.log(this.state.errors);
            if(this.state.errors.succes === true){
                window.location.reload();
            }
        });
    }



}

export default AdminContent;