"use client";

import React, { useEffect } from "react";
import "../../../client/client.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert } from "@mui/material";
import { Spousal } from "@/types/Spousal";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const EstimateAssetDivision = ({ data }: { data: Spousal | undefined }) => {
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const [formData, setData] = useState<Spousal | null>();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "40");

  const searchParam = new URLSearchParams();
  searchParam.set("caseId", caseId);
  searchParam.set("progress", "60");

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [checked, setChecked] = React.useState(false);
  const [err, setErr] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };
  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/spousal/createSpousal",
        {
          caseId: caseId,
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
      router.push(`/client/spousal-support?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      setLoading(true);
      // if (
      //   data?.totalValue !=
      //   Number(data?.share) + Number(data?.spouseShare)
      // ) {
      //   // return handleClickOpen();
      //   openSnackbar({
      //     message:
      //       "The individual shares don&apos;t add up to the total marital assets. Please review your estimates.",
      //     type: "warning",
      //   });
      // }

      document
        .querySelectorAll<HTMLElement>(".spousal-submit-btn")
        .forEach((div: HTMLElement | null) => {
          if (div) {
            div.click();
          }
        });

      if (!checked) {
        return setErr(true);
      }

      const { data } = await axios.post(
        "/api/client/category/spousal/createSpousal",
        {
          caseId: caseId,
          checked,
          progress: 60,
          nextProgress: 60,
        }
      );

      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");

      router.push(`/client/spousal-support?${searchParam.toString()}`);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(data);
    setChecked(data?.checked ?? false);
    // setValues({
    // contractDate: data?.contractDate,
    // contractDuration: data?.contractDuration?.toString(),
    // initialRent: data?.initialRent?.toString(),
    // });
  }, [data]);

  const clearForm = () => {
    setChecked(false);
    setData(null);
    // formData?.damagesCategory = [{ name: "", amount: "" }];
  };

  return (
    <div className="review-form mt-5 spouse">
      <h3 className="f-22 bold mt-4  gray">
        Review Your Information and Estimate Asset Division
      </h3>
      <p className="f-14 mb-2 pb-3">
        Please review your information below carefully before submitting. Make
        sure all the information is correct.
      </p>
      <h4 className="f-18 bold mb-2">General Information</h4>
      <p className="f-14 gray emp-flex mb-1">
        <span className="f-14  left">Your Role: </span>{" "}
        <span className="right text-capitalize">{data?.describe ?? "NA"}</span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Length of Marriage (years): </span>{" "}
        <span className="right">{data?.years + " " + "years"} </span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Total Value of Marital Assets: </span>{" "}
        <span className="right">{data?.totalValue ?? "NA"}</span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Pre-Marital Joint Property: </span>{" "}
        <span className="right">No</span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Temporary Spousal Support: </span>{" "}
        <span className="right">No</span>
      </p>
      <h3 className="f-18 pb-2 bold pt-4">Your Information</h3>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14 left">Age:</span>{" "}
        <span className="right">{data?.age + " " + "Years"} </span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Health Status:</span>{" "}
        <span className="right">{data?.health ?? "NA"} </span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Annual Income:</span>{" "}
        <span className="right">{data?.income + " " + "€"} </span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Retirement Status:</span>{" "}
        <span className="right text-capitalize">{data?.retired ?? "NA"} </span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Separate Property:</span>{" "}
        <span className="right">No </span>
      </p>

      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">
          Joint Ownership with Others (Not Spouse):
        </span>{" "}
        <span className="right">No </span>
      </p>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Your Share of Marital Assets:</span>{" "}
        <span className="right">{data?.share ?? "NA"} % </span>
      </p>
      <h3 className="f-18 pb-2 bold pt-4">Your Spouse&apos;s Information</h3>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Age: </span>{" "}
        <span className="right">
          {" "}
          {data?.spouseAge + " " + "Years"}{" "}
        </span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14  left">Health Status: </span>{" "}
        <span className="right text-capitalize">
          {data?.spouseHealth ?? "NA"}
        </span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14  left">Annual Income: </span>{" "}
        <span className="right">{data?.spouseIncome + " " + "€"}</span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14  left">Retirement Status: </span>{" "}
        <span className="right text-capitalize">
          {" "}
          {data?.spouseRetired ?? "NA"}{" "}
        </span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14  left">Separate Property: </span>{" "}
        <span className="right">No</span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14  left">
          Joint Ownership with Others (Not You):{" "}
        </span>{" "}
        <span className="right">No</span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14  left">
          Spouse&apos;s Share of Marital Assets:{" "}
        </span>{" "}
        <span className="right">{data?.spouseShare ?? "NA"} %</span>
      </p>

      <h3 className="f-18 pb-2 bold pt-4">Asset Division Estimator</h3>
      <p className="f-14 gray mb-1 emp-flex">
        <span className="f-14  left">Total Value of Marital Assets: </span>{" "}
        <span className="right"> {data?.totalValue ?? "NA"} </span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14 left">Your Estimated Share: </span>{" "}
        <span className="right">{data?.share ?? "NA"} %</span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14  left">Your Spouse&apos;s Estimated Share: </span>{" "}
        <span className="right">{data?.spouseShare ?? "NA"} %</span>
      </p>
      <p className="f-14 gray  mb-1 emp-flex">
        <span className="f-14  left">Calculated Total: </span>{" "}
        <span className="right">
          {Number(data?.share) + Number(data?.spouseShare) ?? "0"} %
        </span>
      </p>

      <div className="checkbox-review consent pt-3 mb-4">
        <label className="f-15">Consent</label>
        <div className="mb-3  radio-end-input f-13">
          <FormGroup>
            <FormControlLabel
              className="radio-light-ip"
              control={<Checkbox checked={checked} onChange={handleChange} />}
              label=" I confirm that the information I have provided is accurate to the best of my knowledge, and I consent to the terms of the [Privacy Policy]."
            />
          </FormGroup>
        </div>
        {err && (
          <span className="text-danger mt-0">
            Please confirm your consent before submitting
          </span>
        )}
      </div>

      <div className="col-12 text-center mt-4">
        <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
          <Button
            variant="contained"
            className="green-btn"
            size="lg"
            onClick={() => handlePrevious()}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            size="lg"
            className="green-btn"
            onClick={() => {
              if (
                data?.totalValue !=
                Number(data?.share) + Number(data?.spouseShare)
              ) {
                // return handleClickOpen();
                openSnackbar({
                  message:
                    "The individual shares don&apos;t add up to the total marital assets. Please review your estimates.",
                  type: "warning",
                });
              }
              handleNext();
            }}
          >
            <span className="f-16">Next</span>
          </Button>
          {/* <Button
            type="submit"
            variant="outline"
            size="lg"
            className="green-border f-16"
          >
            <span className="f-16">Edit</span>
          </Button> */}
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <p className="f-15 gray bold text-center">
            The individual shares don&apos;t add up to the total marital assets.
            Please review your estimates.
          </p>
        </DialogContent>
        <DialogActions className="justify-content-center pb-4">
          <Button
            variant="primary"
            onClick={() => {
              setOpenDialog(false);
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EstimateAssetDivision;
