import React, { useState } from 'react';

interface EmbeddedVideoProps {
  initialUrl?: string;
  initialWidth?: number;
  initialHeight?: number;
}

const EmbeddedVideo: React.FC<EmbeddedVideoProps> = ({ 
  initialUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  initialWidth = 560,
  initialHeight = 315
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);

  return (
    <div className="embedded-video-element">
      <iframe
        width={width}
        height={height}
        src={url}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
      <div className="mt-2 space-y-2">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter video URL"
        />
        <div className="flex space-x-2">
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-1/2 p-2 border rounded"
            placeholder="Width"
          />
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-1/2 p-2 border rounded"
            placeholder="Height"
          />
        </div>
      </div>
    </div>
  );
};

export default EmbeddedVideo;