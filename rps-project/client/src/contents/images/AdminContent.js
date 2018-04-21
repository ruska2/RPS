import React, { Component } from 'react';
import GameHeader from "../GameHeader";

class AdminContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: props.username,
        };
    }

    render() {
        return (
            <div>
               <GameHeader username={this.state.username}/>
                {this.state.username !== 'admin123' && <div className="alert" onClick={this.hideAlert} style={{display: this.state.alert, margin: '10px'}}>
                    <span className="closebtn">&times;</span>
                    You are not ADMIN!
                </div> }
                {this.state.username === 'admin123' &&
                    <div> ADMIN CONTENT</div>
                }
            </div>
        );
    }

    hideAlert = () =>{
        this.setState({
            alert: 'none'
        })
    };

}

export default AdminContent;