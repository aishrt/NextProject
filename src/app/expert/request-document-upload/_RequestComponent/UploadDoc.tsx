"use client";
import React, { useState } from "react";
import { Metadata } from "next";
import "../../../expert/expert.css";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Switch,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import exclaim from "@/assets/exclaim.png";
import { useRouter } from "next/navigation";
import RequestDocTable from "./RequestDocTable";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import { z } from "zod";
import DateField from "@/components/Form/DateField";
import TextAreaField from "@/components/Form/TextArea";
import SharedDoc from "./SharedDoc";

export const metadata: Metadata = {
  title: "Request Document Upload",
  description: "Generated by create next app",
};

type FormValues = {
  doc_name: string;
  doc_type: string;
  folder_id: string;
  date: string;
  days: string;
  describe: string;
  reminder: string;
  upload_doc: string;
};

const schema = z.object({
  doc_name: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please enter Document Name"
  ),

  date: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please enter date"
  ),

  name: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please select the name"
  ),
  lawyer: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please select the lawyer"
  ),
});
export default function UploadDoc() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [show, setShow] = useState(false);
  const router = useRouter();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const { formState, control } = methods;
  const handleClickShow = () => {
    setShow(true);
  };
  const handleHide = () => {
    setShow(false);
  };
  return (
    <div className="request-doc-upload upload">
      <div className="res-tabs pt-4">
        <div className="res-tabs-box d-flex gap-3 align-items-center mb-4">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link "
                id="prelitigation-tab"
                data-bs-toggle="tab"
                data-bs-target="#prelitigation"
                type="button"
                role="tab"
                aria-controls="prelitigation"
                aria-selected="false"
              >
                All
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="litigation-tab"
                data-bs-toggle="tab"
                data-bs-target="#litigation"
                type="button"
                role="tab"
                aria-controls="litigation"
                aria-selected="true"
              >
                Shared
              </button>
            </li>
          </ul>
          <Button
            className="rounded bg-white text-black text-capitalize px-4 py-2 f-15"
            onClick={handleClickShow}
          >
            Add New
          </Button>
        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade "
            id="prelitigation"
            role="tabpanel"
            aria-labelledby="prelitigation-tab"
          >
            <div className="doc-requets">
              <div className="res-table-box">
                <div className="table-responsive mt-4">
                  <RequestDocTable />
                </div>
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade show active"
            id="litigation"
            role="tabpanel"
            aria-labelledby="litigation-tab"
          >
            <div className="doc-requets">
              <div className="row">
                <div className="col-12">
                  <SharedDoc />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*  Modal */}
        <Dialog
          fullScreen={fullScreen}
          open={show}
          onClose={handleHide}
          className="assgn-succes-modal request-modal"
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
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div className="assign-lawyer-success text-center">
              <div className="">
                <div className="assign-law-cnt ">
                  <h4 className="f-24 semi-bold pb-3">Upload Document</h4>
                  <Form<FormValues>
                    onSubmit={async (values: any) => {
                      alert("Abc");
                    }}
                    methods={methods}
                  >
                    <div className="row mt-4">
                      <div className="col-12 col-md-12">
                        <div className="row">
                          <div className="col-12 col-md-12 mb-3">
                            <div className="request-input">
                              <InputField
                                type="text"
                                error={formState.errors["doc_name"]}
                                label="Document name"
                                placeholder="Document name"
                                name="doc_name"
                                variant="filled"
                                className="filter-ip"
                                control={control}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-12 mb-3">
                            <div className="request-input">
                              <InputField
                                type="text"
                                error={formState.errors["doc_type"]}
                                label="Document type"
                                placeholder="Document type"
                                name="doc_type"
                                variant="filled"
                                className="filter-ip"
                                control={control}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-12 mb-3">
                            <div className="request-input">
                              <InputField
                                type="text"
                                error={formState.errors["folder_id"]}
                                label="Folder/Case ID"
                                placeholder="Folder/Case ID"
                                name="folder_id"
                                variant="filled"
                                className="filter-ip"
                                control={control}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-12 mb-3">
                            <div className="request-input date">
                              <label>Valid Till</label>
                              <DateField
                                error={formState.errors["date"]}
                                label="Valid Till"
                                name="date"
                                variant="filled"
                                className="filter-ip"
                                control={control}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-12 mb-3">
                            <div className="request-input">
                              <InputField
                                type="text"
                                error={formState.errors["days"]}
                                label="Day to Complete"
                                placeholder="Day to Complete"
                                name="days"
                                variant="filled"
                                className="filter-ip"
                                control={control}
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-12 mb-3">
                            <div className="filter-input text-left">
                              <TextAreaField
                                name="describe"
                                placeholder="Description"
                                label="Description"
                                error={formState.errors["describe"]}
                                control={control}
                                variant="filled"
                                className="bg-desc w-100 border-0"
                              />
                            </div>
                          </div>
                          <div className="col-12 col-md-12 mb-3">
                            <div className="auto-reminders d-flex justify-content-between align-items-center">
                              <span className="f-14">Automatic Reminders</span>
                              <div className="d-flex align-items-center">
                                <Switch {...label} defaultChecked />
                                <Image
                                  src={exclaim}
                                  className="exclaim-icon"
                                  alt=""
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-12 col-md-12 mb-3">
                            <div className="request-input reminder-flex d-flex align-items-center gap-2">
                              <InputField
                                type="text"
                                error={formState.errors["reminder"]}
                                label="Send a reminder every"
                                placeholder="5"
                                name="reminder"
                                variant="filled"
                                className="filter-ip"
                                control={control}
                              />
                              <span className="days-count f-14">Days</span>
                            </div>
                          </div>
                          <div className="col-12 col-md-12 mb-3">
                            <div className="request-input">
                              <InputField
                                type="file"
                                error={formState.errors["upload_doc"]}
                                label="Upload Document"
                                placeholder=""
                                name="upload_doc"
                                variant="filled"
                                className="filter-ip"
                                control={control}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
                </div>
                <div className="text-center mt-4 pb-4">
                  <Button
                    variant="contained"
                    className="expert-btn px-5"
                    onClick={() => {
                      router.push(`/expert`);
                    }}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}