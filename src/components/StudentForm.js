import React, { useRef } from 'react';
import { useMutation, useQueryCache } from 'react-query';
import get from 'lodash/get';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import { useForm } from 'react-hook-form';
// import axios, { CancelToken } from 'axios';
import ErrorBox from './ErrorBox';
import { isCancelledError, makeEntityAdder } from '../services/API';

const useStyles = makeStyles((theme) => ({
  button: {
    marginLeft: theme.spacing(1),
    height: 55,
  },
}));

export default function StudentForm() {
  const classes = useStyles();
  const { handleSubmit, register, errors, reset: resetForm } = useForm();
  const firstNameRef = useRef();

  // antoher use case for useRef : keeping track of a value during the life of the component
  // const tokenSourceRef = useRef(null);

  const cache = useQueryCache();
  const [save, { error, isLoading }] = useMutation(
    makeEntityAdder('students'),
    {
      onSuccess: (dataFromServer) => {
        cache.setQueryData('students', (oldList) => [
          ...oldList,
          dataFromServer,
        ]);
        resetForm();
        firstNameRef.current.focus();
      },
    }
  );
  const submitError =
    !isCancelledError(error) &&
    error &&
    get(
      error,
      'response.data.errorMessage',
      `Une erreur est survenue lors de l'ajout`
    );

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
