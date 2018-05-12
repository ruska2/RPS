import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import Login from "../auth/Login";
import Rock from "../images/rock.png";
import Paper from "../images/paper.png";
import Scissors from "../images/scissor.png";

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
            move: null,
            chose: null
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
            <div id="turn">{this.state.move !== null && this.state.move === Login.staticProperty.username && "Your turn!"}
                            {this.state.move !== null && this.state.move !== Login.staticProperty.username && "Enemy turn!"}</div>
            <div id="joinLeave">
                    <div id = 'joinLeaveBtn' onClick={this.onJoin}>
                        {this.state.button}
                    </div>
            </div>

            {this.state.chose !== null && <div id = "chose">
                <img id="rock" src={Rock} alt="rock" onClick={this.clickImg}/>
                <img id="paper" src={Paper} alt="paper" onClick={this.clickImg}/>
                <img id="scissors" src={Scissors} alt="scissors" onClick={this.clickImg}/>
            </div>}
        </div>

    }

    clickImg = (e) =>{

            if(this.state.chose[0] === Login.staticProperty.username){
                let changei = this.state.chose[2];
                let changej = this.state.chose[3];
                if(this.state.chose[1].user1 === Login.staticProperty.username){
                    //change user1points to new;
                    let p = this.state.chose[1].user1points;
                    for(let i = 0; i < p.length; i++){
                        if(p[i][0] === changei && p[i][1] === changej){
                            p[i][2] = this.getValue(e.target.id);
                        }
                    }
                    this.state.chose[1].user1points = p;
                }else{
                    let p = this.state.chose[1].user2points;
                    for(let i = 0; i < p.length; i++){
                        if(p[i][0] === changei && p[i][1] === changej){
                            p[i][2] = this.getValue(e.target.id);
                        }
                    }
                    this.state.chose[1].user2points = p;
                }
            }else{
                let changei = this.state.chose[4];
                let changej = this.state.chose[5];
                if(this.state.chose[1].user1 === Login.staticProperty.username){
                    //change user1points to new;
                    let p = this.state.chose[1].user1points;
                    for(let i = 0; i < p.length; i++){
                        if(p[i][0] === changei && p[i][1] === changej){
                            p[i][2] = this.getValue(e.target.id);
                        }
                    }
                    this.state.chose[1].user1points = p;
                }else{
                    let p = this.state.chose[1].user2points;
                    for(let i = 0; i < p.length; i++){
                        if(p[i][0] === changei && p[i][1] === changej){
                            p[i][2] = this.getValue(e.target.id);
                        }
                    }
                    this.state.chose[1].user2points = p;
                }
            }
            let x = this.state.chose;
            x.push(Login.staticProperty.username);
            this.state.socket.emit('chose',x);

        this.setState({
            chose: null
        })
    };

    getValue = (value) =>{
        console.log(value);
      if(value === "rock") return 1;
      if(value === "paper") return 2;
      if(value === "scissors") return 0;
    };

    onJoin = () => {
        if(this.state.button === "Join Game"){
            const s = openSocket('http://192.168.43.188:4000');
            s.emit('login',Login.staticProperty.username);
            this.setState({
                button: "Leave Game",
                socket: s
            });
            document.body.style.cursor = "wait";
            let as = document.getElementsByTagName("a");
            for(let i = 0; i < as.length; i++){
                as[i].style.pointerEvents = "none";
            }
            this.listener(s);
        }else{
            this.state.socket.emit('logout',Login.staticProperty.username);
            this.setState({
                button: "Join Game",
                socket: null,
                chose: null
            });
            let as = document.getElementsByTagName("a");
            for(let i = 0; i < as.length; i++){
                as[i].style.pointerEvents = "all";
            }
            document.body.style.cursor = "auto";

        }
    };

    listener = (socket) => {
      socket.on('init', move =>{
          this.drawMap(move);
          document.body.style.cursor = "auto";
          let as = document.getElementsByTagName("a");
          for(let i = 0; i < as.length; i++){
              as[i].style.pointerEvents = "none";
          }
      });
      socket.on('lose', move =>{
          this.setState({
              mypoints: null,
              pos: null,
              enemypoints: null,
              map: null,
              move: null,
              button: "Join Game"
          });

          document.body.style.cursor = "auto";
          let as = document.getElementsByTagName("a");
          for(let i = 0; i < as.length; i++){
              as[i].style.pointerEvents = "all";
          }
          alert(move);
          window.location.reload();
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
              let as = document.getElementsByTagName("a");
              for(let i = 0; i < as.length; i++){
                  as[i].style.pointerEvents = "all";
              }
            document.body.style.cursor = "auto";
            window.location.reload();
      });
      socket.on('chose', data => {
          this.setState({
              chose: data
          })
      });

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
                        if(enemypoints[ind][3] === 1){
                            let n = enemypoints[ind][2];
                            if(n === 1){
                                type="enemyrock";
                            }
                            else if( n === 2){
                                type ="enemypaper";
                            }else{
                                type = "enemyscis";
                            }
                        }
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
        //console.log("element:" + i +" " + j);
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
        //console.log(goods);
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