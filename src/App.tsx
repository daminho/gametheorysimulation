import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import MainPage from './components/MainPage';
import DoveHawk from './games/DoveHawk';
import PrisonerDilemma from './games/PrisonerDilemma/PrisonerDilemma';

function App() {
  return (
    <PrisonerDilemma/>
  );
}

export default App;
