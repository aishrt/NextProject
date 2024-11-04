"use client";

import { useHookForm } from "@/hooks/useHookForm";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Image from "next/image";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert, Checkbox, FormControlLabel } from "@mui/material";
import { PasswordField } from "@/components/Form/PasswordField";
import { NumberField } from "@/components/Form/NumberField";
import { useRouter } from "next/navigation";
import emails from "@/assets/emial.png";
import pass from "@/assets/lock.png";
import call from "@/assets/call.png";
import name from "@/assets/names.png";
import PhoneInput from "react-phone-number-input";
import { isValidMobileMsg, isValidMobile } from "@/components/Form/InputPhone";

type FormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  password: string;
  confirm_password: string;
};

const schema = z
  .object({
    // firstName: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    //   "Name is required"
    // ),

    firstName: ((msg) =>
      z
        .string({ required_error: msg })
        .trim()
        .min(1, msg)
        .max(30, "Name must be at most 30 characters long") // Added max constraint
        .regex(/^[A-Za-z\s]+$/, "Name must only contain letters"))(
      "Name is required"
    ),

    // lastName: z.string().min(1, "Last name is required"),z.string({ required_error: "ddfds" }).min(1, "Name is required")
    // phoneNumber: z
    //   .number({ invalid_type_error: "Phone number is required" })
    //   .min(1, "Phone number is required"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string({ required_error: "Password is Required" })
      .min(1, "Password is Required")
      .min(8, "Password must be atleast 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
        "Password should be a combination of uppercase alphabets, numbers and special characters"
      ),

    confirm_password: z.string().min(1, "Confirm Password is Required"),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        path: ["confirm_password"],
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export default function LoginComponent() {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, reset } = methods;
  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();
  const [value, setValue] = useState("");

  const [phoneNumber, setPhone] = useState<any>("");

  const [errors, setErrors] = useState({
    emailErr: false,
    phoneErr: "",
    roleErr: false,
  });

  const phoneErrHandle = (phoneVal: any) => {
    let isError = false;
    let errorObj = { ...errors };

    if (phoneVal) {
      const test = isValidMobileMsg(phoneVal);
      if (!test.message) {
        isError = true;
        errorObj = { ...errorObj, phoneErr: "" };
      } else {
        isError = true;
        errorObj = { ...errorObj, phoneErr: test.message };
      }
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleSubmit = async (values: FormValues) => {
    console.log({ ...values, phoneNumber });
    try {
      setLoading(true);
      const data = await axios.post("/api/auth/register/client", {
        ...values,
        phoneNumber,
      });
      setValues({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      openSnackbar({ message: "User created successfully!", type: "success" });
      console.log(data);
      router.push(`/auth/otp-verification?email=${values.email}&role=client`);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message;
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
    });
  }, []);

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div className="row  ml-5">
        <div className="col-12 col-md-12 mt-3">
          <InputField
            error={formState.errors["firstName"]}
            label="Name"
            name="firstName"
            startIcon={<Image src={name} alt="" />}
            className="input-fill"
            placeholder="Name"
            control={control}
          />
        </div>

        {/* <div className="col-12 col-md-12 mt-3">
          <InputField
            error={formState.errors["lastName"]}
            label="Last Name"
            name="lastName"
            startIcon={<Image src={emails} alt="" />}
            className="input-fill"
            placeholder="Last Name"
            control={control}
          />
        </div> */}

        <div className="col-12 col-md-12 mt-3">
          <InputField
            error={formState.errors["email"]}
            label="Email"
            name="email"
            startIcon={<Image src={emails} alt="" />}
            className="input-fill"
            placeholder="Email"
            control={control}
          />
        </div>

        {/* <div className="col-12 mt-3">
          <InputField
            error={formState.errors["phoneNumber"]}
            label="Phone Number"
            startIcon={<Image src={call} alt="" />}
            className="input-fill"
            placeholder="Phone Number"
            name="phoneNumber"
            control={control}
          />
        </div> */}

        <div className="col-12 mt-3">
          <PhoneInput
            className="form-control phone-control"
            placeholder="Enter phone number"
            value={phoneNumber}
            defaultCountry="FR"
            isValidPhoneNumber={true}
            onChange={(value) => {
              setPhone(value);
              phoneErrHandle(value);
            }}
          />
          {errors.phoneErr && (
            <span className="text-danger">{errors.phoneErr}</span>
          )}
        </div>

        <div className="col-12 mt-3">
          <InputField
            type="password"
            className="input-fill"
            startIcon={<Image src={pass} alt="" />}
            placeholder="Password"
            error={formState.errors["password"]}
            label="Password"
            name="password"
            control={control}
          />
        </div>
        <div className="col-12 mt-3">
          <InputField
            type="password"
            className="input-fill"
            startIcon={<Image src={pass} alt="" />}
            placeholder="Confirm Password"
            error={formState.errors["confirm_password"]}
            label="Confirm Password"
            name="confirm_password"
            control={control}
          />
        </div>

        {/* <div className="col-12 col-md-12 mt-4">
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Role</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="client"
                control={<Radio />}
                label="Client"
              />
              <FormControlLabel
                value="expert"
                control={<Radio />}
                label="Legal Expert"
              />
            </RadioGroup>
          </FormControl>
        </div> */}

        {/* <div className="col-12 col-md-6 mt-4">
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Remember me"
          />
        </div> */}
        <div className="col-12 col-md-12 mt-4 text-right">
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            className="w-100 login-btn"
            size="large"
          >
            <span>Register</span>
          </LoadingButton>
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </Form>
  );
}
