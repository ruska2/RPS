import React, { Component } from 'react';
import './AboutStyle.css';
class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            downclicked: false,
            height: '0px',
            iclassname: 'arrow down',
            textdisplay: 'none'
        };
       // this.clickDown = this.clickDown.bind(this);
    }

    render() {
        return (
              <div id="aboutcontainer">
                    <div id="about"  onClick={this.clickDown}>
                        About
                    </div>
                    <div id='downdiv'  style={{height: this.state.height}}>
                        <i onClick={this.clickDown} className={this.state.iclassname}/>
                        <div id="abouttext" style={{display: this.state.textdisplay}}>
                            <p className='text-center'><strong>ROCK PAPER SCISSORS - MULTIPLAYER</strong> </p>
                            <hr/>
                            <p>Everyone knows old game rock paper scissors.
                                Is a hand game usually played between two people in which each player simultaneously forms one of three shapes with an outstretched hand.
                                These shapes are "rock" , "paper" and "scissors".
                                The first known mention of the game was in the book Wuzazu (zh) by the Chinese Ming-dynasty writer Xie Zhaozhi (zh) (fl. c. 1600),
                                who wrote that the game dated back to the time of the Chinese Han dynasty (206 BC – 220 AD).
                            </p>
                            <p>
                                In this game you can play against another players online. Game is something like a chess, with simplier rules and less types of puppets.
                                So it's a table game where you can control your puppets, enemy can control his puppets. Each pupet is holding one from rock, scissors, papers.
                                When puppet wants to take place where another pupet is standing, the puppet with less value, based on holding and RPS rules, will be knocked out and the winner
                                puppet will take his place. Winner is, who can knock out one specific puppet from enemy puppets called "king", but he actually can't see which puppet it is.
                            </p>
                            <p>
                                Game was inspired by old ICQ game Rock Scissor Paper. For playing you have to Register if you are not registred or Login if yes.
                            </p>
                        </div>
                    </div>
                </div>

        );
    }

    clickDown = () =>{

        if(this.state.downclicked === false){
            this.setState({
                downclicked: true,
                iclassname: 'arrow up',
                height: '100%',
                textdisplay: 'block'
            });
        }else{
            this.setState({
                downclicked: false,
                iclassname: 'arrow down',
                height: '0%',
                textdisplay: 'none'
            });
        }
    }
}

export default About;