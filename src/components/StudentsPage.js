import React from 'react';
import StudentForm from './StudentForm';
import StudentsTable from './StudentsTable';

export default function StudentsPage() {
  return (
    <div>
      <h2>Ajouter un élève</h2>
      <StudentForm />
      <br />
      <br />
      <h2>Promo Lyon JS sept 2020</h2>
      <StudentsTable />
    </div>
  );
}
