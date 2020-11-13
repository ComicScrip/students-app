import React, { useEffect, useState } from 'react';
import LoadingIndicator from './LoadingIndicator';
import ErrorBox from './ErrorBox';
import {
  getAvatarUrl,
  getFullName,
  getGitHubAccountUrl,
} from '../data/students';
import { getEntity } from '../services/API';

function StudentDetailsPage({
  match: {
    params: { githubUserName },
  },
}) {
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /* Better version below
  useEffect(() => {
    setIsLoading(true);
    const request = CancelToken.source();
    axios
      .get(`http://localhost:8080/students/${githubUserName}`, {
        cancelToken: request.token,
      })
      .then((res) => res.data)
      .then((data) => setStudent(data))
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
    const request = getEntity('students', githubUserName)
      .then((data) => setStudent(data))
      .catch((err) => setError(err))
      .finally(() => {
        if (!request.isCancelled()) setIsLoading(false);
      });
    return () => {
      request.cancel();
    };
  }, []);

  if (isLoading) return <LoadingIndicator />;
  if (error) return <ErrorBox message={error} />;
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
