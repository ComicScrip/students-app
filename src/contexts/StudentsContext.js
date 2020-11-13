import React, { createContext, useState } from 'react';

export const StudentsContext = createContext({
  students: [],
  setStudents: () => {},
});

export default function StudentsContextProvider({ children }) {
  const [students, setStudents] = useState([]);
  return (
    <StudentsContext.Provider value={{ students, setStudents }}>
      {children}
    </StudentsContext.Provider>
  );
}
