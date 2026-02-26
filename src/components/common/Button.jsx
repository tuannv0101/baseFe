import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '' }) => {
  const baseStyles = 'padding: 8px 16px; border-radius: 4px; cursor: pointer;';
  const variants = {
    primary: 'background-color: #007bff; color: white; border: none;',
    secondary: 'background-color: #6c757d; color: white; border: none;',
    outline: 'background-color: transparent; border: 1px solid #007bff; color: #007bff;',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variant} ${className}`}
      style={{ ...parseInlineStyles(baseStyles + variants[variant]) }}
    >
      {children}
    </button>
  );
};

// Simple helper to parse the strings above (just for demonstration)
const parseInlineStyles = (styleStr) => {
  return styleStr.split(';').reduce((acc, style) => {
    const [prop, val] = style.split(':');
    if (prop && val) {
      const camelProp = prop.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
      acc[camelProp] = val.trim();
    }
    return acc;
  }, {});
};

export default Button;
