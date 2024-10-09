import React, { useState } from 'react';

interface GIFProps {
  initialUrl?: string;
}

const GIF: React.FC<GIFProps> = ({ initialUrl = 'https://media.giphy.com/media/3o7aCTfyhYawdOXcFW/giphy.gif' }) => {
  const [url, setUrl] = useState(initialUrl);

  return (
    <div className="gif-element">
      <img src={url} alt="GIF" className="max-w-full h-auto" />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mt-2 p-2 border rounded w-full"
        placeholder="Enter GIF URL"
      />
    </div>
  );
};

export default GIF;