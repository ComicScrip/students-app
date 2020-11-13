import React from 'react';
import { Route, Switch } from 'react-router';
import StudentDetailsPage from './StudentDetailsPage';
import StudentsPage from './StudentsPage';

function Main() {
  return (
    <main>
      <Switch>
        <Route exact path="/students" component={StudentsPage} />
        <Route
          path="/students/:githubUserName"
          component={StudentDetailsPage}
        />
      </Switch>
    </main>
  );
}
export default Main;
