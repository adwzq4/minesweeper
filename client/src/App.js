import './css/App.css';
import React from "react";
import {BrowserRouter as Router, Link, Route } from 'react-router-dom'
import {BsFlagFill} from "react-icons/bs";
import {GiUnlitBomb} from "react-icons/gi";
import HighScores from "./components/HighScores";
import api from './api'

function App() {
  return (
      <Router>
          <Route path="/" exact component={Game} />
          <Route path="/high-scores" exact component={HighScores} />
      </Router>
  );
}

function Square(props) {
  return (
      <button className={props.className}
              disabled={props.disabled}
              onClick={props.checkSquare}
              style={{
                height: props.size,
                width: props.size,
                fontSize: props.font,
                lineHeight: 0.95
              }}
              onContextMenu={(event) => {
                props.toggleFlag(props.x, props.y);
                event.preventDefault();
                return false;
              }}>
        <div style={{
                color: props.color,
                margin: "auto",
              }}>
             {props.text}
        </div>
      </button>
  );
}

class Board extends React.Component {
  renderSquare(x, y) {
    return <Square className={this.props.squares[y][x].className}
                   font={this.props.font}
                   checkSquare={() => this.props.checkSquare(x, y)}
                   toggleFlag={() => this.props.toggleFlag(x, y)}
                   text={this.props.squares[y][x].text}
                   size={this.props.size}
                   color={this.props.squares[y][x].color}
                   disabled={this.props.squares[y][x].disabled}
                   x={x} y={y}/>;
  }

  render() {
    const board = [...Array(this.props.y).keys()].map((i) =>
        <tr key={i.toString()} className="board-row">
          {[...Array(this.props.x).keys()].map((j) =>
              <td key={(i*j+j).toString()}>
                {this.renderSquare(j, i)}
              </td>
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
      squares: null,
      dimensions: 10,
      time: 0,
      difficulty: "Easy",
      size: 0,
      font: 0,
    };
    this.state.squares = this.newMap(10)
    console.log(this.state.difficulty)
    this.timer = null;
    this.windowResized = this.windowResized.bind(this);
    this.updateWindowWidth = this.updateWindowWidth.bind(this);
    this.clock = this.startClock();
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
    let s = Math.ceil(Math.min(window.innerHeight-100, window.innerWidth-280)/_this.state.dimensions);
    _this.setState({
      size: s,
      font: Math.ceil(s*2/3)
    });
  }

  windowResized() {
    let _this = this;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(function() {
      _this.updateWindowWidth();
    }, 250);
  }

  updateClock() {
    this.setState({time: this.state.time + 1});
  }

  startClock() {
    clearInterval(this.clock);
    this.setState({time: 0});
    let _this = this;
    return setInterval(function() {_this.updateClock();}, 1000);
  }

  newMap(n) {
    let squares = [];
    let diff = 0.15;
    if (this.state.difficulty === "Medium") diff = 0.25;
    else if (this.state.difficulty === "Hard") diff = 0.35;

    for (let i = 0; i < n; i++) {
      squares.push([]);
      for (let j = 0; j < n; j++) {
        squares[i].push({
          value: "unchecked",
          mined: Math.random() >= 1 - diff,
          text: "",
          color: "black",
          disabled: false,
          className: "square unChecked",
        });
      }
    }

    return squares;
  }

  validate() {
    let x = parseInt(document.getElementById("dimensions").value);

    if (isNaN(x) || x < 5 || x > 30) {
      document.getElementById("dimensions").value = "10";
    }
  }

  toggleFlag(x, y) {
    let squares = this.state.squares;
    if (this.state.squares[y][x].value === "unchecked") {
      squares[y][x].value = "flagged";
      squares[y][x].color = "crimson";
      squares[y][x].text = <BsFlagFill/>;
    }
    else if (this.state.squares[y][x].value === "flagged") {
      squares[y][x].value = "unchecked";
      squares[y][x].color = "black";
      squares[y][x].text = "";
    }
    this.setState({squares: squares}, () => {
      this.checkWin();
    });
  }

  checkSquare(x, y) {
    if (this.state.squares[y][x].value !== "flagged") {
      let squares = this.state.squares;
      if (this.state.squares[y][x].mined) {
        document.getElementById("gameStatus").innerHTML = "GAME OVER";
        document.getElementById("gameStatus").classList.add("red");
        clearInterval(this.clock);

        squares[y][x].value = "boom";
        squares[y][x].className = "square boom";
        for (let i = 0; i < this.state.dimensions; i++) {
          for (let j = 0; j < this.state.dimensions; j++) {
            squares[i][j].disabled = true;
            if (this.state.squares[i][j].mined && this.state.squares[i][j].value !== "flagged") {
              squares[i][j].text = <GiUnlitBomb/>;
            }
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
            (this.state.squares[i][j].mined === false && this.state.squares[i][j].value === "flagged")) {
          won = false;
          break;
        }
      }
    }

    if (won) {
      document.getElementById("gameStatus").innerHTML = "You won!";
      document.getElementById("gameStatus").classList.add("green");
      clearInterval(this.clock);

      let squares = this.state.squares;
      let count = 0;
      for (let i = 0; i < this.state.dimensions; i++) {
        for (let j = 0; j < this.state.dimensions; j++) {
          if (this.state.squares[i][j].mined) count++;
          if (this.state.squares[i][j].value === "unchecked") {
            squares[i][j].value = "checked";
            squares[i][j].className = "square noBoom";
          }
        }
      }

      let hsFlag = false
      let rates = []
      let times = []

      api.getScores().then(scores => {
          rates = scores.data.data["Rates"]
          times = scores.data.data[this.state.difficulty]
      }).catch(err => console.log(err))

      let r = count/this.state.time
      let i
      for (i = 0; i < rates.length; i++) {
        if (rates[i].difficulty === this.state.difficulty) {
          if (rates[i].value < r) {
            api.deleteScore(rates[i]._id).then(r => {
              console.log(`${rates[i]._id} deleted`)
            }).catch(err => console.log(err))

            api.insertScore({
              "scoreType": "rate",
              "difficulty": `${this.state.difficulty}`,
              "value": `${r}`
            }).then(r => {
              console.log("rate inserted successfully")
            }).catch(err => console.log(err))
            hsFlag = true
          }
          else break;
        }
      }

      if (i === rates.length) {
        console.log(this.state.difficulty)
        api.insertScore({
          "scoreType": "rate",
          "difficulty": `${this.state.difficulty}`,
          "value": `${r}`
        }).then(r => {
          console.log("rate inserted successfully")
        }).catch(err => console.log(err))

        hsFlag = true
      }

      if (times.length < 3) {
        console.log(this.state.difficulty)
        api.insertScore({
          "scoreType": "time",
          "difficulty": `${this.state.difficulty}`,
          "value": `${this.state.time}`
        }).then(r => {
          console.log("time inserted successfully")
        }).catch(err => console.log(err))

        hsFlag = true
      }
      else {
        let min = times[0]
        let minIndex = 0
        for (let i = 0; i < times.length; i++) {
          if (times[i] < min) {
            min = times[i]
            minIndex = i
          }
        }

        if (this.state.time < min) {
          api.deleteScore(times[minIndex]._id).then(r => {
            console.log(`${times[minIndex]._id} deleted`)
          }).catch(err => console.log(err))
          api.insertScore({
            "scoreType": "time",
            "difficulty": `${this.state.difficulty}`,
            "value": `${this.state.time}`
          }).then(r => {
            console.log("time inserted successfully")
          }).catch(err => console.log(err))

          hsFlag = true
        }
      }

      if (hsFlag) {
        document.getElementById("gameStatus").innerHTML += "\n\n\nNew High Score!";
      }

      this.setState({squares: squares});
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
    return <Board x={x} y={y} size={this.state.size}
                  font={this.state.font}
                  dimensions={this.state.dimensions}
                  squares={this.state.squares}
                  checkSquare={(j, i) => this.checkSquare(j, i)}
                  toggleFlag={(j, i) => this.toggleFlag(j, i)}/>;
  }

  render() {
    let s = Math.ceil(Math.min(window.innerHeight-100, window.innerWidth-280)/this.state.dimensions);
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.size = s;
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.font = Math.ceil(s*2/3);
    return (
        <body className="game">
          <div className="game-info">
            <p className="game-status" id="gameStatus">{"Welcome to Minesweeper"}</p>
            <p className="clock" id="clock">{`Time: ${this.state.time}`}</p>
            <button className="new-game-button"
                    onClick={() => {
                      document.getElementById("gameStatus").innerHTML = "Welcome to Minesweeper";
                      document.getElementById("gameStatus").classList.remove("green", "red");

                      let diff = document.querySelector('input[name="difficulty"]:checked').value;
                      let dim = 10;
                      if (document.getElementById("dimensions").value !== "") {
                        dim = parseInt(document.getElementById("dimensions").value);
                      }

                      this.setState({dimensions: dim, time: 0, difficulty: diff, squares: this.newMap(dim)});
                      clearInterval(this.clock);
                      this.clock = this.startClock();
                    }}>
              New Game
            </button>
            <form id="dims" className="dims">
              <label form="dimensions">Select the map's dimensions (5-30):</label><br/><br/>
              <input id="dimensions" type="text" placeholder={10} onBlur={this.validate}/>
            </form><br/>
            <p>Select difficulty:</p>
            <input type="radio" id="easy" defaultChecked={true} name="difficulty" value="Easy"/>
            <label form="easy">Easy</label>
            <input type="radio" id="medium" name="difficulty" value="Medium"/>
            <label form="easy">Medium</label>
            <input type="radio" id="hard" name="difficulty" value="Hard"/>
            <label form="easy">Hard</label><br/><br/><br/>
            <Link to="/high-scores" className="nav-link">
              <button type={"button"}>
                View High Scores
              </button>
            </Link>
          </div>
          <div id="gameBoard" className="game-board"
               style={{right: (window.innerWidth-250-Math.min(window.innerHeight-100, window.innerWidth-280))/2,
                 top: (window.innerHeight-Math.min(window.innerHeight-100, window.innerWidth-280))/2}}>
            {this.renderBoard(this.state.dimensions, this.state.dimensions)}
          </div>
        </body>
    );
  }
}

export default App;
