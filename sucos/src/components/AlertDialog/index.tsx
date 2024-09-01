import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface IAlertDialog {
  open: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const AlertDialog = ({ open, handleClose, handleConfirm }: IAlertDialog) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {'Tem certeza que deseja cancelar o pedido?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Ao cancelar o pedido, essa ação não poderá ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Não
        </Button>
        <Button
          onClick={() => {
            handleConfirm();
            handleClose();
          }}
          color="primary"
          autoFocus
        >
          Sim
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
