import React from 'react';

interface CardProps {
  title: string;
  content: string;
  imageUrl?: string;
  variant: 'basic' | 'image' | 'quote';
}

const Card: React.FC<CardProps> = ({ title, content, imageUrl, variant }) => {
  const baseStyle = `
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    overflow: hidden;
    width: 300px;
  `;

  const renderContent = () => {
    switch (variant) {
      case 'basic':
        return `
          <div style="padding: 1.25rem;">
            <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.75rem;">${title}</h3>
            <p style="color: #6c757d;">${content}</p>
          </div>
        `;
      case 'image':
        return `
          ${imageUrl ? `<img src="${imageUrl}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover;">` : ''}
          <div style="padding: 1.25rem;">
            <h3 style="font-size: 1.25rem; font-weight: bold; margin-bottom: 0.75rem;">${title}</h3>
            <p style="color: #6c757d;">${content}</p>
          </div>
        `;
      case 'quote':
        return `
          <div style="padding: 1.25rem;">
            <blockquote style="font-style: italic; color: #6c757d; margin-bottom: 1rem;">"${content}"</blockquote>
            <p style="font-weight: bold; color: #343a40;">- ${title}</p>
          </div>
        `;
    }
  };

  return (
    <div style={{ cssText: baseStyle }} dangerouslySetInnerHTML={{ __html: renderContent() }} />
  );
};

export default Card;