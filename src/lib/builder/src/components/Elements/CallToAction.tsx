import React from 'react';
import Button from './Button';

interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
}

const CallToAction: React.FC<CallToActionProps> = ({ title, description, buttonText }) => {
  const containerStyle = `
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    padding: 2rem;
    text-align: center;
  `;

  const titleStyle = `
    font-size: 2rem;
    font-weight: bold;
    color: #343a40;
    margin-bottom: 1rem;
  `;

  const descriptionStyle = `
    font-size: 1.25rem;
    color: #6c757d;
    margin-bottom: 1.5rem;
  `;

  return (
    <div style={{ cssText: containerStyle }}>
      <h2 style={{ cssText: titleStyle }}>{title}</h2>
      <p style={{ cssText: descriptionStyle }}>{description}</p>
      <Button text={buttonText} variant="primary" size="large" />
    </div>
  );
};

export default CallToAction;