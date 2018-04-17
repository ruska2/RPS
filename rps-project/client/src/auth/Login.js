import React, { Component } from 'react';
import './login.css';
import Link from "react-router-dom/es/Link";
import axios from 'axios';
import PropTypes from 'prop-types';
import About from "../contents/About";
import Header from "../Header";
import Register from "./Register";


class Login extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username:'',
            password: '',
            errors: {}
        };
    }

    static staticProperty = {
        username: '',
        score: null,
        team: '',
    };

    render(){
        return <div>
            <Header/>
            <About/>
            <div id='login'>
                {Register.staticProperty.msg !== '' ? <div id="regmsg">{Register.staticProperty.msg}</div> : null}
            <h2>Login</h2>
            <form onSubmit={this.onSubmit}>
                <label htmlFor="username">Username</label>
                <br/>
                {this.state.errors.username && <span className='help-block'>{this.state.errors.username}</span>}
                <input id={this.state.errors.username ? 'has-error' : 'username'} className="form-control" type='text' size='30' name = 'username' value={this.state.username} onChange={this.onChange}/>
                <br/>
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    <br/>
                    {this.state.errors.password && <span className='help-block'>{this.state.errors.password}</span>}
                    <input id={this.state.errors.password ? 'has-error' : 'password'} name='password' className="form-control" type='password' size='30' value={this.state.password} onChange={this.onChange}/>
                    <br/>
                </div>
                <div className='form-group'>
                    <input className='btn btn-primary' id='Login' type='submit' value='Login'/>
                    <Link to='/register' id="reg" className='btn btn-link'>Register</Link>
                </div>
            </form>
        </div>
        </div>
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
        })
    };

    onSubmit = (e) =>{
        console.log(this.state.errors);
        this.setState({errors: {}});
        e.preventDefault();
        this.userSigninRequest(this.state).then(
            (response) => {
                this.setState({errors: response.data});
                if(this.state.errors.success === true){
                    Login.staticProperty.username = this.state.errors.username;
                    Login.staticProperty.score = this.state.errors.score;
                    Login.staticProperty.team = this.state.errors.team;
                    console.log(this.state.errors);
                    this.props.history.push('/game');
                }
            })
        .catch ((error) => {
            console.log(error)
        });
    };

    userSigninRequest = (userData) => {
        return axios.post('/login',userData);
    }
}



Login.contextTypes = {
    router: PropTypes.object
};

export default Login;
