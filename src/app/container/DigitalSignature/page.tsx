"use client";
import React, { useRef, useState } from "react";
import { styled } from "@mui/system";
import {
  Button,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  SlideProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SignatureCanvas from "react-signature-canvas";

// Styled components using @mui/system
const AppBarStyled = styled(AppBar)(({ theme }) => ({
  position: "relative",
}));

const Title = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flex: 1,
}));

const Transition = React.forwardRef(function Transition(
  props: SlideProps,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
interface DigitalSignatureProps {
  setSignature: (signature: string) => void;
}

export default function DigitalSignature({
  setSignature,
}: DigitalSignatureProps) {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const clear = () => {
    sigCanvas?.current?.clear();
  };

  const save = () => {
    const sign =
      sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png") || "";
    setSignature(sign);
    console.log(sigCanvas);
    handleClose();
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        // style={{ marginBottom: "34px" }}
        onClick={handleClickOpen}
      >
        Add Digital Signature
      </Button>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBarStyled>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Title variant="h6">Please sign here</Title>
            <Button autoFocus color="inherit" onClick={save}>
              Save
            </Button>
            <Button autoFocus color="inherit" onClick={clear}>
              Clear
            </Button>
          </Toolbar>
        </AppBarStyled>
        <SignatureCanvas
          penColor="black"
          canvasProps={{
            className: "sigCanvas",
            style: { border: "1px solid #000", borderRadius: "4px" },
          }}
          ref={sigCanvas}
        />
      </Dialog>
    </div>
  );
}
