"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import LoadingButton from "@mui/lab/LoadingButton";
import { InputField } from "@/components/Form/InputField";
import Form from "@/components/Form/Form";
import { z } from "zod";
import {
  Alert,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useHookForm } from "@/hooks/useHookForm";
import useSnackbar from "@/hooks/useSnackbar";
import { axios } from "@/utils/axios";
import { WEB_PORT } from "@/config/port";
import { Button } from "@/components/Form/Button";
import SelectField from "@/components/Form/SelectField";

type FormValues = {
  title: string;
  description: string;
  category: string;
  document: string;
};
const MAX_FILE_SIZE = 5000000;

const checkFileType = (file: any) => {
  if (file?.name) {
    const fileType = file.name.split(".").pop();
    if (
      fileType === "docx" ||
      fileType === "pdf" ||
      fileType === "png" ||
      fileType === "jpg" ||
      fileType === "jpeg"
    )
      return true;
  }
  return false;
};
const schema = z.object({
  title: z
    .string({ required_error: "Document Name is required" })
    .min(1, "Document Name is required"),
  category: z
    .string({ required_error: "Category is required" })
    .min(1, "Category is required"),
  document: z
    .any()
    .refine((file: any) => file?.length !== 0, "File is required")
    .refine((file: any) => file?.size < MAX_FILE_SIZE, "Max size is 5MB.")
    .refine(
      (file: any) => checkFileType(file),
      "Only .pdf, .docx formats are supported."
    ),
});

const TaskUpdateForm = ({
  data,
  case_id,
  task_id,
  isDocument,
  isUpdated,
}: {
  data?: any;
  case_id: any;
  task_id: any;
  isDocument: any;
  isUpdated?: boolean;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, document: file });
      methods.setValue("document", file);
      methods.clearErrors("document");
    }
  };
  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    // Create a FormData object to handle file and other fields
    const formData = new FormData();

    // Append the form fields to FormData
    formData.append("case_id", case_id);
    formData.append("category", values?.category);

    formData.append("task_id", task_id || "");
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("user_id", session?.user?._id || "");

    // Append the document if it exists
    if (form.document) {
      formData.append("document", form.document); // file field
    }

    try {
      // Send FormData to the API
      const res: any = await axios.post("/api/task/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required when sending FormData
        },
      });

      if (res?.success) {
        openSnackbar({ message: "Task updated successfully", type: "success" });
        router.back();
      } else {
        throw new Error("Task update failed");
      }
    } catch (err: any) {
      openSnackbar({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };
  const options = [
    { label: "Personal Document", value: "personal" },
    { label: "Proof of Identity", value: "identity" },
    { label: "Communication to Read", value: "communication" },
    { label: "Proof of Damage", value: "damage" },
  ];

  const handleCompleteTask = async () => {
    setLoading(true);

    // Create a FormData object
    const formData = new FormData();

    // Append the required fields to the FormData object
    formData.append("case_id", case_id);
    formData.append("task_id", task_id);
    formData.append("user_id", session?.user?._id || "");

    try {
      // Send form data as payload
      const res: any = await axios.post("/api/task/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure the correct content type is used
        },
      });

      if (res?.success) {
        openSnackbar({
          message: "Task completed successfully",
          type: "success",
        });
        router.back();
      } else {
        throw new Error("Task completion failed");
      }
    } catch (err: any) {
      openSnackbar({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmComplete = () => {
    setConfirmDialogOpen(false);
    handleCompleteTask();
  };

  const handleCancel = () => {
    setConfirmDialogOpen(false);
    router.back();
  };

  return (
    <>
      {" "}
      {isDocument == "false" ? (
        <>
          <div className="mt-4 p-4 rounded text-center">
            <div className="row  mx-2 mb-4 justify-content-center f-20 fw-500">
              {" "}
              Complete the task assigned assigned to you.{" "}
            </div>
            <LoadingButton
              variant="contained"
              onClick={() => setConfirmDialogOpen(true)}
              loading={loading}
            >
              Complete Task
            </LoadingButton>

            <Snackbar {...snackProps}>
              <Alert {...alertProps} />
            </Snackbar>

            <Dialog open={confirmDialogOpen} onClose={handleCancel}>
              <DialogTitle>Confirm Completion</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Do you really want to complete the status of this task?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <LoadingButton onClick={handleCancel} color="primary">
                  Cancel
                </LoadingButton>
                <LoadingButton
                  onClick={handleConfirmComplete}
                  color="primary"
                  loading={loading}
                >
                  Yes, Complete
                </LoadingButton>
              </DialogActions>
            </Dialog>
          </div>
        </>
      ) : (
        <>
          <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
            <div className="row mt-3">
              <div className="col-12 col-md-6 mt-3">
                <InputField
                  error={formState.errors.title}
                  label="Document Name"
                  name="title"
                  className="bglight-ip"
                  control={control}
                />
              </div>
              <div className="col-12 col-md-6 mt-3">
                <InputField
                  label="Description"
                  name="description"
                  control={control}
                  className="bglight-ip"
                />
              </div>
              <div className="col-12 col-md-6 mt-3">
                <SelectField
                  options={options}
                  label="Category"
                  name="category"
                  control={control}
                  error={formState.errors["category"]}
                />
              </div>

              {isUpdated && form.v1_document && (
                <div className="col-12 col-md-6 mt-3">
                  <label>Previous Document</label>
                  <iframe
                    src={`/public${form.v1_document}`}
                    style={{ width: "100%", height: "400px" }}
                  ></iframe>
                </div>
              )}

              <div className="col-12 col-md-6 mt-3">
                <label>Upload New Document</label>
                <input
                  accept=".xlsx,.xls,image/*,.doc,.docx,.txt,.pdf"
                  type="file"
                  className="bglight-ip rounded w-100 form-control  "
                  onChange={handleFileUpload}
                  required={isDocument == "false"}
                />
                {formState.errors["document"] && (
                  <p className="text-danger">Document is required</p>
                )}
              </div>

              <div className="col-12 col-md-12 mt-4 text-center">
                <LoadingButton
                  loading={loading}
                  className="client-btn"
                  variant="contained"
                  type="submit"
                >
                  Submit
                </LoadingButton>
              </div>
            </div>

            <Snackbar {...snackProps}>
              <Alert {...alertProps} />
            </Snackbar>
          </Form>
        </>
      )}
    </>
  );
};

export default TaskUpdateForm;
