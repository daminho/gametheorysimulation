import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import DoveHawk from './games/DoveHawk';
import PrisonerDilemma from './games/PrisonerDilemma/PrisonerDilemma';

function App() {
  return (
    <BrowserRouter basename="https://daminho.github.io/gametheorysimulation">
      <Routes>
        <Route path="/" element = {<MainPage/>}/>
        <Route path="/dovehawks" element = {<DoveHawk/>}/>
        <Route path="/prisonerdelimma" element = {<PrisonerDilemma/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
