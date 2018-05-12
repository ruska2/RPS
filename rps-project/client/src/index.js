import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';

axios.post('/getlogged',{msg: 'getlogged'}).then(
    (response) => {
        if(response.data.logged === 'not'){
            ReactDOM.render(<App logged='false'/>, document.getElementById('root'));
        }else{
            ReactDOM.render(<App logged={response.data.logged} score={response.data.score} team = {response.data.team}/>, document.getElementById('root'));
        }
    })
    .catch ((error) => {
        console.log(error)
    });
