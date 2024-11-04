// src/app/submit-document/page.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, CircularProgress, TextField } from "@mui/material";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
import { useSession } from "next-auth/react";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";

import LoadingButton from "@mui/lab/LoadingButton";
import SelectField from "@/components/Form/SelectField";
import { z } from "zod";
import { InputField } from "@/components/Form/InputField";
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
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"),
  document: z
    .any()
    .refine((file: any) => file?.length !== 0, "File is required")
    .refine((file: any) => file?.size < MAX_FILE_SIZE, "Max size is 5MB.")
    .refine(
      (file: any) => checkFileType(file),
      "Only .pdf, .docx formats are supported."
    ),
  category: z
    .string({ required_error: "Category is required" })
    .min(1, "Category is required"),
  description: z
    .string().optional()
});
const AddDocumentForm = ({ params }: { params: any }) => {
  const [title, setTitle] = useState("");
  const { data } = useSession();
  const role = data?.user?.role;
  const [description, setDescription] = useState("");
  const [form, setform] = useState({ category: "" });
  const [documentFile, setDocumentFile]: any = useState<File | null>(null);
  const { openSnackbar } = useSnackbar();
  const router = useRouter();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentFile(e.target.files[0]);
      methods.clearErrors("document");
      methods.setValue("document", e.target.files[0]);
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", values?.title);
    formData.append("description", values?.description || "");
    formData.append("document", documentFile);
    formData.append("case_id", params.id);
    formData.append("category", values?.category);

    try {
      await axios.post(`/api/documents`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);

      openSnackbar({ message: "Document added successfully", type: "success" });
      router.push(`/${role}/case-documents/${params.id}`);
    } catch (err: any) {
      console.error("Error adding document:", err);
      openSnackbar({
        message: err?.message ?? "Failed to add document",
        type: "error",
      });
    }
  };
  const options = [
    { label: "Personal Document", value: "personal" },
    { label: "Proof of Identity", value: "identity" },
    { label: "Communication to Read", value: "communication" },
    { label: "Proof of Damage", value: "damage" },
  ];

  return (
    <div className="main-content submit-new indivi-form  mt-4">
      <h2 className="f-26 fw-500 pb-3">Submit New Document</h2>
      <div className="white-card p-4 rounded">
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="mb-3">
            <InputField
              label="Title"
              name="title"
              className="bglight-ip"
              control={control}
              error={formState.errors["title"]}
            />
          </div>
          <div className="mb-3 submit-txtarea">
            <TextField
              label="Description"
              className="bglight-ip p-0 border-0 rounded"
              fullWidth
              value={methods.getValues("description")}
              name="description"
              onChange={(e) => {
                methods.setValue("description", e.target.value);
              }}
              multiline
              rows={3}
            />
          </div>
          <div className="cat-select MuiFormControl-root MuiFormControl-fullWidth MuiTextField-root bglight-ip p-0 rounded mui-wb57ya-MuiFormControl-root-MuiTextField-root mb-3 MuiInputBase-root MuiOutlinedInput-root MuiInputBase-colorPrimary MuiInputBase-fullWidth MuiInputBase-formControl mui-wgwhib-MuiInputBase-root-MuiOutlinedInput-root">
            <SelectField
              error={formState.errors["category"]}
              label="Select Category"
              name="category"
              options={options}
              control={control}
            />
            {/* <select
              // required
              onChange={(e: any) =>
                setform({ ...form, category: e.target.value })
              }
              className="form-control MuiInputBase-input MuiOutlinedInput-input mui-1t8l2tu-MuiInputBase-input-MuiOutlinedInput-input"
              name=""
              id=""
            >
              <option value="">Select Category</option>
              {options?.map((itm: any, index: number) => {
                return (
                  <option key={index} value={itm?.value}>
                    {itm?.label}
                  </option>
                );
              })}
            </select> */}
          </div>
          <div className="mb-3">
            <input
              type="file"
              accept=".xlsx,.xls,image/*,.doc,.docx,.txt,.pdf"
              onChange={handleFileChange}
              className="form-control bglight-ip rounded"
            // required
            />
            {formState.errors["document"] && (
              <p className="text-danger">Document is required</p>
            )}
          </div>
          <LoadingButton
            onClick={() => {
              console.log(formState.errors);
            }}
            loading={loading}
            variant="contained"
            type="submit"
            size="large"
          >
            <span>Submit Document</span>
          </LoadingButton>
        </Form>
      </div>
    </div>
  );
};

export default AddDocumentForm;
