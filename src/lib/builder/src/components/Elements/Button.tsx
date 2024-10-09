import React from 'react';

interface ButtonProps {
  text: string;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({ text, variant, size }) => {
  const baseStyle = `
    display: inline-block;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border-radius: 0.25rem;
    transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
    cursor: pointer;
  `;

  const variantStyles = {
    primary: `
      color: #fff;
      background-color: #007bff;
      border-color: #007bff;
    `,
    secondary: `
      color: #fff;
      background-color: #6c757d;
      border-color: #6c757d;
    `,
    outline: `
      color: #007bff;
      background-color: transparent;
      background-image: none;
      border-color: #007bff;
    `
  };

  const sizeStyles = {
    small: `
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
      line-height: 1.5;
      border-radius: 0.2rem;
    `,
    medium: `
      padding: 0.375rem 0.75rem;
      font-size: 1rem;
      line-height: 1.5;
      border-radius: 0.25rem;
    `,
    large: `
      padding: 0.5rem 1rem;
      font-size: 1.25rem;
      line-height: 1.5;
      border-radius: 0.3rem;
    `
  };

  const combinedStyle = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]}`;

  return (
    <button style={{ cssText: combinedStyle }}>
      {text}
    </button>
  );
};

export default Button;