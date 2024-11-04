import React, { useState, ReactNode, MouseEvent } from 'react';
import Alert, { AlertProps } from '@mui/material/Alert';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface SnackbarOptions {
  message: string;
  autoHideDuration?: number;
  type?: SnackbarType;
  onClose?: () => void;
}
type SnackbarHookType = {
  openSnackbar: (options: SnackbarOptions) => void;
  snackProps: any;
  alertProps: any;
}
function useSnackbar(): SnackbarHookType {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [autoHideDuration, setAutoHideDuration] = useState(3000);
  const [type, setType] = useState("info");
  const [onClose, setOnClose] = useState<() => void>(() => { });

  const openSnackbar = ({ message, autoHideDuration = 6000, type = "info", onClose }: SnackbarOptions) => {
    setMessage(message);
    setAutoHideDuration(autoHideDuration);
    setOnClose(() => onClose || (() => setIsOpen(false)));
    setIsOpen(true);
    setType(type);
  };

  const handleClose = (event: MouseEvent<Element>, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return {
    openSnackbar,
    snackProps: {
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      open: isOpen,
      autoHideDuration,
      onClose: handleClose,
    },
    alertProps: {
      severity: type,
      variant: "filled",
      sx: { width: '100%' },
      children: message,
      onClose: handleClose,
    }
  };
}

export default useSnackbar;
