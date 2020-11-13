import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { Button } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    marginRight: 10,
  },
}));

export default function TransitionsModal({
  title,
  content,
  open,
  handleClose,
  handleYes,
  handleDontShowAgain,
}) {
  const classes = useStyles();

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <h2 id="transition-modal-title">
              {title || 'Suppression - confirmation'}
            </h2>
            <p id="transition-modal-description">
              {content || 'Etes-vous sûr de vouloir supprimer cet item ?'}
            </p>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleYes}
              className={classes.button}
            >
              Yep
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleClose}
            >
              Nope
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              onClick={handleDontShowAgain}
            >
              Ne plus montrer
            </Button>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
