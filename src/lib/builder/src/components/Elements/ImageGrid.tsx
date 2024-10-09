import React from 'react';

interface Image {
  url: string;
  alt: string;
}

interface ImageGridProps {
  images: Image[];
  columns: 2 | 3 | 4;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, columns }) => {
  const gridStyle = `
    display: grid;
    grid-template-columns: repeat(${columns}, 1fr);
    gap: 1rem;
    width: 100%;
  `;

  const imageStyle = `
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.25rem;
  `;

  return (
    <div style={{ cssText: gridStyle }}>
      {images.map((image, index) => (
        <div key={index} style={{ aspectRatio: '1 / 1', overflow: 'hidden' }}>
          <img 
            src={image.url} 
            alt={image.alt} 
            style={{ cssText: imageStyle }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;