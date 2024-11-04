import React from "react";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, CircularProgress } from "@mui/material";

interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    message: string;
    loading: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    title,
    message,
    loading,
    onConfirm,
    onCancel,
    confirmText = "Confirm",
    cancelText = "Cancel"
}) => {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel} color="primary">
                    {cancelText}
                </Button>
                <Button
                    onClick={onConfirm}
                    color="secondary"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
