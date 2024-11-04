"use client";

import React, { useEffect, useState } from "react";
import "../../admin/admin.css";
import "./style.css";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { useSession } from "next-auth/react";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import { z } from "zod";
import Form from "@/components/Form/Form";
import SelectField from "@/components/Form/SelectField";
import LoadingButton from "@mui/lab/LoadingButton";
import { FormLabel } from "@mui/material";
import useSnackbar from "@/hooks/useSnackbar";

type FormValues = {
  title: string;
  description: string;
  category: string;
  caseType: string;
  validFor: number;
  role: string;
};

const schema = z.object({
  title: z.string({ required_error: "required" }).min(1, "Title is required"),
  role: z.string({ required_error: "required" }).min(1, "Role is required"),
  caseType: z
    .string({ required_error: "required" })
    .min(1, "Case Type is required"),
  description: z
    .string({ required_error: "required" })
    .min(1, "Document Name is required"),
  category: z
    .string({ required_error: "required" })
    .min(1, "Category is required"),
  validFor: z.coerce
    .number({ required_error: "Valid For is required" })
    .positive("Valid For must be greater than 0")
    .gt(0, "Valid For must be greater than 0"),
});

const AdminTaskForm = ({ taskId }: { taskId?: string }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setform] = useState({ isDocument: false });
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const { formState, control } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();
  const theme = useTheme();

  const Roles = [
    { value: "client", label: "Client" },
    { value: "expert", label: "Expert" },
    { value: "lawyer", label: "Lawyer" },
  ];

  const categories = [
    "Child support",
    "Non Competition",
    "Unfair Competition",
    "Eviction Compensation",
    "Judicial determination of rent",
    "Harassment",
    "Overtime Pay Claim",
    "Dismissal Assessment",
    "Dismissal null",
    "Bodily harm",
    "Compensatory allowance",
    "Sudden termination",
    "Civil service disciplinary sanctions",
    "Vexatious",
    "Other",
  ];

  const categoryOptions = categories.map((category) => ({
    label: category,
    value: category,
  }));

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const HandleSubmit = async (values: FormValues) => {
    setLoading(true);

    try {
      if (taskId) {
        // Update task if taskId exists
        await axios.put(`/api/admin/pre-tasks/${taskId}`, { ...values, isDocument: form?.isDocument });
        openSnackbar({ message: "Task updated successfully", type: "success" });
      } else {
        // Create a new task
        await axios.post(`/api/admin/pre-tasks`, { ...values, isDocument: form?.isDocument });
        openSnackbar({ message: "Task created successfully", type: "success" });
      }
      router.push("/admin/pre-tasks"); // Redirect to tasks list after form submission
    } catch (error) {
      openSnackbar({ message: "Failed to submit form", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Fetch task data if taskId exists (for edit mode)
  useEffect(() => {
    const fetchTask = async () => {
      if (taskId) {
        setDataLoading(false);
        try {
          const response = await axios.get(`/api/admin/pre-tasks/${taskId}`);
          const taskData = response.data.data;

          // Set form values with fetched task data
          setValues({
            title: taskData.title,
            description: taskData.description,
            validFor: taskData.validFor,
            category: taskData.category,
            role: taskData.role,
            caseType: taskData.caseType,
          });
          setform({ isDocument: taskData.isDocument });
        } catch (error) {
          openSnackbar({ message: "Failed to fetch task data", type: "error" });
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchTask();
  }, [taskId]);

  useEffect(() => {
    if (!taskId) {
      setValues({
        title: "",
        description: "",
        validFor: 0,
        category: "",
        role: "",
        caseType: "",
      });
    }
  }, [taskId]);

  if (dataLoading) {
    return <center>Loading...</center>;
  }

  return (
    <div className="white-card p-4 rounded indivi-form">
      <Form<FormValues> onSubmit={HandleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mt-3">
            <InputField
              error={formState.errors["title"]}
              label="Name"
              className="bglight-ip"
              name="title"
              control={control}
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <InputField
              label="Description"
              error={formState.errors["description"]}
              name="description"
              className="bglight-ip"
              control={control}
            />
          </div>
          <div className="col-12 col-md-6 mt-3 cat-select  ">
            <SelectField
              label="Case Category"
              options={categoryOptions}
              error={formState.errors["category"]}
              name="category"
              // className="bglight-ip"
              control={control}
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <InputField
              label="Valid For(days)"
              error={formState.errors["validFor"]}
              name="validFor"
              type="number"
              className="bglight-ip"
              control={control}
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <FormLabel id="demo-radio-buttons-group-label">
              Is Document required?
            </FormLabel>
            <label htmlFor="">
              Yes{" "}
              <input
                type="checkbox"
                name="isDocument"
                checked={form.isDocument === true}
                onChange={() => setform({ ...form, isDocument: true })}
              />
            </label>
            <label htmlFor="">
              No{" "}
              <input
                onChange={() => setform({ ...form, isDocument: false })}
                checked={form.isDocument === false}
                type="checkbox"
                name="isDocument"
              />
            </label>
          </div>
          <div className="col-12 col-md-6 mt-3 cat-select">
            <SelectField
              label="Role"
              options={Roles}
              error={formState.errors["role"]}
              name="role"
              // className="bglight-ip"
              control={control}
            />
          </div>
          <div className="col-12 col-md-6 mt-3 cat-select">
            <SelectField
              label="Case Type"
              options={[
                { value: "litigation", label: "Litigation" },
                { value: "preLitigation", label: "Pre-Litigation" },
              ]}
              error={formState.errors["caseType"]}
              name="caseType"
              // className="bglight-ip"
              control={control}
            />
          </div>
          <div className="col-12 col-md-6 mt-4 text-right">
            <LoadingButton
              loading={loading}
              variant="contained"
              type="submit"
              size="large"
            >
              <span>{taskId ? "Update" : "Create"}</span>
            </LoadingButton>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default AdminTaskForm;
