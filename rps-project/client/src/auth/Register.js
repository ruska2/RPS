import React, { Component } from 'react';
import './register.css';
import Link from "react-router-dom/es/Link";
import About from "../contents/About";
import Header from "../Header";
import axios from "axios/index";
import isEmpty from 'lodash/isEmpty';
import ReactDOM from "react-dom";
import App from "../App";

class Register extends Component{

    constructor(props) {
        super(props);
        this.state = {
            username:'',
            password: '',
            confpassword: '',
            email: '',
            errors: {},
            disabled: true
        };
    }

    static staticProperty = {
        msg:''
    };

    render(){
        return(
            <div>
                <Header/>
                <About/>
            <div id='register'>

            <h2>Register</h2>
            <form name="form" onSubmit={this.onSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    {this.state.errors.username && <span className='help-block'>{this.state.errors.username}</span>}
                    <input id={this.state.errors.username ? 'has-error' : 'username'} type="text" className="form-control" name="username" value={this.state.username} onChange={this.onChange}/>
                </div>
                <div className='form-group'>
                    <label htmlFor="password">Password</label>
                    {this.state.errors.password && <span className='help-block'>{this.state.errors.password}</span>}
                    <input id={this.state.errors.password ? 'has-error' : 'password'} type="password" className="form-control" name="password" value={this.state.password} onChange={this.onChange}/>
                </div>
                <div className='form-group'>
                    <label htmlFor="confpassword">Password</label>
                    {this.state.errors.confpassword && <span className='help-block'>{this.state.errors.confpassword}</span>}
                    <input id={this.state.errors.confpassword ? 'has-error' : 'confpassword'} type="password" className="form-control" name="confpassword" value={this.state.confpassword} onChange={this.onChange}/>
                </div>
                <div className='form-group'>
                    <label htmlFor="email">Email adress</label>
                    {this.state.errors.email && <span className='help-block'>{this.state.errors.email}</span>}
                    <input id={this.state.errors.email ? 'has-error' : 'email'} type="text" className="form-control" name="email"  value={this.state.email} onChange={this.onChange}/>
                    <br/>
                </div>
                <div className="form-group">
                    <button className="btn btn-primary">Register</button>
                    <Link to='/login' id='cancel' className="btn btn-link">Cancel</Link>
                </div>
            </form>
            </div>
            </div>
        )
    }

    onChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value,
        });
        let localerrors = this.state.errors;
        switch (e.target.name){
            case('username'):
                if(e.target.value.length < 5){
                    localerrors[e.target.name] = 'Too short username!'
                }else{
                    delete localerrors[e.target.name];
                }
                break;
            case('password'):
                if(e.target.value.length < 8){
                    localerrors[e.target.name] = 'Too short password!'
                }
                else{
                    delete localerrors[e.target.name];
                }
                if(e.target.value === this.state.confpassword){
                    delete localerrors['confpassword'];
                }else{
                    localerrors['confpassword'] = "Passwords does not match!";
                }
                break;
            case('confpassword'):
                if(e.target.value !== this.state.password){
                    localerrors[e.target.name] = 'Passwords does not match!'
                }
                else{
                    delete localerrors[e.target.name];
                }
                break;
            case('email'):
                if(!e.target.value.includes('@')){
                    localerrors[e.target.name] = "Format is not correct!";
                }else{
                    delete localerrors[e.target.name];
                }
                break;
            default:
                break;
        }
        this.setState({
            errors: localerrors
        });
    };

    onSubmit = (e) =>{
        e.preventDefault();
        if(!isEmpty(this.state.errors)){
            return;
        }
        this.setState({errors: {}});
        this.userSignupRequest(this.state).then(
            (response) => {
                this.setState({
                    errors: response.data,
                });
                if(this.state.errors.success === true){
                    let msg = this.state.errors.msg;
                    Register.staticProperty.msg = msg;
                    this.props.history.push('/login');
                }
            })
            .catch ((error) => {
                console.log(error)
            });
    };

    userSignupRequest = (userData) =>{
        return axios.post('/register',userData);
    }
}

export default Register;