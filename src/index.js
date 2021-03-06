import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Board from "./Board.js";
import Menu from "./Menu";
import "bootstrap/dist/css/bootstrap.css";
var _ = require("lodash");

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initial: 33,
    };
  }
  handleGeneration = (initial) => {
    this.setState({ initial: initial });
  };

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board key={_.random(0, 10000)} initial={this.state.initial} />
          <div className="game-menu">
            <Menu onGenerate={this.handleGeneration} />
          </div>
        </div>
        <a
          className="github-link"
          href="https://github.com/ViktorLjungquist/Sudoku_Work_test"
        >
          View Code on Github.
        </a>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
