import React, { useContext, useEffect, useRef, useState } from 'react';
import get from 'lodash/get';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
// import axios, { CancelToken } from 'axios';
import ErrorBox from './ErrorBox';
import { StudentsContext } from '../contexts/StudentsContext';
import { makeEntityAdder } from '../services/API';

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    height: 55,
  },
}));

export default function StudentForm() {
  const classes = useStyles();
  const { setStudents } = useContext(StudentsContext);
  const { handleSubmit, register, errors, reset: resetForm } = useForm();
  const firstNameRef = useRef();

  // antoher use case for useRef : keeping track of a value during the life of the component
  // const tokenSourceRef = useRef(null);
  const requestPromise = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const save = (formData) => {
    setIsLoading(true);
    setSubmitError(null);
    const performPostRequest = makeEntityAdder('students');
    requestPromise.current = performPostRequest(formData)
      .then((newStudentFromServer) => {
        setStudents((currentStudentList) => [
          newStudentFromServer,
          ...currentStudentList,
        ]);
        resetForm();
        setTimeout(() => {
          // the input does not take focus without this little setTimeout hack :(
          firstNameRef.current.focus();
        }, 0);
      })
      .catch((err) => {
        setSubmitError(get(err, 'response.data.errorMessage', null));
      })
      .finally(() => {
        if (!requestPromise.current.isCancelled()) setIsLoading(false);
      });
  };

  /* Same as above (but worse)
  const save = (formData) => {
    setIsLoading(true);
    setSubmitError(null);
    tokenSourceRef.current = CancelToken.source();

    axios
      .post('http://localhost:8080/students', formData, {
        cancelToken: tokenSourceRef.current.token,
      })
      .then((res) => res.data)
      .then((newStudentFromServer) => {
        setStudents((currentStudentList) => [
          newStudentFromServer,
          ...currentStudentList,
        ]);
        resetForm();
        setTimeout(() => {
          // the input does not take focus without this little setTimeout hack :(
          firstNameRef.current.focus();
        }, 0);
      })
      .catch((thrown) => {
        if (!axios.isCancel(thrown)) throw new Error(thrown);
        else window.console.log(thrown);
      })
      .catch((err) => setSubmitError(err))
      .finally(() => {
        setIsLoading(false);
      });
  }; */

  useEffect(() => {
    return () => {
      // if (tokenSourceRef.current) {
      //  tokenSourceRef.current.cancel('saveStudent request was cancelled');
      // }
      if (requestPromise.current) {
        requestPromise.current.cancel('saveStudent request was cancelled');
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit(save)}>
      {submitError && <ErrorBox message={submitError} />}
      <TextField
        error={!!errors.firstName}
        disabled={isLoading}
        id="firstName"
        name="firstName"
        label="Prénom"
        variant="outlined"
        helperText={get(errors, 'firstName.message', '')}
        inputRef={(e) => {
          register(e, {
            required: 'Ce champs est requis',
            maxLength: {
              value: 30,
              message: 'Ce champs ne doit pas excéder 30 caracteres',
            },
          });
          firstNameRef.current = e;
        }}
      />
      <br /> <br />
      <TextField
        error={!!errors.lastName}
        disabled={isLoading}
        id="lastName"
        name="lastName"
        label="Nom"
        helperText={get(errors, 'lastName.message', '')}
        variant="outlined"
        inputRef={register({
          required: 'Ce champs est requis',
          maxLength: {
            value: 30,
            message: 'Ce champs ne doit pas excéder 30 caracteres',
          },
        })}
      />
      <br /> <br />
      <TextField
        error={!!errors.githubUserName}
        disabled={isLoading}
        id="githubUserName"
        name="githubUserName"
        label="Identifiant GitHub"
        variant="outlined"
        helperText={get(errors, 'githubUserName.message', '')}
        inputRef={register({
          required: 'Ce champs est requis',
        })}
      />{' '}
      <br /> <br />
      <br />
      <Button
        disabled={isLoading}
        type="submit"
        variant="contained"
        color="primary"
        className={classes.button}
        startIcon={<AddIcon />}
      >
        Ajouter
      </Button>
    </form>
  );
}
