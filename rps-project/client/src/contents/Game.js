import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import Login from "../auth/Login";

class Game extends Component{

    constructor(props) {
        super(props);
        this.state = {
            button: 'Join Game',
            socket: null,
            mypoints: null,
            pos: null,
            enemypoints: null,
            map: null,
            move: null
        };
    }

    static staticProperty = {
        mode: 0,
        selectd: null
    };


    render(){
        return <div id = "gameholder">
            <div id="game">
                {this.state.map != null && this.state.map}
            </div>
                <div id="joinLeave">
                    <div id = 'joinLeaveBtn' onClick={this.onJoin}>
                        {this.state.button}
                    </div>
            </div>
        </div>

    }

    onJoin = () => {
        if(this.state.button === "Join Game"){
            const s = openSocket('http://localhost:4000');
            s.emit('login',Login.staticProperty.username);
            this.setState({
                button: "Leave Game",
                socket: s
            });
            document.body.style.cursor = "wait";
            this.listener(s);
        }else{
            this.state.socket.emit('logout',Login.staticProperty.username);
            this.setState({
                button: "Join Game",
                socket: null
            });
            document.body.style.cursor = "auto";
        }
    };

    listener = (socket) => {
      socket.on('init', move =>{
          this.drawMap(move);
          document.body.style.cursor = "auto";
      });
      socket.on('lose', move =>{
          this.setState({
              mypoints: null,
              pos: null,
              enemypoints: null,
              map: null,
              move: null
          });
      });
      socket.on('win', move =>{
            alert(move);
            this.setState({
                button: "Join Game",
                mypoints: null,
                pos: null,
                enemypoints: null,
                map: null,
                move: null
            });
            document.body.style.cursor = "auto"
      })

    };

    drawMap = (init) => {
        console.log(init);
        let mypoints = [];
        let enemypoints = [];
        let pos;
        if(init.user1 === Login.staticProperty.username){
            mypoints = init.user1points;
            enemypoints = init.user2points;
            pos = "down";
        }else{
            mypoints = init.user2points;
            enemypoints = init.user1points;
            pos = " up";
        }
        const spots = this.draw(mypoints,enemypoints);
        this.setState({
            mypoints: mypoints,
            pos: pos,
            enemypoints: enemypoints,
            map: spots,
            move: init.move
        });

    };

    draw = (mypoints,enemypoints) =>{
        let spots = [];
        for(let i = 0; i < 7; i++){
            let row = [];
            for(let j =0; j < 5; j++){
                let type = "noone";
                for(let ind = 0; ind < mypoints.length; ind++){
                    if(i === mypoints[ind][0] && j === mypoints[ind][1]){
                        type = this.switcher2(mypoints[ind][2]);
                    }
                }

                for(let ind = 0; ind < enemypoints.length; ind++){
                    if(i === enemypoints[ind][0] && j === enemypoints[ind][1]){
                        type = "enemy";
                    }
                }

                const spot = <div id={type} className={"spot " +i+ " "+ j} onClick={this.click}></div>;
                row.push(spot);
            }
            spots.push(row);
        }
        return spots;
    };


    switcher2 = (n) =>{
        let id = "";
        if(n === 1){
            id="merock";
        }
        else if( n === 2){
            id ="mepaper";
        }else{
            id = "mescis";
        }
        return id;
    };

    click = (e) =>{
        if(this.state.move === Login.staticProperty.username){
            const elem = e.target;
            if(Game.staticProperty.mode === 0){
                Game.staticProperty.selectd = elem;
                if(elem.id.includes("me")){
                    // HIGHLIGHT POSIBLE MOVES
                    const divs = this.checkPosibleMoves(elem);
                    Game.staticProperty.mode = 1;
                    for(let i = 0; i < divs.length; i++){
                        const alldivs = document.getElementsByClassName("spot");
                        for(let j =0; j < alldivs.length; j++){

                            if(alldivs[j].className === divs[i].props.className){
                                console.log(alldivs[j].className, divs[i].props.className);
                                alldivs[j].style.backgroundColor = "red";
                            }
                        }
                    }
                }
            }
            else if(Game.staticProperty.mode === 1){
                const divs = document.getElementsByClassName("spot");
                for(let i =0; i < divs.length; i++){
                    divs[i].style.backgroundColor = "#58B325";
                }
                Game.staticProperty.mode = 0;

                const alloweddivs = this.checkPosibleMoves(Game.staticProperty.selectd);

                for(let i = 0; i < alloweddivs.length; i++){
                    if(alloweddivs[i].props.className === elem.className){
                        this.sendMove(Game.staticProperty.selectd,elem);
                        Game.staticProperty.selectd = null;
                        return;
                    }
                }

            }

        }


    };
    
    checkPosibleMoves = (elem) => {
        let split = elem.className.split(' ');
        let i = parseInt(split[1]);
        let j = parseInt(split[2]);
        console.log("element:" + i +" " + j);
        //console.log(this.state.map);
        let map = this.state.map;
        let left = null;
        let right = null;
        let top = null;
        let bottom = null;
        if(j-1 > -1){
            left = map[i][j-1];
        }
        if(j+1 < map[i].length){
            right = map[i][j+1];
        }
        if(i+1 < map.length){
            bottom = map[i+1][j];
        }
        if(i-1 > -1) {
            top = map[i - 1][j];
        }

        let goods = [];
        if(top != null && !top.props.id.includes("me")) goods.push(top);
        if(bottom != null && !bottom.props.id.includes("me")) goods.push(bottom);
        if(left != null && !left.props.id.includes("me")) goods.push(left);
        if(right != null && !right.props.id.includes("me")) goods.push(right);
        console.log(goods);
        return goods;
    };

    sendMove = (oldpos,newpos) =>
    {
        let move = [Login.staticProperty.username,oldpos.className, newpos.className];
        console.log(oldpos,newpos);
        this.state.socket.emit('move', move);
    }
}

export default Game;