"use client";

import { useHookForm } from "@/hooks/useHookForm";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";
import SelectField from "@/components/Form/SelectField";
import "../../client/client.css";
import { Member } from "@/types/Members";
import { useSession } from "next-auth/react";

type FormValues = {
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
};
interface FormTypeProps {
  data?: Member;
  caseId?: string;
}
const options = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const schema = z.object({
  name: ((msg) =>
    z
      .string({ required_error: msg })
      .trim()
      .min(1, msg)
      .regex(/^[A-Za-z\s]+$/, "Name must only contain letters"))(
    "Name is required"
  ),

  phone: z.custom(isValidMobile, isValidMobileMsg),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  gender: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please select the gender"
  ),
  age: ((msg) =>
    z.string({ required_error: msg, invalid_type_error: msg }).min(1, msg))(
    "Please enter the age"
  ),
});

const AddMember: React.FC<FormTypeProps> = ({ data, caseId }) => {
  const { data: session } = useSession();
  const user = session?.user?._id;
  console.log(caseId);

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, reset } = methods;
  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (data?._id) {
        await axios.put(`/api/client/case-member/${data?._id}`, values);
      } else {
        await axios.post("/api/client/case-member", {
          ...values,
          user,
          caseId,
        });
      }
      openSnackbar({
        message: `Member ${data ? "updated" : "added"} successfuly!`,
        type: "success",
      });
      router.push(`/client/case-members/${caseId}`);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message;
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      name: data?.name,
      phone: data?.phone,
      email: data?.email,
      age: data?.age?.toString(),
      gender: data?.gender,
    });
  }, [data]);

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div className="row mt-3">
        <div className="col-12 col-md-6 mt-3">
          <InputField
            error={formState.errors["name"]}
            label="Name"
            name="name"
            control={control}
          />
        </div>

        <div className="col-12 col-md-6 mt-3">
          <InputField
            error={formState.errors["email"]}
            label="Email"
            name="email"
            control={control}
          />
        </div>
        <div className="col-12 col-md-6 new-phone mt-3">
          <InputPhone
            error={formState.errors["phone"]}
            label=""
            name="phone"
            control={control}
            variant="filled"
            className="bglight-ip phone"
          />
        </div>

        <div className="col-12 col-md-6 mt-3">
          <SelectField
            options={options}
            label="Gender"
            name="gender"
            className="filter-select"
            error={formState.errors["gender"]}
            control={control}
          />
        </div>

        <div className="col-12 col-md-6 mt-3">
          <InputField
            type="number"
            error={formState.errors["age"]}
            label="Age"
            name="age"
            control={control}
          />
        </div>

        <div className="col-12 col-md-12 mt-4 text-center">
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            size="large"
          >
            <span>{data ? "Edit" : "Add"}</span>
          </LoadingButton>
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </Form>
  );
};

export default AddMember;
