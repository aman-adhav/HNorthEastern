import React, { Component } from 'react';
import './App.css';
import Entities from './Components/Entities'

function App() {
  return (
      <a-scene embedded vr-mode-ui="enabled: false" arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;">


        <Entities />


      <a-entity camera></a-entity>
      </a-scene>
  );
}

export default App;
