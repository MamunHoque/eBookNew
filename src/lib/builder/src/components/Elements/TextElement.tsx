import React from 'react';

interface TextElementProps {
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'blockquote' | 'pre';
  content: string;
}

const TextElement: React.FC<TextElementProps> = ({ tag, content }) => {
  const Tag = tag;
  return <Tag dangerouslySetInnerHTML={{ __html: content }} />;
};

export default TextElement;