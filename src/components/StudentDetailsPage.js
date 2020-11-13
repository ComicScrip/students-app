import React from 'react';
import { useQuery } from 'react-query';
import LoadingIndicator from './LoadingIndicator';
import ErrorBox from './ErrorBox';
import {
  getAvatarUrl,
  getFullName,
  getGitHubAccountUrl,
} from '../data/students';
import { getEntity, isCancelledError } from '../services/API';

function StudentDetailsPage({
  match: {
    params: { githubUserName },
  },
}) {
  const { isLoading, data: student, error } = useQuery(
    ['students', githubUserName],
    getEntity
  );
  const isError = error && !isCancelledError(error);

  if (isLoading) return <LoadingIndicator />;
  if (isError)
    return (
      <ErrorBox
        message={"impossible de charger les informations sur l'élève"}
      />
    );
  if (!student)
    return <p>Aucun élève avec le compte GH "{githubUserName}"...</p>;

  const fullName = getFullName(student);
  const githubAccountUrl = getGitHubAccountUrl(student);

  return (
    <div>
      <h2>{fullName}</h2>

      <div className="student-card">
        <a href={githubAccountUrl} target="_blank" rel="noopener noreferrer">
          <img className="avatar" alt={fullName} src={getAvatarUrl(student)} />
        </a>
        <br />
      </div>
    </div>
  );
}

export default StudentDetailsPage;
