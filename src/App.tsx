import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainPage from './components/MainPage';
import DoveHawk from './games/DoveHawk';
import PrisonerDilemma from './games/PrisonerDilemma/PrisonerDilemma';

function App() {
  return (
    <ul>
        <li> 
            <Link to ="/dovehawks">
            DoveHawk
            </Link>
        </li>
        <li>
            <Link to ="/prisonerdelimma">
                Prisoner's Delimma
            </Link>
        </li>
      </ul>
  );
}

export default App;
