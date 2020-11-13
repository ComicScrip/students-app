import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink exact to="/">
            Groups
          </NavLink>
        </li>
        <li>
          <NavLink to="/students">Students</NavLink>
        </li>
      </ul>
    </nav>
  );
}
