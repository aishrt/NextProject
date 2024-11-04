"use client";

import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import "../../expert/expert.css";
import lock from "@/assets/lockbg.png";
import success from "@/assets/congo.png";
import Image from "next/image";
import { Button } from "@/components/Form/Button";

import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Link,
  useMediaQuery,
  useTheme,
  Alert,
  Snackbar,
} from "@mui/material";
import up from "@/assets/up.png";
import CloseIcon from "@mui/icons-material/Close";
import DigitalSignature from "@/app/container/DigitalSignature/page";
// import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Financial } from "@/types/Financial";
import LoadingButton from "@mui/lab/LoadingButton";
import claim1 from "@/assets/claim1.png";
import purchase from "@/assets/purchase.png";
import useSnackbar from "@/hooks/useSnackbar";
import ConfirmationDialog from "@/components/Form/ConfirmationDialogue";
import { axios } from "@/utils/axios";
import { General } from "@/types/General";

export default function FinancialTerms({
  report,
  role,
}: {
  report: Financial | undefined;
  role: string;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const getBaseURL = () => {
    return `${process.env.NEXT_PUBLIC_PDF_URL}/uploads`;

    if (window.location.hostname == "localhost") {
      return "/uploads";
    } else {
      return "/api/file";
    }
  };
  const router = useRouter();
  const param = useSearchParams();
  const case_id = param && param.get("id");
  const [show, setShow] = React.useState(false);
  const [err, setErr] = useState<boolean>(false);
  const [signErr, setSignErr] = useState<boolean>(false);

  const [checked, setChecked] = useState(report?.checked ?? false);

  const [signature, setSignature] = useState<string | null>();
  const [clientSignature, setClientSignature] = useState<string | null>();
  const [general, setGeneralData] = useState<General>();
  const [load, setLoad] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [showClaim, setClaimShow] = useState<boolean>(false);
  const [showPurchase, setPurchaseShow] = React.useState(false);
  const [ModeLoader, setModelLoader] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleHide = () => {
    setShow(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const handleClick = () => {
    if (!checked) {
      return setErr(true);
    }
    if (role == "expert" && !signature) {
      return setSignErr(true);
    }
    if (role == "client" && !clientSignature) {
      return setSignErr(true);
    }
    setModelLoader(true);
    // setOpenDialog(false);
    setLoad(true);
    axios
      .post("/api/financial-report/add", {
        case_id,
        managerSignature: signature,
        clientSignature,
        checked,
      })
      .then((res: any) => {
        setModelLoader(false);
        setOpenDialog(false);
        if (res?.status == 200) {
          {
            role == "expert" && setShow(true);
          }

          if (role == "client") {
            setLoad(true);
            UpdateReportStatus(report?.reportId, "accept");
          }
        }
        setLoad(false);
      });
  };
  useEffect(() => {
    if (role == "expert" && signature) {
      setSignErr(false);
    }

    if (role == "client" && clientSignature) {
      setSignErr(false);
    }
  }, [signature, clientSignature]);

  useEffect(() => {
    if (report) {
      setChecked(report?.checked);
      setSignature(report?.managerSignature);
      setClientSignature(report?.clientSignature);
    }

    getFile();
  }, [report]);

  const UpdateReportStatus = (id: any, status: any) => {
    axios
      .post("/api/report", { report_id: id, status: status })
      .then((res: any) => {
        if (res?.success) {
          openSnackbar({
            message: `Claim ${status}ed successfuly !`,
            type: "success",
          });
          router.push(`/client/claim-evaluation-report-list`);
        }
      });
  };

  const getFile = () => {
    axios.get("/api/admin/general").then((res: any) => {
      if (res?.success) {
        setGeneralData(res?.data);
      }
    });
  };

  return (
    <div className="financial-terms mt-4">
      <ConfirmationDialog
        open={openDialog}
        title="Report Confirmation"
        message="Are you sure you want to Accept this report? This action cannot be undone."
        loading={ModeLoader}
        onConfirm={() => {
          setOpenDialog(false);
          handleClick();

          // AssignLawyer(activeLawyerId);
        }}
        onCancel={() => setOpenDialog(false)}
      />
      <div className="white-card p-4 evaluation-report mt-4">
        {role == "expert" && (
          <>
            <h4 className="f-16 semi-bold">Terms and Conditions</h4>
            <p className="f-14 gray">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.{" "}
            </p>
            <FormControlLabel
              control={<Checkbox checked={checked} />}
              label="I verify the above information"
              onChange={(e: any) => handleChange(e)}
            />
          </>
        )}
        {err && <p className="text-danger">Please verify</p>}

        <h4 className="f-18 semi-bold">Digital Signature</h4>

        <div className="sign-upload row mb-4 align-items-end">
          <div className="col-12 col-md-4">
            <label className="form-check-label mb-2">
              Case Manager Signature
            </label>
            {signature ? (
              <div className="manager-sign">
                <img src={signature} className="signature-preview" />
              </div>
            ) : (
              <div className="manager-sign"></div>
            )}
          </div>

          {report?.reportStatus !== "reject" && (
            <div className="col-12 col-md-4">
              <label className="form-check-label mb-2">Client Signature</label>
              {clientSignature ? (
                <div className="manager-sign lawyer">
                  <img src={clientSignature} className="signature-preview" />
                </div>
              ) : (
                <div className="manager-sign lawyer"></div>
              )}
            </div>
          )}
        </div>

        <div className="row  mb-4 ">
          {signErr && <p className="text-danger">Please add signature</p>}{" "}
          <div className="col-12 col-md-2">
            {role == "expert" && !report?.managerSignature && (
              <DigitalSignature setSignature={setSignature} />
            )}

            {role == "client" &&
              !report?.clientSignature &&
              report?.reportStatus !== "reject" && (
                <DigitalSignature setSignature={setClientSignature} />
              )}
          </div>
          <div className="col-12 col-md-2">
            {role == "expert" && !report?.managerSignature && (
              <Button
                className="expert-btn"
                onClick={() => {
                  setSignature(null);
                }}
              >
                Clear
              </Button>
            )}
            {role == "client" &&
              !report?.clientSignature &&
              report?.reportStatus !== "reject" && (
                <Button
                  className="expert-btn"
                  onClick={() => {
                    setClientSignature(null);
                  }}
                >
                  Clear
                </Button>
              )}
          </div>
        </div>
        {role == "expert" && (
          <LoadingButton
            loading={load}
            disabled={report?.isFinancialReport ? true : false}
            className="load-btn px-5"
            variant="contained"
            onClick={handleClick}
          >
            {report?.isFinancialReport ? "Report Sent" : "Send Report"}
          </LoadingButton>
        )}

        {role == "client" && report?.reportStatus == "pending" && (
          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              {/* <Button
                variant="contained"
                className="expert-btn"
                size="lg"
                onClick={handleClick}
              >
                Accept
              </Button> */}

              <LoadingButton
                loading={load}
                className="load-btn"
                variant="contained"
                onClick={() => {
                  if (role == "client" && !clientSignature) {
                    return setSignErr(true);
                  }
                  setOpenDialog(true);
                }}
              >
                Accept
              </LoadingButton>

              <LoadingButton
                className="load-btn"
                variant="contained"
                onClick={() => {
                  setClaimShow(true);
                }}
              >
                Reject
              </LoadingButton>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      <Dialog
        fullScreen={fullScreen}
        open={show}
        // onClose={handleHide}
        className="assgn-succes-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={handleHide}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            {/* <CloseIcon /> */}
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="assign-lawyer-success text-center">
            <div className="">
              <Image src={success} className="assign-trf-sucess" alt="image" />
              <div className="assign-law-cnt mt-4">
                <h4 className="f-24 semi-bold">Success!</h4>
                <p className="f-16 gray semi-bold">
                  {/* Your Graphs have been Created Sucessfully */}
                  Reports have been sent to the client succesfully!
                </p>
              </div>
              <div className="text-center mt-4 pb-4">
                <Button
                  variant="contained"
                  className="expert-btn px-5"
                  onClick={() => {
                    setShow(false);
                    router.push(`/expert/claim-evaluation-report-list`);
                  }}
                >
                  OK
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={showClaim}
        // onClose={handleHide}
        className="assgn-succes-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={() => setClaimShow(false)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="assign-lawyer-success text-center">
            <div className="">
              <Image src={claim1} className="assign-trf-sucess" alt="image" />
              <div className="assign-law-cnt mt-4">
                <h4 className="f-22 semi-bold">
                  Our offer doesn&apos;t satisfy you! Here&apos;s the evaluation
                  report how it looks.
                  <span>
                    <Link href={getBaseURL() + general?.file} target="_blank">
                      View evaluation report
                    </Link>
                  </span>
                </h4>
              </div>
              <div className="text-center mt-4 pb-4">
                <Button
                  className="expert-btn"
                  onClick={() => {
                    setClaimShow(false);
                    setPurchaseShow(true);
                  }}
                >
                  Purchase
                </Button>

                <Button
                  variant="outline"
                  className="ms-3 px-3"
                  onClick={() => {
                    setClaimShow(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
              <div className="text-center">
                <p
                  className="f-18 semi-bold dark text-decoration-underline"
                  onClick={() => {
                    UpdateReportStatus(report?.reportId, "reject");
                    setClaimShow(false);
                  }}
                >
                  Close Claim
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={showPurchase}
        // onClose={handleHide}
        className="assgn-succes-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={() => setPurchaseShow(false)}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="assign-lawyer-success text-center">
            <div className="">
              <Image src={purchase} className="assign-trf-sucess" alt="image" />
              <div className="assign-law-cnt mt-4">
                <h4 className="f-24 semi-bold">
                  You need to pay ${general?.price} for reports
                </h4>
              </div>
              <div className="text-center mt-4 pb-4">
                <LoadingButton
                  variant="contained"
                  className=""
                  loading={loading}
                  onClick={() => {
                    setLoading(true);
                    router.push(
                      `/client/payment?id=${report?.reportId}&amount=${general?.price}`
                    );
                  }}
                >
                  Pay Now
                </LoadingButton>

                <Button
                  variant="outline"
                  color="primary"
                  className="ms-3 px-3"
                  onClick={() => {
                    setPurchaseShow(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
}
