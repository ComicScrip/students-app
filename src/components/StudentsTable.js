import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import { useMutation, useQuery, useQueryCache } from 'react-query';
import { Link } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import SortButton from './SortButton';
import { getGitHubAccountUrl } from '../data/students';
import LoadingIndicator from './LoadingIndicator';
import ErrorBox from './ErrorBox';
import TransitionsModal from './TransitionModal';
import {
  getCollection,
  isCancelledError,
  makeEntityDeleter,
} from '../services/API';

function StudentsTable() {
  const [fieldToSortByWithOrder, setFieldToSortByWithOrder] = useState(null);
  const [
    showDeletionConfirmationModal,
    setShowDeletionConfirmationModal,
  ] = useState(false);
  const [
    shouldShowDeletionConfirmationModal,
    setShouldShowDeletionConfirmationModal,
  ] = useState(true);
  const [onDeleteConfirmation, setOnDeleteConfirmation] = useState(() => {});

  const { isLoading, data: students, error } = useQuery(
    'students',
    getCollection
  );
  const isError = error && !isCancelledError(error);

  const confirm = (ifYes) => {
    return () => {
      if (shouldShowDeletionConfirmationModal) {
        setShowDeletionConfirmationModal(true);
        setOnDeleteConfirmation(() => () => {
          setShowDeletionConfirmationModal(false);
          ifYes();
        });
      } else {
        ifYes();
      }
    };
  };

  const cache = useQueryCache();

  const [optimisticallyRemoveStudent] = useMutation(
    makeEntityDeleter('students'),
    {
      onMutate: (id) => {
        cache.cancelQueries('students');
        const backup = cache.getQueryData('students');
        cache.setQueryData('students', (oldList) =>
          oldList.filter((s) => s.githubUserName !== id)
        );
        return () => cache.setQueryData('students', () => backup);
      },
      onError: (err, variables, rollback) => rollback(),
    }
  );

  if (isError)
    return <ErrorBox message="Erreur lors du chargement de la liste" />;
  if (isLoading) return <LoadingIndicator />;
  if (!students.length) return <p>Aucun élève dans la liste</p>;

  const renderSortButton = (fieldToSortBy, desc = false) => {
    const fieldWithOrder = `${fieldToSortBy} ${desc ? 'DESC' : 'ASC'}`;
    return (
      <SortButton
        active={fieldWithOrder === fieldToSortByWithOrder}
        onClick={() => setFieldToSortByWithOrder(fieldWithOrder)}
        desc={desc}
      />
    );
  };

  const renderTableHead = () => (
    <tr>
      <td>
        Prénom
        <span className="col-sort-buttons-container">
          {renderSortButton('firstName')}
          {renderSortButton('firstName', true)}
        </span>
      </td>
      <td>
        Nom
        <span className="col-sort-buttons-container">
          {renderSortButton('lastName')}
          {renderSortButton('lastName', true)}
        </span>
      </td>
      <td>Retirer de la liste</td>
    </tr>
  );

  const renderSortedStudents = () => {
    let sortedStudents = students.slice();
    if (fieldToSortByWithOrder) {
      const [fieldToSortBy, sortOrder] = fieldToSortByWithOrder.split(' ');
      sortedStudents = sortBy(sortedStudents, [
        (s) => s[fieldToSortBy].toUpperCase(),
      ]);
      if (sortOrder === 'DESC') {
        sortedStudents = sortedStudents.reverse();
      }
    }
    return sortedStudents.map((student) => (
      <tr key={student.githubUserName}>
        <td>
          <a href={getGitHubAccountUrl(student)}>{student.firstName}</a>
        </td>
        <td>
          <Link to={`/students/${student.githubUserName}`}>
            {student.lastName.toUpperCase()}
          </Link>
        </td>
        <td>
          <Button
            onClick={confirm(() => {
              optimisticallyRemoveStudent(student.githubUserName);
            })}
          >
            Retirer
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <>
      {shouldShowDeletionConfirmationModal && (
        <TransitionsModal
          open={showDeletionConfirmationModal}
          handleClose={() => setShowDeletionConfirmationModal(false)}
          handleDontShowAgain={() =>
            setShouldShowDeletionConfirmationModal(false)
          }
          handleYes={onDeleteConfirmation}
        />
      )}

      <table>
        <thead>{renderTableHead()}</thead>
        <tbody>{renderSortedStudents()}</tbody>
      </table>
    </>
  );
}

export default StudentsTable;
