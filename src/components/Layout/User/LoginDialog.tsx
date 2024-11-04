import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";

interface ConfirmationDialogProps {}

const LoginDialog: React.FC<ConfirmationDialogProps> = ({}) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
    const naviate = useRouter();

  const click = (role: string) => () => naviate.push(`/auth/${role}/login`);
  return (
    <>
      <a onClick={open} className="nav-link cursor-pointer">Login</a>
      <Dialog open={isOpen} onClose={close}>
        <DialogTitle>Sign in as</DialogTitle>
        <DialogContent>
          <DialogContentText>
            
            <div className="row">
                <div className="col-6">
                    <Button onClick={click('client')} variant="outline" className="w-100">Client</Button>
                </div>
                <div className="col-6">
                    <Button onClick={click('lawyer')} variant="outline" className="w-100">Lawyer</Button>
                </div>
                <div className="col-6 mt-3">
                    <Button onClick={click('expert')} variant="outline" className="w-100">Legal Expert</Button>
                </div>
                <div className="col-6 mt-3">
                    <Button onClick={click('admin')} variant="outline" className="w-100">Admin</Button>
                </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginDialog;
