import React, { Component } from 'react';
import axios from 'axios';
import Table from "./Table";
import Login from "../auth/Login";

class SearchTeams extends Component{

    constructor(props) {
        super(props);
        this.state = {
            alert: 'block',
            teams:{},
            inputsrch: '',
        };
    }

    componentWillMount(){
        this.getTeams();
    }
    render(){
        return <div>
                     <div style={{paddingTop: '20px'}}>
                        <input className='form-search-control' id="srchinput" type="text" value={this.state.inputsrch} name="inputsrch" placeholder="Search.." onChange={this.changeInput}/>
                        <Table data={this.state.teams} title={'Teams:'} type={5} srch={this.state.inputsrch}/>
                    </div>
        </div>
    }

    getTeams = () => {
        axios.post('/getteams').then( (response) => {
            this.setState({
                teams: response.data.teams,
            })
        })
    };

    changeInput = (e) =>{
        Table.staticProperty.selectedrow = '';
        this.setState({
            [e.target.name]: e.target.value
        });
    }
}

export default SearchTeams;