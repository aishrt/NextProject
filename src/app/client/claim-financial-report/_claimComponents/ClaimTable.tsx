"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import "../../../client/client.css";

import { Link, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";
import congo from "@/assets/congo.png";
import down from "@/assets/down.png";
import shared from "@/assets/shared.png";
import view from "@/assets/view.png";
import update from "@/assets/update.png";
import { Button } from "@/components/Form/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import TextAreaField from "@/components/Form/TextArea";
import { axios } from "@/utils/axios";
import { useSession } from "next-auth/react";
import moment from "moment";

type FormValues = {
  name: string;
  lawyer_name: string;
  email: string;
  phone: string;
  describe: string;
};

const schema = z.object({
  name: z.string().min(1, "Firm Name is required"),
  lawyer_name: z.string().min(1, "Lawyer Name is required"),
  email: z.string().min(1, "Email is required"),
  phone: z.string().min(1, "Phone Number is required"),
});
export const ClaimTable = () => {
  const { data: session, status } = useSession();
  const [page, setPage] = useState(1);
  const [TableData, setTabledata]: any = useState({});
  const theme = useTheme();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);
  const [congratulation, setCongratulation] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [cases, setCase] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  //   const { refetch, isLoading } = useCases({ page });
  //   const { data, refetch, isLoading } = useCategories({ page });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickShow = () => {
    setShow(true);
  };
  const handleClickCongo = () => {
    setCongratulation(true);
  };
  const handleClickSuccess = () => {
    setSuccess(true);
  };
  const handleClickCase = () => {
    setCase(true);
  };
  const staticData = [
    {
      ref_id: 1,
      case_id: "#49651587",
      registered_on: "19/04/24",
      category: "Financed Party",
      updated_on: "28/04/24",
      status: "",
      report: "",
      fin_report: "",
      action: "",
    },
    {
      ref_id: 1,
      case_id: "#49651587",
      registered_on: "19/04/24",
      category: "Financed Party",
      updated_on: "28/04/24",
      status: "",
      report: "",
      fin_report: "",
      action: "",
    },
  ];
  const handleClose = () => {
    setOpen(false);
  };
  const handleHide = () => {
    setShow(false);
  };
  const handleRemove = () => {
    setCongratulation(false);
  };
  const handleSuccess = () => {
    setSuccess(false);
  };
  const handleCase = () => {
    setCase(false);
  };
  console.log(session, "=====data");

  const GetReports = async () => {
    axios
      .get(`/api/financial-report/list?user_id=${session?.user?._id}`)
      .then((res: any) => {
        if (res?.status == 200) setTabledata(res);
      });
  };
  useEffect(() => {
    GetReports();
  }, [session]);
  return (
    <div>
      <Table<any>
        currentPage={TableData?.currentPage}
        totalEntries={TableData?.totalEntries}
        data={TableData?.data}
        clientPagination={false}
        columns={[
          { field: "ref_id", title: "Sr. No." },
          {
            field: "case_id",
            title: "Case ID",
            Cell({ entry: { case_id } }: any) {
              return <span>{case_id?.referenceId}</span>;
            },
          },
          {
            field: "registered_on",
            title: "Case Registered on",
            Cell({ entry: { case_id } }: any) {
              return (
                <span>{moment(case_id?.createdAt).format("DD-MMM-YYYYY")}</span>
              );
            },
          },
          {
            field: "category",
            title: "Category",
            Cell({ entry: { case_id } }: any) {
              return <span>{case_id?.category}</span>;
            },
          },
          {
            field: "updated_on",
            title: "Claim Evaluation Updated on",
            Cell({ entry: { updatedAt } }: any) {
              return <span>{moment(updatedAt).format("DD-MMM-YYYY")}</span>;
            },
          },
          {
            field: "status",
            title: "Status",
            Cell({ entry: { case_id } }) {
              return (
                <span className="pending-status">
                  {case_id?.isEvalReport ? "Completed" : "Pending"}
                </span>
              );
            },
          },
          {
            field: "report",
            title: "Evaluation Report",
            Cell({ entry: { case_id } }) {
              return (
                <>
                  {case_id?.isEvalReport ? (
                    <span>
                      <Link href={`/client/eval-report?id=${case_id?._id}`}>
                        <Tooltip title={"View Report"}>
                          <Image className="eva-report" src={update} alt="" />
                        </Tooltip>
                      </Link>
                    </span>
                  ) : (
                    <span className="pending-status">Pending</span>
                  )}
                </>
              );
            },
          },
          {
            field: "fin_report",
            title: "Financial Report",
            Cell({ entry: { case_id } }) {
              return (
                <>
                  {case_id?.isFinancialReport ? (
                    <span>
                      <Link
                        href={`/client/financial-report?id=${case_id?._id}`}
                      >
                        <Tooltip title={"View Report"}>
                          <Image className="eva-report" src={update} alt="" />
                        </Tooltip>{" "}
                      </Link>
                    </span>
                  ) : (
                    <span className="pending-status">Pending</span>
                  )}
                </>
              );
            },
          },
          {
            field: "action",
            title: "Action",
            Cell({ entry }) {
              return (
                <span className="action-table d-flex gap-2 align-items-center">
                  {/* <Link href="/"> */}
                  <span>
                    <Image src={down} alt="" className="" />
                  </span>
                  {/* </Link> */}
                  <span>
                    <Image src={view} alt="" className="" />
                  </span>
                  <Button
                    size="md"
                    className="btn bgdark bgClr rounded client-btn"
                    onClick={handleClickOpen}
                  >
                    Accept
                  </Button>
                </span>
              );
            },
          },
        ]}
      />
      {/* Select Lawyer */}
      <Dialog
        className="select-lawyr"
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <p className="f-22 text-black semi-bold text-center">Select Lawyer</p>
          <div className="d-flex justify-content-center select-lawyer gap-3 pb-4">
            <Button variant="contained" autoFocus onClick={handleClickShow}>
              Have own lawyer
            </Button>
            <Button variant="contained" autoFocus onClick={handleClickSuccess}>
              Hire Platform Lawyer
            </Button>
          </div>
        </DialogContent>
        <DialogActions className="justify-content-center">
          <Button variant="contained" size="lg" className="client-btn">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      {/* Having Own Lawyer */}
      <Dialog
        className="select-lawyr"
        fullScreen={fullScreen}
        open={show}
        onClose={handleHide}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <p className="f-22 text-black semi-bold text-center">Select Lawyer</p>
          <Form<FormValues>
            onSubmit={async (values) => {
              alert("Abc");
            }}
            methods={methods}
          >
            <div className="row mt-3">
              <div className="col-12 col-md-12 mt-3 mb-3">
                <InputField
                  type="text"
                  className="input-fill-gray"
                  placeholder="Firm Name"
                  error={formState.errors["name"]}
                  label="Firm Name"
                  name="name"
                  control={control}
                />
              </div>
              <div className="col-12 col-md-12 mt-3 mb-3">
                <InputField
                  type="text"
                  className="input-fill-gray"
                  placeholder="Lawyer Name"
                  error={formState.errors["lawyer_name"]}
                  label="Lawyer Name"
                  name="lawyer_name"
                  control={control}
                />
              </div>
              <div className="col-12 col-md-12 mt-3 mb-3">
                <InputField
                  type="email"
                  className="input-fill-gray"
                  placeholder="Email"
                  error={formState.errors["email"]}
                  label="Email"
                  name="email"
                  control={control}
                />
              </div>
              <div className="col-12 col-md-12 mt-3 mb-3">
                <InputField
                  type="number"
                  className="input-fill-gray"
                  placeholder="Phone Number"
                  error={formState.errors["phone"]}
                  label="Phone Number"
                  name="phone"
                  control={control}
                />
              </div>
            </div>
            <div className="text-center">
              <Button
                variant="contained"
                size="lg"
                className="client-btn"
                onClick={handleClickCongo}
              >
                Submit
              </Button>
            </div>
          </Form>
        </DialogContent>
        <DialogActions className="justify-content-center"></DialogActions>
      </Dialog>
      {/* Congratulations */}
      <Dialog
        className="select-lawyr"
        fullScreen={fullScreen}
        open={congratulation}
        onClose={handleRemove}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <div className="congratulation-icon">
            <Image className="mb-4" src={congo} alt="" />
          </div>
          <p className="text-center f-16 semi-bold">Congratulations</p>
        </DialogContent>
      </Dialog>

      {/* Shared Successfully */}
      <Dialog
        className="select-lawyr shared"
        fullScreen={fullScreen}
        open={success}
        onClose={handleSuccess}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <div className="congratulation-icon">
            <Image className="mb-4" src={shared} alt="" />
          </div>
          <p className="text-center f-16 semi-bold">
            Request has been shared successfully
          </p>
        </DialogContent>
      </Dialog>

      {/* Add Case Manager*/}
      <Dialog
        className="select-lawyr"
        fullScreen={fullScreen}
        open={cases}
        onClose={handleCase}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <p className="f-22 text-black semi-bold text-center">
            Add case manager details
          </p>
          <Form<FormValues>
            onSubmit={async (values) => {
              alert("Abc");
            }}
            methods={methods}
          >
            <div className="row mt-3">
              <div className="col-12 col-md-12 mt-3 mb-3">
                <InputField
                  type="email"
                  className="input-fill-gray"
                  placeholder="Email"
                  error={formState.errors["email"]}
                  label="Email"
                  name="email"
                  control={control}
                />
              </div>
              <div className="col-12 col-md-12 mt-3 mb-3">
                <TextAreaField
                  name="describe"
                  label="Description"
                  error={formState.errors["describe"]}
                  control={control}
                  variant="filled"
                  className="input-fill-gray"
                />
              </div>
            </div>
            <div className="text-center">
              <Button
                variant="contained"
                size="lg"
                className="client-btn"
                onClick={handleClickCongo}
              >
                Submit
              </Button>
            </div>
          </Form>
        </DialogContent>
        <DialogActions className="justify-content-center"></DialogActions>
      </Dialog>
    </div>
  );
};
