// src/app/submit-document/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
import { useSession } from "next-auth/react";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";

import LoadingButton from "@mui/lab/LoadingButton";
import SelectField from "@/components/Form/SelectField";
import { z } from "zod";
import { InputField } from "@/components/Form/InputField";
import TextAreaField from "@/components/Form/TextArea";

type FormValues = {
  description: string;
  transactionId: string;
  fundAmount: string;
  case_id: string;
};
const schema = z.object({
  transactionId: z
    .string({ required_error: "Transaction ID is required" })
    .min(1, "Transaction ID is required"),
  fundAmount: z
    .string({ required_error: "Fund Amount is required" })
    .min(1, "Fund Amount is required"),
  case_id: z.string({ required_error: "Case ID id required" }),
  description: z.string().optional(),
});
const AddFundForm = ({ isQuitense, id, isLitigation }: any) => {
  const [title, setTitle] = useState("");
  const { data: session } = useSession();
  const [cases, setCases] = useState<any[]>([]);
  const fetchCases = async () => {
    const res = await axios.get("/api/cases");
    setCases(res?.data);
  };
  const role = session?.user?.role;
  const [description, setDescription] = useState("");
  const [form, setform] = useState({ category: "" });
  const [documentFile, setDocumentFile]: any = useState<File | null>(null);
  const router = useRouter();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      await axios.post(`/api/fund`, values).then((res: any) => {
        if (res?.success) {
          openSnackbar({ message: "Fund added successfully", type: "success" });
          setLoading(false);
          if (isQuitense == "true") {
            return router.push(`/lawyer/quitense?case_id=${id}&isFund=true`);
          }
          if (isLitigation == "true") {
            return router.push(
              `/lawyer/litigation-case-complete?case_id=${id}&isFund=true`
            );
          }
          router.push(`/${role}/funds`);
        }
        setLoading(false);
      });
    } catch (err: any) {
      console.error("Error adding document:", err);
      openSnackbar({
        message: err?.message ?? "Failed to add document",
        type: "error",
      });
    }
  };
  useEffect(() => {
    fetchCases();
  }, [session]);
  const options = [
    { label: "Personal Document", value: "personal" },
    { label: "Proof of Identity", value: "identity" },
    { label: "Communication to Read", value: "communication" },
    { label: "Proof of Damage", value: "damage" },
  ];

  useEffect(() => {
    if (id) {
      methods.setValue("case_id", id);
      methods.clearErrors("case_id");
    }
  }, [id]);

  return (
    <div className="main-content submit-new indivi-form  mt-4">
      <h2 className="f-26 fw-500 pb-3">Add Fund</h2>
      <div className="white-card p-4 rounded">
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            {!id && (
              <div className="col-12 col-md-6 mt-3  represent-form">
                <label>Select Case</label>
                <SelectField
                  error={formState.errors["case_id"]}
                  label=""
                  name="case_id"
                  className="assigneed-roel"
                  options={cases.map((c) => ({
                    value: c._id,
                    label: `#${c.referenceId?.toString()}`,
                  }))}
                  control={control}
                />
              </div>
            )}
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["fundAmount"]}
                label="Fund Amount"
                name="fundAmount"
                type="number"
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["transactionId"]}
                label="Transaction ID"
                name="transactionId"
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <TextAreaField
                error={formState.errors["description"]}
                label="Description"
                placeholder="Description"
                name="description"
                className="bglight-ip rounded w-100 form-control"
                control={control}
              />
            </div>
          </div>
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            size="large"
          >
            <span>Add</span>
          </LoadingButton>
        </Form>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
};

export default AddFundForm;
