import React from 'react';
import './App.css';
import { Root } from './Pages/Root'
import {Route, Routes} from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/*" element={<Root/>}/>
    </Routes>
  );
}

export default App;
