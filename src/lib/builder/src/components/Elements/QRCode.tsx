import React, { useState } from 'react';

interface QRCodeProps {
  initialContent?: string;
}

const QRCode: React.FC<QRCodeProps> = ({ initialContent = 'https://example.com' }) => {
  const [content, setContent] = useState(initialContent);

  return (
    <div className="qr-code-element">
      <img
        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(content)}`}
        alt="QR Code"
      />
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="mt-2 p-2 border rounded"
        placeholder="Enter URL or text for QR code"
      />
    </div>
  );
};

export default QRCode;