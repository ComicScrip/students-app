import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';

export default ({ onClick = () => {}, active = false, desc = false }) => {
  return (
    <FontAwesomeIcon
      className={`sort-button${active ? ' active' : ''}`}
      onClick={onClick}
      icon={desc ? faArrowUp : faArrowDown}
    />
  );
};
