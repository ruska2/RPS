import React, { Component } from 'react';
import './TableStyle.css';
import Login from '../auth/Login.js'

class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            type: props.type
        }
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
        return <div id="tablediv">
            <h3>{this.state.title}</h3>
            <div className='table'> {data} </div>
        </div>
    }

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
    }

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
            cells.push(<div className='cell' data-title="Time">{this.props.data[i].time}</div>);
            let color = i % 2 === 0 ? '#e9e9e9' : '#f6f6f6';
            rows.push(<div className='row' style={{background: color}}>{cells}</div>);
        }
        return rows;
    }

    getScore(winner){
        if(winner === Login.staticProperty.username){
            return "+"
        }else{
            return "-"
        }
    }

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
    }

}

export default Table;