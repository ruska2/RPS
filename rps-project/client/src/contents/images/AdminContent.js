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
            userss: [],
            teams: [],
            games: []
        }
    };

    componentWillMount(){
        this.getLogs();
    }

    render() {
        const logins = this.twoColumnTable(this.state.loginlogs, "Logins");
        const logouts = this.twoColumnTable(this.state.logoutlogs, "Logouts");
        const joins = this.threeColumnTable(this.state.joinlogs, "Users joins team");
        const lefts = this.threeColumnTable(this.state.leftlogs, "Users lefts team");
        const create = this.threeColumnTable(this.state.createlogs, "Users created team");
        return (
            <div>
               <GameHeader username={this.state.username}/>
                {this.state.username !== 'admin123' && <div className="alert" onClick={this.hideAlert} style={{display: this.state.alert, margin: '10px'}}>
                    <span className="closebtn">&times;</span>
                    You are not ADMIN!
                </div> }
                {this.state.username === 'admin123' &&
                    <div style={{height: '1300px'}}> {logins} {logouts} {joins} {lefts} {create}</div>
                }
                <div><div style={{textAlign: 'center'}}><h3>BUTTONS</h3></div></div>
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

    handleLogs = (data) => {
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
            createlogs: news
        })
    };

    convertDate = (date) =>{
        if(date === null) return "";
        let t = date.split(/[- : T]/);
        return t[0] + '-' + t[1] + '-' + t[2] + " " + t[3] + ':' + t[4];
    };

    twoColumnTable = (datas,log_type) =>{
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
        return <div style={{float:'left', margin: '20px'}}><h3>{log_type}</h3><div style={{height: '200px', overflow: 'scroll'}}>{rows}</div></div>;
    };

    threeColumnTable = (datas,log_type) =>{
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
            cells.push(<div className='cell' data-title="Score">{this.convertDate(datas[i].time)}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return <div style={{float:'left', margin: '20px', marginLeft: '200px'}}><h3>{log_type}</h3><div style={{height: '200px', float:'left', overflow: 'scroll'}}>{rows}</div></div>;
    }




}

export default AdminContent;