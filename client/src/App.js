//import './css/App.css';
import React from "react";
import {BrowserRouter as Router, Route } from 'react-router-dom'
import HighScores from "./components/HighScores";
import Game from "./components/Game";

function App() {
  return (
      <Router>
          <Route path="/" exact component={Game} />
          <Route path="/high-scores" exact component={HighScores} />
      </Router>
  );
}

export default App;
