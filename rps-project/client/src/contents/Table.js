import React, { Component } from 'react';
import './TableStyle.css';
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

}

export default Table;