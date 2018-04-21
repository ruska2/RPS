import React, { Component } from 'react';
import './TableStyle.css';
import Login from '../auth/Login.js'
import * as ReactDOM from "react-dom";
import axios from 'axios';

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            type: props.type,
            selectedrow:'',
            selectedrowcolor: '',
            alert: 'none'
        }
    };

    static staticProperty = {
        selectedrow: '',
        selectedrowcolor:''
    };

    render() {
        let data;
        if(this.state.type === 1){
            data =this.renderTopTenData();
        }
        else if(this.state.type === 2){
            data = this.renderLastTenData();
        }
        else if(this.state.type === 3){
            data = this.renderTopTeams();
        }
        else if(this.state.type === 4){
            data = this.renderTopTenInYourTeam();
        }else{
            data = this.renderAllTeams();
        }
        return <div id="tablediv" style={this.state.type === 5 ? {width: '65%'}: null}>
            <h3>{this.state.title}</h3>
            <div style={this.state.type === 5 ? {overflow: 'scroll', height: '450px'} : null}>
                <div className='table' style={this.state.type === 5 ? {marginBottom: 0} : null}> {data} </div>
            </div>
            <br/>
            <br/>
            <div className="alert" onClick={this.hideAlert} style={{display: this.state.alert}}>
                <span className="closebtn">&times;</span>
                You have to leave your present team to join new!
            </div>
            {this.state.selectedrow !== '' && <button id='leaving' onClick={this.joinTeam}>Join Team</button>}
        </div>
    };

    renderTopTenData(){
        let rows = [];
        let cells = [];
        ['Number','Name','Score','Team'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#27ae60"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i=0; i<this.props.data.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number" >{i+1}{"."}</div>);
            cells.push(<div className='cell' data-title="Name" >{this.props.data[i].name}</div>);
            cells.push(<div className='cell' data-title="Score" >{this.props.data[i].score}</div>);
            cells.push(<div className='cell' data-title="Team" >{this.props.data[i].team_name}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' :  '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return rows;
    };

    renderLastTenData() {
        let rows = [];
        let cells = [];
        ['Number', 'Winner', 'Loser', 'Score', 'Time'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#2980b9"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i = 0; i < this.props.data.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number">{i + 1}{"."}</div>);
            cells.push(<div className='cell' data-title="Winner" style={{color: '#5A6351'}}>{this.props.data[i].winner}</div>);
            cells.push(<div className='cell' data-title="Loser" style={{color: '#FF0000'}}>{this.props.data[i].loser}</div>);
            const mp = this.getScore(this.props.data[i].winner);
            let scolor;
            if(mp === "+"){
                scolor = '#5A6351'
            }else{
                scolor = '#FF0000';
            }
            console.log(scolor);
            cells.push(<div className='cell' data-title="Score" style={{color: scolor}}>{mp}{this.props.data[i].score}</div>);
            cells.push(<div className='cell' data-title="Time">{this.convertDate(this.props.data[i].time)}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return rows;
    };

    getScore = (winner) =>{
        if(winner === Login.staticProperty.username){
            return "+"
        }else{
            return "-"
        }
    };

    renderTopTeams() {
        let rows = [];
        let cells = [];
        ['Number', 'Name', 'Score'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#F00"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i = 0; i < this.props.data.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number">{i + 1}{"."}</div>);
            cells.push(<div className='cell' data-title="Name">{this.props.data[i].name}</div>);
            cells.push(<div className='cell' data-title="Score">{this.props.data[i].score}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return rows;
    };

    convertDate = (date) =>{
        if(date === null) return "";
        let t = date.split(/[- : T]/);
        return t[0] + '-' + t[1] + '-' + t[2] + " " + t[3] + ':' + t[4];
    };

    renderTopTenInYourTeam = () =>{
        let rows = [];
        let cells = [];
        ['Number', 'Name', 'Score', 'Joined'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#222"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i = 0; i < this.props.data.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number">{i + 1}{"."}</div>);
            cells.push(<div className='cell' data-title="Name">{this.props.data[i].name}</div>);
            cells.push(<div className='cell' data-title="Score">{this.props.data[i].score}</div>);
            cells.push(<div className='cell' data-title="Joined">{this.convertDate(this.props.data[i].joined)}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return rows;
    };

    renderAllTeams = () => {
        if(Table.staticProperty.selectedrow === ''){
            let oldrow = document.getElementById(this.state.selectedrow);
            if (oldrow != null) {
                oldrow.style.backgroundColor = this.state.selectedrowcolor;
            }
            this.state.selectedrowcolor = '';
            this.state.selectedrow = '';
        }
        let data = this.props.data;
        if(this.props.srch !== ''){
            let newdata = [];
            let srch = this.props.srch;
            let index = 0;
            for(let i = 0; i < data.length; i++){
                if((data[i].name).includes(srch)){
                    newdata[index] = data[i];
                    index++;
                }
            }
            data = newdata;
        }
        let rows = [];
        let cells = [];
        ['Number', 'Name', 'Number of memebers'].forEach(function (heading) {
            cells.push(<div className='cell header' style={{background: "#2980b9"}}>{heading}</div>);
        });
        rows.push(<div className='row'>{cells}</div>);

        for (let i = 0; i < data.length; i++) {
            let cells = [];
            cells.push(<div className='cell' data-title="Number">{i + 1}{"."}</div>);
            cells.push(<div className='cell' data-title="Winner">{data[i].name}</div>);
            cells.push(<div className='cell' data-title="Loser">{data[i].number}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div id={data[i].name} className='row' style={{background: color}} onClick={this.clickOnRows}>{cells}</div>);
        }
        return rows;
    };

    clickOnRows = (e) =>{
        if(this.state.selectedrow !== '') {
            let oldrow = document.getElementById(this.state.selectedrow);
            if (oldrow != null) {
                oldrow.style.backgroundColor = this.state.selectedrowcolor;
            }
        }
        let row = ReactDOM.findDOMNode(e.target).parentNode;
        Table.staticProperty.selectedrow = row.id;
        this.setState({
            selectedrowcolor: row.style.backgroundColor,
            selectedrow: row.id
        });
        row.style.backgroundColor = "#27bdf4";
    };

    joinTeam = () => {
        if(Login.staticProperty.team !==''){
            this.setState({
                alert: 'block'
            });
            return;
        }
        let userData = {username: Login.staticProperty.username, teamname: this.state.selectedrow};
        axios.post('/addusertoteam',userData).then( () => {
            window.location.reload();
        });
    }

    hideAlert = () =>{
        this.setState({
            alert: 'none'
        })
    };

}

export default Table;