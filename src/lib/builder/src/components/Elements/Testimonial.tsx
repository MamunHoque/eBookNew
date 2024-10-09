import React from 'react';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  avatarUrl: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, avatarUrl }) => {
  const containerStyle = `
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 0.25rem;
    padding: 1.5rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  `;

  const quoteStyle = `
    font-size: 1.25rem;
    font-style: italic;
    color: #6c757d;
    margin-bottom: 1rem;
  `;

  const authorContainerStyle = `
    display: flex;
    align-items: center;
  `;

  const avatarStyle = `
    width: 48px;
    height: 48px;
    border-radius: 50%;
    margin-right: 1rem;
  `;

  const authorInfoStyle = `
    display: flex;
    flex-direction: column;
  `;

  const authorNameStyle = `
    font-weight: bold;
    color: #343a40;
  `;

  const authorRoleStyle = `
    color: #6c757d;
    font-size: 0.875rem;
  `;

  return (
    <div style={{ cssText: containerStyle }}>
      <blockquote style={{ cssText: quoteStyle }}>"{quote}"</blockquote>
      <div style={{ cssText: authorContainerStyle }}>
        <img src={avatarUrl} alt={author} style={{ cssText: avatarStyle }} />
        <div style={{ cssText: authorInfoStyle }}>
          <p style={{ cssText: authorNameStyle }}>{author}</p>
          <p style={{ cssText: authorRoleStyle }}>{role}</p>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;