"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../admin/admin.css";
import Link from "next/link";
import "./style.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useSession } from "next-auth/react";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import { z } from "zod";
import Form from "@/components/Form/Form";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, FormLabel, Snackbar } from "@mui/material";
import useSnackbar from "@/hooks/useSnackbar";
import { axios } from "@/utils/axios";
import DateField from "@/components/Form/DateField";

type FormValues = {
  title: string;
  description: string;
  category: string;
  submissionAt: string;
  validTill: string;
  case_id?: any;
  assignedToRole: string;
  isDocument: boolean;
};

const schema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"),
  assignedToRole: z
    .string({ required_error: "Assigned To Role is required" })
    .min(1, "Assigned To Role is required"),
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description is required")
    .optional(),
  category: z
    .string({ required_error: "Category is required" })
    .min(1, "Category is required"),
  submissionAt: z
    .string({ required_error: "Submission Date is required" })
    .min(1, "Submission Date is required"),
  validTill: z
    .string({ required_error: "Valid Till is required" })
    .min(1, "Valid Till is required"),
  case_id: z.string({ required_error: "Case is required" }),
  isDocument: z.boolean({
    required_error: "Document Confirmation is required",
  }),
});

const TaskForm = ({
  data,
  case_id,
  task_id,
  role,
}: {
  data: any;
  case_id?: any;
  task_id?: any;
  role?: any;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    isDocumentYes: false,
    isDocumentNo: false,
  });
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<any[]>([]);

  const { formState, control } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const theme = useTheme();
  const Roles = [
    { value: "client", label: "Client" },
    { value: "expert", label: "Expert" },
    { value: "lawyer", label: "Lawyer" },
  ];
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const fetchCases = async () => {
    const res = await axios.get("/api/cases");
    setCases(res.data);
  };
  useEffect(() => {
    if (!case_id || case_id == "null") {
      fetchCases();
    }
    if (case_id && case_id !== "null") {
      methods.setValue("case_id", case_id);
    }
  }, [case_id]);
  console.log(formState.errors);
  const HandleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      let url = "/api/task/add";
      if (task_id) {
        url = "/api/task/edit";
      }

      let assignedToUserId = "";

      if (values.assignedToRole === "lawyer") {
        const caseDetails = await axios.get(
          `/api/cases/${values?.case_id ?? case_id}`
        );
        assignedToUserId = caseDetails?.data?.lawyer;
        if (!caseDetails?.data?.lawyer) {
          openSnackbar({
            message:
              "No lawyer is assigned to this case. Please assign a lawyer first.",
            type: "error",
          });
          setLoading(false);
          return;
        }
      } else if (values.assignedToRole === "client") {
        const caseDetails = await axios.get(
          `/api/cases/${values?.case_id ?? case_id}`
        );
        assignedToUserId = caseDetails.data.user;
      } else if (values.assignedToRole === "expert") {
        const expert: any = await axios.get(`/api/expert/get`);
        assignedToUserId = expert?._id;
      }

      let value: any = {
        case_id: values?.case_id ?? case_id,
        title: values.title,
        description: values.description,
        category: values.category,
        submissionAt: values.submissionAt,
        validTill: values.validTill,
        isDocument: form.isDocumentYes,
        assignedBy: {
          userId: session?.user?._id,
          role: session?.user?.role,
        },
        assignedTo: {
          userId: assignedToUserId,
          role: values.assignedToRole,
        },
      };

      // if (task_id) {
      //   value = { ...value, task_id: task_id };
      // }

      axios
        .post(url, value)
        .then((res: any) => {
          if (res.success) {
            setLoading(false);
            openSnackbar({
              message: "Task created successfully",
              type: "success",
            });
            router.push(`/${role}/tasks`);
          }
          setLoading(false);
        })
        .catch((err: any) => {
          openSnackbar({ message: err?.message, type: "error" });
          setLoading(false);
        });
    } catch (err) {
    } finally {
    }
  };

  const TaskDetails = () => {
    axios.get(`/api/task/list?task_id=${task_id}`).then((res: any) => {
      if (res.status === 200) {
        setValues({
          case_id: res?.data?.data?.case_id,
          title: res?.data?.data?.title,
          description: res?.data?.data?.description,
          submissionAt: res?.data?.data?.submissionAt,
          category: res?.data?.data?.category,
          validTill: res?.data?.data?.validTill,
          assignedToRole: res?.data?.data?.assignedTo?.role,
        });
      }
    });
  };

  useEffect(() => {
    if (task_id) {
      TaskDetails();
    }
  }, [task_id]);

  useEffect(() => {
    if (!case_id) {
      setValues({
        title: "",
        description: "",
        submissionAt: "",
        validTill: "",
        category: "",
        assignedToRole: "",
      });
    }
  }, [case_id]);

  return (
    <Form<FormValues> onSubmit={HandleSubmit} methods={methods}>
      <div className="row">
      {(!case_id || case_id == "null") && (
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
      </div>
      <div className="row mt-3">
        <div className="col-12 col-md-6 mt-3">
          <InputField
            error={formState.errors["title"]}
            label="Title"
            name="title"
            className="bglight-ip"
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
        <div className="col-12 col-md-6 mt-3">
          <InputField
            label="Category"
            className="bglight-ip"
            error={formState.errors["category"]}
            name="category"
            control={control}
          />
        </div>
        <div className="col-12 col-md-6 mt-3 date-input">
          <label className={"form-label"}>Last Submission Date</label>
          <DateField
            disablePast={true}
            error={formState.errors["submissionAt"]}
            label=""
            name="submissionAt"
            variant="filled"
            className="bglight-ip w-100 p-1 rounded"
            control={control}
          />
          {/* <InputField
            label="Submission Date"
            error={formState.errors["submissionAt"]}
            name="submissionAt"
            control={control}
            type={"date"}
          /> */}
        </div>
        <div className="col-12 col-md-6 mt-3  date-input">
          {" "}
          <label className={"form-label"}>Document Valid Till</label>
          <DateField
            disablePast={true}
            label=""
            className="bglight-ip w-100 p-1 rounded"
            error={formState.errors["validTill"]}
            name="validTill"
            control={control}
          />
          {/* <InputField
            label="Valid Till"
            error={formState.errors["validTill"]}
            name="validTill"
            type={"date"}
            control={control}
          /> */}
        </div>
        <div className="col-12 col-md-6 mt-3">
          <FormLabel className="bold f-14 text-black">
            Is Document required?
          </FormLabel>
          <label>
            <input
              type="checkbox"
              name="isDocument"
              className="me-3"
              checked={form.isDocumentYes === true}
              onChange={() => {
                methods.clearErrors("isDocument");
                methods.setValue("isDocument", true);
                setForm({ ...form, isDocumentNo: false, isDocumentYes: true });
              }}
            />
            <span> Yes</span>
          </label>
          <label>
            <input
              onChange={() => {
                methods.clearErrors("isDocument");
                methods.setValue("isDocument", true);
                setForm({ ...form, isDocumentNo: true, isDocumentYes: false });
              }}
              checked={form.isDocumentNo === true}
              type="checkbox"
              name="isDocument"
              className="me-3"
            />
            <span> No</span>
          </label>
          {formState.errors["isDocument"] && (
            <p className="text-danger">Document Confirmation is required</p>
          )}
        </div>
        <div className="col-12 col-md-6 mt-3 represent-form ">
          <label>Assigned To Role</label>
          <SelectField
            label=""
            options={Roles.filter(
              (itm: any) => itm.value !== session?.user?.role
            )}
            error={formState.errors["assignedToRole"]}
            name="assignedToRole"
            control={control}
            className="assigneed-roel"
          />
        </div>
        <div className="d-flex justify-content-end">
          <LoadingButton
            loading={loading}
            variant="contained"
            className="mt-3 client-btn"
            type="submit"
          >
            <span className="text-white">Submit</span>
          </LoadingButton>
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </Form>
  );
};

export default TaskForm;
