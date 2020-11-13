import React from 'react';
import { sortBy } from 'lodash';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';

import {
  getAvatarUrl,
  getFullName,
  getGitHubAccountUrl,
  persistAll,
} from '../data/students';

const StudentsTableRow = ({
  firstName,
  lastName,
  gitHubAccountUrl,
  firstTrainerMeetingDone,
  avatarUrl,
  fullName,
  handleTrainerMeetingDoneToogle = () => {},
}) => {
  return (
    <tr>
      <td>
        <a href={gitHubAccountUrl} target="_blank" rel="noopener noreferrer">
          <img
            className="avatar"
            src={avatarUrl}
            alt={`${fullName}'s Github avatar`}
          />
        </a>
      </td>
      <td>
        <a href={gitHubAccountUrl}>{firstName}</a>
      </td>
      <td>{lastName.toUpperCase()}</td>
      <td>
        <Switch
          checked={firstTrainerMeetingDone}
          onChange={handleTrainerMeetingDoneToogle}
          color="primary"
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </td>
    </tr>
  );
};

const SortButton = ({ fieldToSortBy, sortOrder, activeSort, onClick }) => {
  const fieldToSortByWithOrder = `${fieldToSortBy} ${sortOrder}`;
  const handleClick = () => {
    onClick(fieldToSortByWithOrder);
  };
  return (
    <span
      className={`sort-button${
        activeSort === fieldToSortByWithOrder ? ' active' : ''
      }`}
      onClick={handleClick}
      aria-hidden="true"
    >
      <i className={`fas fa-arrow-${sortOrder === 'DESC' ? 'up' : 'down'}`} />
    </span>
  );
};

class StudentsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSort: null,
      sortedStudents: [],
      initialStudentList: [],
      loadingStudents: false,
      loadingError: null,
    };
  }

  componentDidMount() {
    const studentsFromStorage = JSON.parse(localStorage.getItem('students'));
    if (studentsFromStorage) {
      this.setState({ sortedStudents: studentsFromStorage });
    } else {
      this.setState({ loadingStudents: true });
      axios
        .get('http://localhost:8080/students')
        .then((res) =>
          this.setState({
            loadingError: null,
            loadingStudents: false,
            sortedStudents: res.data,
          })
        )
        .catch(() => {
          this.setState({
            loadingError:
              "Une erreur est survenue durant le chargement des élèves depuis l'API",
          });
        });
    }
  }

  handleSortButtonClicked = (fieldToSortByWithOrder) => {
    const { activeSort, initialStudentList } = this.state;
    if (activeSort === fieldToSortByWithOrder) {
      this.setState({ sortedStudents: initialStudentList, activeSort: null });
    } else {
      const [fieldToSortBy, sortOrder] = fieldToSortByWithOrder.split(' ');
      let sortedStudents = sortBy(initialStudentList, fieldToSortBy);
      if (sortOrder === 'DESC') {
        sortedStudents = sortedStudents.reverse();
      }
      this.setState({ sortedStudents, activeSort: fieldToSortByWithOrder });
    }
  };

  handleTrainerMeetingDoneToogle = (githubUserName) => {
    this.setState(
      ({ sortedStudents }) => ({
        sortedStudents: sortedStudents.map((s) =>
          s.githubUserName === githubUserName
            ? {
                ...s,
                firstTrainerMeetingDone: !s.firstTrainerMeetingDone,
              }
            : s
        ),
      }),
      () => {
        const { sortedStudents } = this.state;
        persistAll(sortedStudents);
      }
    );
  };

  render() {
    const {
      sortedStudents,
      activeSort,
      loadingStudents,
      loadingError,
    } = this.state;
    const { handleTrainerMeetingDoneToogle } = this;

    if (loadingError) return <p className="error">{loadingError}</p>;
    if (loadingStudents) return <p>loading students from API</p>;

    return (
      <table>
        <thead>
          <tr>
            <td>Avatar</td>
            <td>
              Prénom
              <span className="col-sort-buttons-container">
                <SortButton
                  fieldToSortBy="firstName"
                  sortOrder="ASC"
                  onClick={this.handleSortButtonClicked}
                  activeSort={activeSort}
                />
                <SortButton
                  fieldToSortBy="firstName"
                  sortOrder="DESC"
                  onClick={this.handleSortButtonClicked}
                  activeSort={activeSort}
                />
              </span>
            </td>
            <td>
              Nom
              <span className="col-sort-buttons-container">
                <SortButton
                  fieldToSortBy="lastName"
                  sortOrder="ASC"
                  onClick={this.handleSortButtonClicked}
                  activeSort={activeSort}
                />
                <SortButton
                  fieldToSortBy="lastName"
                  sortOrder="DESC"
                  onClick={this.handleSortButtonClicked}
                  activeSort={activeSort}
                />
              </span>
            </td>
            <td>Entretien tech passé</td>
          </tr>
        </thead>
        <tbody>
          {sortedStudents.map((student) => {
            const {
              githubUserName,
              firstName,
              lastName,
              firstTrainerMeetingDone,
            } = student;
            return (
              <StudentsTableRow
                key={githubUserName}
                handleTrainerMeetingDoneToogle={() =>
                  handleTrainerMeetingDoneToogle(githubUserName)
                }
                {...{
                  firstTrainerMeetingDone,
                  firstName,
                  lastName,
                  gitHubAccountUrl: getGitHubAccountUrl(student),
                  avatarUrl: getAvatarUrl(student),
                  fullName: getFullName(student),
                }}
              />
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default StudentsTable;
