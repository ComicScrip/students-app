import React from 'react';

const ErrorBox = ({ message }) => {
  return (
    <div className="error-box-container">
      <p className="error-box">{message}</p>
    </div>
  );
};

export default ErrorBox;
