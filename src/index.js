import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

var squares = [];

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "unchecked",
            text: "",
            disabled: false,
            className: "square unChecked",
            size: 0,
            font: 0,
        };
        this.timer = null;
        this.windowResized = this.windowResized.bind(this);
        this.updateWindowWidth = this.updateWindowWidth.bind(this);
    }

    componentDidMount() {
        squares.push(this);
        window.addEventListener("resize", this.windowResized);
        this.updateWindowWidth();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.windowResized);
    }

    updateWindowWidth() {
        let _this = this;
        setTimeout(function() {
            let s = Math.ceil(Math.min(window.innerHeight-120, window.innerWidth-320)/_this.props.size);
            _this.setState({
                size: s.toString()+"px",
                font: Math.floor(s*2/3).toString()+"px"
            });
        });
    }

    windowResized() {
        let _this = this;
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.timer = setTimeout(function() {
            _this.updateWindowWidth();
        }, 500);
    }

    toggleFlag() {
        if (this.state.value === "unchecked") {
            this.setState({value: "flagged"});
            this.setState({text: "F"});
        }
        else if (this.state.value === "flagged") {
            this.setState({value: "unchecked"});
            this.setState({text: ""});
        }
    }

    checkSquare() {
        if (this.state.value !== "flagged") {
            if (this.props.mined) {
                document.getElementById("gameStatus").innerHTML = "GAME OVER";
                document.getElementById("gameStatus").classList.add("red");
                this.setState({text: "B", value: "boom", className: "square boom"});
                for (let i = 0; i < squares.length; i++) {
                    squares[i].setState({disabled: true});
                }
            }
            else {
                this.setState({value: "checked", className: "square noBoom"}, () => {
                    let count = this.countNeighbors();

                    if (count > 0) this.setState({text: count});
                    else {
                        for (let i = 0; i < squares.length; i++) {
                            if (Math.abs(squares[i].props.x - this.props.x) <= 1 &&
                                Math.abs(squares[i].props.y - this.props.y) <= 1 &&
                                squares[i].state.value === "unchecked" &&
                                squares[i] !== this
                            ) {
                                squares[i].checkSquare();
                            }
                        }
                    }
                });

                this.checkWin();
            }
        }
    }

    checkWin() {
        let won = true;
        for (let i = 0; i < squares.length; i++) {
            if ((squares[i].props.mined && squares[i].state.value !== "flagged") ||
                (squares[i].props.mined === false && squares[i].state.value === "flagged")) {
                won = false;
                break;
            }
        }
        if (won) {
            document.getElementById("gameStatus").innerHTML = "You won!";
            document.getElementById("gameStatus").classList.add("green");
        }
    }

    countNeighbors() {
        let count = 0
        squares.forEach((square) => {
            if (Math.abs(square.props.x - this.props.x) <= 1 &&
                Math.abs(square.props.y - this.props.y) <= 1 &&
                square.props.mined
            ) count++;
        });

        return count;
    }


    render() {
        return (
            <button className={this.state.className} disabled={this.state.disabled}
                    onClick={() => this.checkSquare()}
                    style={{height: this.state.size, width: this.state.size, fontSize: this.state.font}}
                    onContextMenu={(event) => {
                        this.toggleFlag();
                        event.preventDefault();
                        return false;
                    }}>
                {this.state.text}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(x, y) {
        return <Square x={x} y={y} id={x*y+x} mined={Math.random() >= 0.85}
                       size={this.props.y} />;
    }

    render() {
        const board = [...Array(this.props.y).keys()].map((i) =>
            <tr key={i.toString()} className="board-row">
                {[...Array(this.props.x).keys()].map((j) =>
                    <td key={(i*j+j).toString()}>{this.renderSquare(j, i)}</td>
                )}
            </tr>
        );

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dimensions: 10,
            time: 0,
        };
    }

    updateClock() {
        let _this = this;
        setInterval(function(){_this.setState({time: _this.state.time + 1}); }, 1000);
    }

    componentDidMount() {
        this.updateClock();
    }

    renderBoard(x, y) {
        return <Board x={x} y={y} id={"board"}/>;
    }

    validate() {
        let x = parseInt(document.getElementById("dimensions").value);

        if (isNaN(x) || x < 5 || x > 50) {
            document.getElementById("dimensions").value = "10";
        }
    }

    render() {
        return (
            <div className="game">
                <div className="game-info">
                    <p className="game-status" id="gameStatus">{"Welcome"}</p>
                    <p className="clock" id="clock">{this.state.time}</p>
                    <button className="new-game-button"
                            onClick={() => {
                                console.log(typeof(document.getElementById("dimensions").value));
                                if (document.getElementById("dimensions").value !== "") {
                                    this.setState({dimensions: parseInt(document.getElementById("dimensions").value),
                                    time: 0});
                                }
                                else this.setState({dimensions: 10, time: 0});
                            }}>
                        New Game</button>
                    <form id="dims" className="dims">
                        <label form="dimensions">Select the map's dimensions (5-50):</label><br/>
                        <input id="dimensions" type="text" placeholder={10} onBlur={this.validate}/>
                    </form><br/><br/>
                    <p>Select difficult:</p>
                    <input type="radio" id="easy" defaultChecked={true} name="difficulty" value="easy"/>
                    <label form="easy">Easy</label>
                    <input type="radio" id="medium" name="difficulty" value="medium"/>
                    <label form="easy">Medium</label>
                    <input type="radio" id="hard" name="difficulty" value="hard"/>
                    <label form="easy">Hard</label>

                    <ol>{/* TODO */}</ol>
                </div>
                <div className="game-board" id="gameBoard">
                    {this.renderBoard(this.state.dimensions, this.state.dimensions)}
                </div>
            </div>
        );
    }
}

ReactDOM.render(
  <React.StrictMode>
    <Game id="game"/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
