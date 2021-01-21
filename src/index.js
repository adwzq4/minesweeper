import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import reportWebVitals from './reportWebVitals';

class Square extends React.Component {
    render() {
        return (
            <button className={this.props.className}
                    disabled={this.props.disabled}
                    onClick={this.props.checkSquare}
                    style={
                        {height: this.props.size,
                        width: this.props.size,
                        fontSize: this.props.font}
                    }
                    onContextMenu={(event) => {
                        this.props.toggleFlag(this.props.x, this.props.y);
                        event.preventDefault();
                        return false;
                    }}>
                {this.props.text}
            </button>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            size: 0,
            font: 0,
        };
        this.timer = null;
        this.windowResized = this.windowResized.bind(this);
        this.updateWindowWidth = this.updateWindowWidth.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.windowResized);
        this.updateWindowWidth();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.windowResized);
    }

    updateWindowWidth() {
        let _this = this;
        let s = Math.ceil(Math.min(window.innerHeight-100, window.innerWidth-300)/_this.props.dimensions);
        _this.setState({
            size: s.toString()+"px",
            font: Math.floor(s*2/3).toString()+"px"
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

    renderSquare(x, y) {
        return <Square className={this.props.squares[y][x].className}
                       font={this.state.font}
                       checkSquare={() => this.props.checkSquare(x, y)}
                       toggleFlag={() => this.props.toggleFlag(x, y)}
                       text={this.props.squares[y][x].text}
                       size={this.state.size}
                       disabled={this.props.squares[y][x].disabled}
                       x={x} y={y}/>;
    }

    render() {
        let s = Math.ceil(Math.min(window.innerHeight-100, window.innerWidth-300)/this.props.dimensions);
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.size = s.toString()+"px";
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
            squares: this.newMap(10),
            dimensions: 10,
            time: 0,
            difficulty: 15,
        };
        this.timer = this.startClock();
    }

    updateClock() {
        this.setState({time: this.state.time + 1});
    }

    startClock() {
        clearInterval(this.timer);
        this.setState({time: 0});
        let _this = this;
        return setInterval(function() {_this.updateClock();}, 1000);
    }

    newMap(n) {
        let squares = [];
        for (let i = 0; i < n; i++) {
            squares.push([]);
            for (let j = 0; j < n; j++) {
                squares[i].push({
                    value: "unchecked",
                    mined: Math.random() >= 0.85,
                    text: "",
                    disabled: false,
                    className: "square unChecked",
                });
            }
        }

        return squares;
    }

    validate() {
        let x = parseInt(document.getElementById("dimensions").value);

        if (isNaN(x) || x < 5 || x > 50) {
            document.getElementById("dimensions").value = "10";
        }
    }

    toggleFlag(x, y) {
        let squares = this.state.squares;
        if (this.state.squares[y][x].value === "unchecked") {
            squares[y][x].value = "flagged";
            squares[y][x].text = "F";
        }
        else if (this.state.squares[y][x].value === "flagged") {
            squares[y][x].value = "unchecked";
            squares[y][x].text = "";
        }
        this.setState({squares: squares});
    }

    checkSquare(x, y) {
        if (this.state.squares[y][x].value !== "flagged") {
            let squares = this.state.squares;
            if (this.state.squares[y][x].mined) {
                document.getElementById("gameStatus").innerHTML = "GAME OVER";
                document.getElementById("gameStatus").classList.add("red");
                clearInterval(this.timer);

                squares[y][x].text = "B";
                squares[y][x].value = "boom";
                squares[y][x].className = "square boom";
                for (let i = 0; i < this.state.dimensions; i++) {
                    for (let j = 0; j < this.state.dimensions; j++) {
                        squares[i][j].disabled = true;
                    }
                }
                this.setState({squares: squares});
            }

            else {
                let count = this.countNeighbors(x, y);

                squares[y][x].value = "checked";
                squares[y][x].className = "square noBoom";

                if (count > 0) {
                    squares[y][x].text = count;
                    this.setState({squares: squares});
                }
                else {
                    this.setState({squares: squares}, () => {
                        for (let i = 0; i < this.state.dimensions; i++) {
                            for (let j = 0; j < this.state.dimensions; j++) {
                                if (Math.abs(j - x) <= 1 &&
                                    Math.abs(i - y) <= 1 &&
                                    this.state.squares[i][j].value === "unchecked" &&
                                    !(x === j && y === i)
                                ) {
                                    this.checkSquare(j, i);
                                }
                            }
                        }
                    });
                }

                this.checkWin();
            }
        }
    }

    checkWin() {
        let won = true;
        for (let i = 0; i < this.state.dimensions; i++) {
            for (let j = 0; j < this.state.dimensions; j++) {
                if ((this.state.squares[i][j].mined && this.state.squares[i][j].value !== "flagged") ||
                     this.state.squares[i][j].value === "unchecked" ||
                    (this.state.squares[i][j].mined === false && this.state.squares[i][j].value === "flagged")) {
                    won = false;
                    break;
                }
            }
        }

        if (won) {
            document.getElementById("gameStatus").innerHTML = "You won!";
            document.getElementById("gameStatus").classList.add("green");
            clearInterval(this.timer);
        }
    }

    countNeighbors(x, y) {
        let count = 0;
        for (let i = 0; i < this.state.dimensions; i++) {
            for (let j = 0; j < this.state.dimensions; j++) {
                if (Math.abs(j - x) <= 1 &&
                    Math.abs(i - y) <= 1 &&
                    this.state.squares[i][j].mined
                ) count++;
            }
        }

        return count;
    }

    renderBoard(x, y) {
        return <Board x={x} y={y}
                      dimensions={this.state.dimensions}
                      squares={this.state.squares}
                      checkSquare={(j, i) => this.checkSquare(j, i)}
                      toggleFlag={(j, i) => this.toggleFlag(j, i)}/>;
    }

    render() {
        return (
            <div className="game">
                <div className="game-info">
                    <p className="game-status" id="gameStatus">{"Welcome to Minesweeper"}</p>
                    <p className="clock" id="clock">{this.state.time}</p>
                    <button className="new-game-button"
                            onClick={() => {
                                document.getElementById("gameStatus").innerHTML = "Welcome to Minesweeper";
                                document.getElementById("gameStatus").classList.remove("green", "red");
                                let diff = parseInt(document.querySelector('input[name="difficulty"]:checked').value);
                                let dim = 10;
                                if (document.getElementById("dimensions").value !== "") {
                                    dim = parseInt(document.getElementById("dimensions").value);
                                }
                                this.setState({dimensions: dim, time: 0, difficulty: diff, squares: this.newMap(dim)});
                                this.startClock();
                            }}>
                        New Game</button>
                    <form id="dims" className="dims">
                        <label form="dimensions">Select the map's dimensions (5-50):</label><br/>
                        <input id="dimensions" type="text" placeholder={10} onBlur={this.validate}/>
                    </form><br/><br/>
                    <p>Select difficult:</p>
                    <input type="radio" id="easy" defaultChecked={true} name="difficulty" value="15"/>
                    <label form="easy">Easy</label>
                    <input type="radio" id="medium" name="difficulty" value="25"/>
                    <label form="easy">Medium</label>
                    <input type="radio" id="hard" name="difficulty" value="35"/>
                    <label form="easy">Hard</label>
                    <ol>{}</ol>
                </div>
                <div className="game-board" id="gameBoard"
                    style={{right: (window.innerWidth-220-Math.min(window.innerHeight-100, window.innerWidth-280))/2,
                            top: (window.innerHeight-Math.min(window.innerHeight-100, window.innerWidth-280))/2}}>
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

// If you want to start measuring performance in your app, pass a function to log results
// (e.g. reportWebVitals(console.log)) or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
