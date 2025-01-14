"use client";
import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import "../../expert/expert.css";
import place from "@/assets/placeholder.png";
import transfer from "@/assets/transfer.png";
import success from "@/assets/success.png";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { InputField } from "@/components/Form/InputField";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";
import IconButton from "@mui/material/IconButton";
// import { axios } from "@/utils/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { Alert, Snackbar } from "@mui/material";
import useSnackbar from "@/hooks/useSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { Cases } from "@/types/Cases";

type FormValues = {
  amount: number;
  commission: string;
};
const schema = z.object({
  amount: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please enter Amount"
  ),

  commission: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please enter commission"
  ),
});
export const metadata: Metadata = {
  title: "Assign Litigation Lawyers",
  description: "Generated by create next app",
};

export default function AssignLawyer() {
  const search = useSearchParams();
  const caseId = search?.get("case_id");
  const [activeLawyerIds, setActiveLawyerIds] = useState<string[]>([]);
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const theme = useTheme();
  const router = useRouter();
  const [LawyerData, setLawyerData] = useState([]);
  const [loading, setloading] = React.useState(false);
  const [load, setload] = React.useState(false);

  const [caseData, setCaseData] = React.useState<Cases>();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const lawyersList = [
    {
      id: "#2544664412",
      fullName: "Alec M. Thompson",
      legalExpertise: "Family(Divorce)",
      experience: "5 years",
    },
    {
      id: "#2544664413",
      fullName: "Jane D. Doe",
      legalExpertise: "Corporate Law",
      experience: "7 years",
    },
  ];

  const handleCardClick = (lawyerId: string) => {
    setActiveLawyerIds((value: any) => {
      const newArr = Array.isArray(value) ? value : [];
      const lawyers = newArr.includes(lawyerId)
        ? newArr.filter((item) => item !== lawyerId)
        : [...newArr, lawyerId];
      return lawyers;
    });
  };
  console.log(activeLawyerIds, "data");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickShow = () => {
    setShow(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleHide = () => {
    setShow(false);
  };

  const GetLaywers = async () => {
    try {
      // setloading(true);
      const res: any = await axios.get("/api/lawyer/list?page=1&count=10");
      setLawyerData(res?.data?.data);
    } finally {
      //setloading(false);
    }
  };

  const getCase = async () => {
    try {
      setloading(true);
      const res: any = await axios.get(
        `/api/client/case/get-case?caseId=${caseId}`
      );
      setCaseData(res?.data?.data);
    } finally {
      setloading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    console.log(values);
  };

  const assignLawyer = async () => {
    setload(true);
    axios
      .post("/api/expert/assign-cases", {
        caseId,
        lawyerIds: activeLawyerIds,
      })
      .then((res: any) => {
        setload(false);
        openSnackbar({
          message: res?.data?.message,
          type: "success",
        });
        router.push("/expert/litigation-lawyers");
      })
      .catch((err: any) => {
        console.log(err?.response?.data?.message);
        setload(false);

        openSnackbar({
          message: err?.response?.data?.message,
          type: "error",
        });
      });
  };
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  useEffect(() => {
    setloading(true);
    GetLaywers();
    if (caseId) {
      getCase();
    }
  }, [caseId]);

  const { formState, control } = methods;
  return (
    <div>
      <div className="liti-lawyers-list">
        <div className="d-flex justify-content-end mb-3">
          {caseData?.requestStatus == "accepted" ? (
            <Button variant="contained" className="expert-btn">
              Lawyer Assigned
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              className="text-capitalize"
              onClick={assignLawyer}
              loading={load}
              disabled={activeLawyerIds.length == 0 ? true : false}
            >
              Send Request{" "}
              {activeLawyerIds.length > 0
                ? "(" + activeLawyerIds.length + ")"
                : ""}
            </LoadingButton>
          )}
        </div>
        {loading ? (
          <p className="text-center mt-5">
            <CircularProgress />
          </p>
        ) : (
          <div className="row">
            {LawyerData?.map((lawyer: any) => (
              <div key={lawyer._id} className="col-12 col-md-6 mb-4">
                <div
                  className={`white-card litigate-lawyer p-4 ${
                    activeLawyerIds.includes(lawyer._id) ? "active" : ""
                  }`}
                  onClick={() => handleCardClick(lawyer._id)}
                >
                  <div className="row w-100 m-auto">
                    <div className="col-12 col-md-4 col-lg-3">
                      <Image src={place} className="lawyers-icon-case" alt="" />
                    </div>
                    <div className="col-12 col-md-8 col-lg-9">
                      <div className="bggray litigation-lawyer-box rounded p-4">
                        <div className="liti-lawyer-flex d-flex justify-content-between ">
                          <span className="f-14 semi-bold">Lawyer Id:</span>
                          <span className="f-14">
                            #{lawyer._id?.substr(0, 8)}
                          </span>
                        </div>
                        <div className="liti-lawyer-flex d-flex justify-content-between ">
                          <span className="f-14 semi-bold">Full Name:</span>
                          <span className="f-14">{lawyer.name}</span>
                        </div>
                        <div className="liti-lawyer-flex d-flex justify-content-between ">
                          <span className="f-14 semi-bold">
                            Legal Expertise:
                          </span>
                          <span className="f-14">{"Family(Divorce)"}</span>
                        </div>
                        <div className="liti-lawyer-flex d-flex justify-content-between ">
                          <span className="f-14 semi-bold">Expertise:</span>
                          <span className="f-14">{"5 years"}</span>
                        </div>
                      </div>
                      <div className="lawyer-btns mt-4 d-flex justify-content-end ">
                        {/* <Button
                        variant="contained"
                        className="expert-btn"
                        onClick={handleClickOpen}
                      >
                        Assign
                      </Button> */}
                        <Button variant="outline" className="expert-line-btn">
                          View More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Snackbar {...snackProps}>
          <Alert {...alertProps} />
        </Snackbar>
      </div>
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
                              type="number"
                              error={formState.errors["amount"]}
                              label="Case Amount"
                              placeholder="Case Amount"
                              name="amount"
                              variant="filled"
                              className="filter-ip"
                              control={control}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="law-input">
                            <InputField
                              type="text"
                              error={formState.errors["commission"]}
                              label="Commission earned  on winning "
                              placeholder="Write here"
                              name="commission"
                              variant="filled"
                              className="filter-ip"
                              control={control}
                            />
                          </div>
                        </div>
                        <div className="col-12">
                          <Button
                            type="submit"
                            variant="contained"
                            className="expert-btn"
                            onClick={handleClickShow}
                          >
                            Send
                          </Button>
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

      {/* Success Modal */}
      <Dialog
        fullScreen={fullScreen}
        open={show}
        onClose={handleHide}
        className="assgn-succes-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={handleHide}
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
          <div className="assign-lawyer-success text-center">
            <div className="">
              <Image src={success} className="assign-trf-sucess" alt="" />
              <div className="assign-law-cnt mt-4">
                <h4 className="f-32 semi-bold">Success!</h4>
                <p className="f-14 gray">
                  Lorem ipsum dolor sit amet, consectetur adipiscing
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
