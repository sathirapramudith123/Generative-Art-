import React, { useState, useRef } from 'react';
import './ImageArtGenerator.css'; 

const ArtGenerator = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [filters, setFilters] = useState({
    contrast: 100,
    brightness: 100,
    saturate: 100,
    sepia: 0,
    hue: 0,
    blur: 0,
  });
  const [transform, setTransform] = useState({
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
  });
  const [artStyles, setArtStyles] = useState([]);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const applyFilters = () => {
    const filterString = `
      contrast(${filters.contrast}%)
      brightness(${filters.brightness}%)
      saturate(${filters.saturate}%)
      sepia(${filters.sepia}%)
      hue-rotate(${filters.hue}deg)
      blur(${filters.blur}px)
    `;
    
    const transformString = `
      rotate(${transform.rotate}deg)
      scaleX(${transform.scaleX})
      scaleY(${transform.scaleY})
      skewX(${transform.skewX}deg)
      skewY(${transform.skewY}deg)
    `;
    
    return {
      filter: filterString,
      transform: transformString,
    };
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTransformChange = (e) => {
    const { name, value } = e.target;
    setTransform(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveArtStyle = () => {
    const newStyle = {
      filters: { ...filters },
      transforms: { ...transform },
      preview: applyFilters(),
      timestamp: new Date().toISOString()
    };
    setArtStyles(prev => [...prev, newStyle]);
  };

  const applyPreset = (style) => {
    setFilters(style.filters);
    setTransform(style.transforms);
  };

  const downloadArt = () => {
    if (!canvasRef.current || !image) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply filters (note: canvas has limited filter support compared to CSS)
      ctx.filter = `
        contrast(${filters.contrast}%)
        brightness(${filters.brightness}%)
        saturate(${filters.saturate}%)
        sepia(${filters.sepia}%)
        hue-rotate(${filters.hue}deg)
        blur(${filters.blur}px)
      `;
      
      ctx.drawImage(img, 0, 0);
      
      // Apply transforms
      // Note: Canvas transforms are more complex than CSS
      // This is a simplified version
      ctx.translate(canvas.width/2, canvas.height/2);
      ctx.rotate(transform.rotate * Math.PI/180);
      ctx.scale(transform.scaleX, transform.scaleY);
      ctx.translate(-canvas.width/2, -canvas.height/2);
      ctx.drawImage(img, 0, 0);
      
      // Download the image
      const link = document.createElement('a');
      link.download = 'artwork.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = image;
  };

  return (
    <div className="art-generator">
      <h1>Image to Art Generator</h1>
      
      <div className="upload-section">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
      </div>
      
      {preview && (
        <div className="workspace">
          <div className="image-preview">
            <img 
              src={preview} 
              alt="Preview" 
              style={applyFilters()} 
            />
          </div>
          
          <div className="controls">
            <h3>Filters</h3>
            {Object.entries(filters).map(([key, value]) => (
              <div key={key} className="control-group">
                <label>{key}:</label>
                <input
                  type="range"
                  name={key}
                  min={key === 'sepia' || key === 'hue' || key === 'blur' ? 0 : 0}
                  max={key === 'sepia' ? 100 : 200}
                  value={value}
                  onChange={handleFilterChange}
                />
                <span>{value}{key === 'hue' ? 'deg' : key === 'blur' ? 'px' : '%'}</span>
              </div>
            ))}
            
            <h3>Transforms</h3>
            {Object.entries(transform).map(([key, value]) => (
              <div key={key} className="control-group">
                <label>{key}:</label>
                <input
                  type="range"
                  name={key}
                  min={key.includes('scale') ? 0.1 : -180}
                  max={key.includes('scale') ? 3 : 180}
                  step={key.includes('scale') ? 0.1 : 1}
                  value={value}
                  onChange={handleTransformChange}
                />
                <span>{value}{key.includes('rotate') || key.includes('skew') ? 'deg' : ''}</span>
              </div>
            ))}
            
            <div className="action-buttons">
              <button onClick={saveArtStyle}>Save This Style</button>
              <button onClick={downloadArt}>Download Artwork</button>
            </div>
          </div>
        </div>
      )}
      
      {artStyles.length > 0 && (
        <div className="saved-styles">
          <h3>Saved Styles</h3>
          <div className="style-grid">
            {artStyles.map((style, index) => (
              <div 
                key={style.timestamp} 
                className="style-thumbnail"
                onClick={() => applyPreset(style)}
              >
                <img 
                  src={image} 
                  alt={`Style ${index}`}
                  style={style.preview}
                />
                <div className="style-info">Style {index + 1}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default ArtGenerator;