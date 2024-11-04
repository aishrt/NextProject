"use client";

import React, { useEffect, useState } from "react";
import "../../expert/expert.css";
import lock from "@/assets/lockbg.png";
import success from "@/assets/congo.png";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
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
import transfer from "@/assets/transfer.png";
import { InputField } from "@/components/Form/InputField";

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
import { z } from "zod";

type FormValues = {
  commission: string;
};

const schema = z.object({
  commission: z
    .string({
      required_error: "Percentage is required",
    })
    .min(1, "Percentage is required")
    .refine(
      (val) => {
        const percnt = parseInt(val, 10);
        return !isNaN(percnt) && percnt >= 0 && percnt <= 100;
      },
      {
        message: "Percentage should be between 0 and 100",
      }
    )
    .transform((value) => parseInt(value, 10)),
});
export default function FinancialTerms({
  report,
  role,
}: {
  report: Financial | undefined;
  role: string;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [status, setStatus] = useState<string>("");
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
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [show, setShow] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [err, setErr] = useState<boolean>(false);
  const [signErr, setSignErr] = useState<boolean>(false);

  const [verifyReport, setChecked] = useState(report?.verifyReport ?? false);

  const [signature, setSignature] = useState<string | null>();
  const [lawyerSignature, setLawyerSignature] = useState<string | null>();
  const [general, setGeneralData] = useState<General>();
  const [load, setLoad] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [ModeLoader, setModelLoader] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const handleHide = () => {
    setShow(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const handleClick = () => {
    if (!verifyReport) {
      return setErr(true);
    }
    if (role == "expert" && !signature) {
      return setSignErr(true);
    }
    if (role == "lawyer" && !lawyerSignature) {
      return setSignErr(true);
    }
    setModelLoader(true);
    // setOpenDialog(false);
    // setLoad(true);
    axios
      .post("/api/financial-report/add", {
        case_id,
        lawyerManagerSignature: signature,
        lawyerSignature,
        verifyReport,
      })
      .then((res: any) => {
        setModelLoader(false);
        setOpenDialog(false);
        if (res?.status == 200) {
          {
            role == "expert" && setShow(true);
          }

          if (role == "lawyer" && status == "accept") {
            console.log("hellooooooo");

            // setLoad(true);
            UpdateReportStatus("accepted");
          }
        }
        setLoad(false);
      });
  };
  useEffect(() => {
    if (role == "expert" && signature) {
      setSignErr(false);
    }

    if (role == "lawyer" && lawyerSignature) {
      setSignErr(false);
    }
  }, [signature, lawyerSignature]);

  useEffect(() => {
    if (report) {
      setChecked(report?.verifyReport);
      setSignature(report?.lawyerManagerSignature);
      setLawyerSignature(report?.lawyerSignature);
    }
    getFile();
  }, [report]);

  const UpdateReportStatus = (status: any) => {
    axios
      .post("/api/lawyer/report", {
        status: status,
        requestId: report?.request?._id,
      })
      .then((res: any) => {
        if (res?.success) {
          setOpenDialog(false);
          setModelLoader(false);
          openSnackbar({
            message: `Claim ${status} successfuly !`,
            type: "success",
          });
          status == "accepted"
            ? router.push(`/lawyer/cases-list?type=litigation`)
            : router.push(`/lawyer/dashboard`);
        }
      })
      .catch((err: any) => {
        console.log(err);
        openSnackbar({
          message: err?.response?.data?.message,
          type: "error",
        });
      });
  };

  const getFile = () => {
    axios.get("/api/admin/general").then((res: any) => {
      if (res?.success) {
        setGeneralData(res?.data);
      }
    });
  };

  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    setLoading(true);
    handleClick();

    const payload = {
      counterAmount: values.commission,
      requestId: report?.request?._id,
    };
    axios
      .post("/api/lawyer/counter-offer", payload)
      .then((res: any) => {
        if (res?.success) {
          setValues({ commission: "" });
          openSnackbar({
            message: res?.message,
            type: "success",
          });
          router.push(`/lawyer/case-requests`);
        }
      })
      .catch((err: any) => {
        console.log(err);
        openSnackbar({
          message: err?.response?.data?.message,
          type: "error",
        });
      })
      .finally(() => {
        setOpen(false);
        setLoading(false);
      });
  };

  return (
    <div className="financial-terms mt-4">
      <ConfirmationDialog
        open={openDialog}
        title="Report Confirmation"
        message={`Are you sure you want to ${status} this report? This action cannot be undone.`}
        loading={ModeLoader}
        onConfirm={() => {
          if (status == "accept") {
            handleClick();
          }
          if (status == "reject") {
            setModelLoader(true);
            UpdateReportStatus("rejected");
          }
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
              control={<Checkbox checked={verifyReport} />}
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

          {report?.request?.status !== "rejected" && (
            <div className="col-12 col-md-4">
              <label className="form-check-label mb-2">Lawyer Signature</label>
              {lawyerSignature ? (
                <div className="manager-sign lawyer">
                  <img src={lawyerSignature} className="signature-preview" />
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
            {role == "expert" && !report?.lawyerManagerSignature && (
              <DigitalSignature setSignature={setSignature} />
            )}

            {role == "lawyer" &&
              !report?.lawyerSignature &&
              report?.request?.status !== "rejected" && (
                <DigitalSignature setSignature={setLawyerSignature} />
              )}
          </div>
          <div className="col-12 col-md-2">
            {role == "expert" && !report?.lawyerManagerSignature && (
              <Button
                className="expert-btn"
                onClick={() => {
                  setSignature(null);
                }}
              >
                Clear
              </Button>
            )}
            {role == "lawyer" &&
              !report?.lawyerSignature &&
              report?.request?.status !== "rejected" && (
                <Button
                  className="expert-btn"
                  onClick={() => {
                    setLawyerSignature(null);
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
            disabled={report?.lawyerFinancialReport ? true : false}
            className="load-btn px-5"
            variant="contained"
            onClick={handleClick}
          >
            {report?.lawyerFinancialReport ? "Report Sent" : "Send Report"}
          </LoadingButton>
        )}

        {role == "lawyer" && report?.request?.status == "pending" && (
          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <LoadingButton
                // loading={load}
                className="load-btn"
                variant="contained"
                onClick={() => {
                  if (role == "lawyer" && !lawyerSignature) {
                    return setSignErr(true);
                  }
                  setOpenDialog(true);
                  setStatus("accept");
                }}
              >
                Accept
              </LoadingButton>

              <LoadingButton
                className="load-btn"
                variant="contained"
                onClick={() => {
                  setOpenDialog(true);
                  setStatus("reject");
                  // setClaimShow(true);
                }}
              >
                Reject
              </LoadingButton>

              <LoadingButton
                className="load-btn"
                variant="contained"
                onClick={() => {
                  if (role == "lawyer" && !lawyerSignature) {
                    return setSignErr(true);
                  }
                  setOpen(true);
                }}
              >
                Counter Offer
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
                  Reports have been sent to the lawyer succesfully!
                </p>
              </div>
              <div className="text-center mt-4 pb-4">
                <Button
                  variant="contained"
                  className="expert-btn px-5"
                  onClick={() => {
                    setShow(false);
                    router.push(`/expert/litigation-lawyers`);
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
        open={open}
        onClose={handleClose}
        className="assgn-lawyr-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={(theme: any) => ({
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
          <div className="row assign-lawyer-modal align-items-center">
            <div className="col-12 col-md-6 col-lg-7">
              <div className="assign-law-card rounded border p-4">
                <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
                  <div className="row mt-4">
                    <div className="col-12 col-md-12">
                      <div className="row">
                        <div className="col-12">
                          <div className="law-input">
                            <InputField
                              error={formState.errors["commission"]}
                              label="Commission earned on winning"
                              placeholder="Enter the commission"
                              name="commission"
                              control={control}
                              type="number"
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <LoadingButton
                            loading={loading}
                            type="submit"
                            variant="contained"
                            className=""
                          >
                            Send
                          </LoadingButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-5">
              <div className="text-center">
                <Image src={transfer} className="assign-trf" alt="" />
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
