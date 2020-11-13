import React, { useContext, useEffect, useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import sortBy from 'lodash/sortBy';
import SortButton from './SortButton';
import { getGitHubAccountUrl } from '../data/students';
import LoadingIndicator from './LoadingIndicator';
import ErrorBox from './ErrorBox';
import { StudentsContext } from '../contexts/StudentsContext';
import TransitionsModal from './TransitionModal';
import { getCollection, makeEntityDeleter } from '../services/API';

function StudentsTable() {
  const deleteRequestRef = useRef(null);
  const { students, setStudents } = useContext(StudentsContext);
  const [fieldToSortByWithOrder, setFieldToSortByWithOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [
    showDeletionConfirmationModal,
    setShowDeletionConfirmationModal,
  ] = useState(false);
  const [
    shouldShowDeletionConfirmationModal,
    setShouldShowDeletionConfirmationModal,
  ] = useState(true);
  const [onDeleteConfirmation, setOnDeleteConfirmation] = useState(() => {});

  /* Better version below 
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const request = CancelToken.source();
    axios
      .get('http://localhost:8080/students', {
        cancelToken: request.token,
      })
      .then((res) => res.data)
      .then((stduentListFromServer) => {
        setStudents(stduentListFromServer);
      })
      .catch((err) => setError(err))
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      request.cancel();
    };
  }, []);
  */

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const request = getCollection('students')
      .then(setStudents)
      .catch(setError)
      .finally(() => {
        if (!request.isCancelled()) setIsLoading(false);
      });
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (deleteRequestRef.current) {
        deleteRequestRef.current.cancel();
      }
    };
  }, []);

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

  /*
  const optimisticallyRemoveStudent = (id) => {
    const backup = students.slice();
    setStudents((currentList) =>
      currentList.filter((s) => s.githubUserName !== id)
    );
    deleteRequestRef.current = CancelToken.source();
    axios
      .delete(`http://localhost:8080/students/${id}`, {
        cancelToken: deleteRequestRef.current.token,
      })
      .catch(() => {
        setStudents(backup);
      });
  };
  */

  const optimisticallyRemoveStudent = (id) => {
    const backup = students.slice();
    setStudents((currentList) =>
      currentList.filter((s) => s.githubUserName !== id)
    );
    deleteRequestRef.current = makeEntityDeleter('students')(id).catch(() => {
      setStudents(backup);
    });
  };

  if (error)
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
