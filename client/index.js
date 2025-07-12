    function generateImage() {
      fetch('/generate')
        .then(response => response.json())
        .then(data => {
          document.getElementById('generatedImage').src = data.image_url;
        })
        .catch(error => {
          console.error('Error:', error);
          alert('Image generation failed.');
        });
    }