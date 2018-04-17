import React, { Component } from 'react';
import './HeaderStyle.css';
import TitleImage from './images/rpsfunny.png';

class Header extends Component{
    render(){
        return (
            <div id="header">
                <div id='titleimg'>
                    <img  src={TitleImage} alt='title-img'/>
                </div>
            </div>
        )
    }
}

export default Header;