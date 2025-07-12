import React from 'react';
import ImageArtGenerator from '../src/componetns/ImageArtGenerator.jsx';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>
        Image Art Generator
      </h1>
      <ImageArtGenerator />
    </div>
  );
}

export default App;
