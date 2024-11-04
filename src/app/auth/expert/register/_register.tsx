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
import { useRouter } from "next/navigation";
import emails from "@/assets/emial.png";
import names from "@/assets/names.png";
import pass from "@/assets/lock.png";
import call from "@/assets/call.png";
import legal from "@/assets/legal.png";
import gen from "@/assets/gen.png";
import address from "@/assets/address.png";
import lang from "@/assets/lang.png";
import PhoneInput from "react-phone-number-input";
import {
  InputPhone,
  isValidMobileMsg,
  isValidMobile,
} from "@/components/Form/InputPhone";
import SelectField from "@/components/Form/SelectField";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import "../../login/login.css";
type FormValues = {
  firstName: string;
  language: string;
  address: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirm_password: string;
  gender: string;
  expertise: string;
};

const options = [
  { label: "Legal Expertise", value: "Legal Expertise" },
  { label: "Expertise", value: "Expertise" },
];
const gender = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];
const languages = [
  { label: "English", value: "English" },
  { label: "French", value: "French" },
  { label: "Other", value: "Other" },
];
const schema = z
  .object({
    firstName: ((msg) =>
      z
        .string({ required_error: msg })
        .trim()
        .min(1, msg)
        .max(30, "Name must be at most 30 characters long") // Added max constraint
        .regex(/^[A-Za-z\s]+$/, "Name must only contain letters"))(
      "Name is required"
    ),

    address: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please enter the address"
    ),
    phoneNumber: z.custom(isValidMobile, isValidMobileMsg),

    gender: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please enter the gender"
    ),

    language: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the language"
    ),

    expertise: ((msg) =>
      z.string({ required_error: msg, invalid_type_error: msg }).min(1, msg))(
      "Please select the legal expertise"
    ),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is Required")
      .min(8, "Password must be atleast 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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

export default function RegisterComponent() {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [valueArr, setValueArr] = useState(null);

  const [location, setLocation] = useState("");

  const [coordinates, setLocationLatLong] = useState({
    lat: 0,
    lng: 0,
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, reset } = methods;
  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();
  const [value, setValue] = useState("");

  const [phoneNumber, setPhone] = useState<any>("");

  const [errors, setErrors] = useState({
    phoneErr: "",
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
    console.log({ ...values });
    try {
      setLoading(true);
      const data = await axios.post("/api/auth/register/expert", {
        ...values,
      });
      setValues({
        firstName: "",
        //   lastName: "",
        email: "",
        password: "",
        confirm_password: "",
        address: "",
        phoneNumber: "",
        gender: "",
        expertise: "",
      });
      openSnackbar({
        message: "Expert created successfully!",
        type: "success",
      });
      console.log(data);
      router.push(`/auth/otp-verification?email=${values.email}&role=expert`);
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message;
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const [err, setErr] = useState<boolean>(false);

  const handleLocation = async (value: any) => {
    try {
      if (location) {
        return setErr(false);
      }
      const placeId = value?.value?.place_id;
      setValueArr(value);

      if (value) {
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${googleMapsApiKey}`
        );
        const location = data?.results[0]?.formatted_address;
        const coordinates = data?.results[0]?.geometry?.location;

        if (location) {
          setLocation(location);
          setLocationLatLong(coordinates);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setValues({
      firstName: "",
      address: "",
      email: "",
      password: "",
      confirm_password: "",
      gender: "",
      phoneNumber: "",
      expertise: "",
    });
  }, []);

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div className="row  ml-5">
        <div className="col-12 col-md-12 mt-2">
          <InputField
            error={formState.errors["firstName"]}
            label="Name"
            name="firstName"
            startIcon={<Image src={names} alt="" />}
            className="input-fill"
            placeholder="Name"
            control={control}
          />
        </div>
        <div className="col-12 col-md-12 mt-2">
          <InputField
            error={formState.errors["address"]}
            label="Address"
            name="address"
            startIcon={<Image src={address} alt="" />}
            className="input-fill"
            placeholder="Address"
            control={control}
          />
        </div>

        {/* <div className="col-12 mb-3">
          <GooglePlacesAutocomplete
            apiKey={googleMapsApiKey}
            selectProps={{
              defaultInputValue: "",
              value: valueArr,
              isClearable: true,
              placeholder: "Search for city/location..",
              onChange: handleLocation,
            }}
          />
          {!location && err && (
            <span className="text-danger f-14">Please enter Location</span>
          )}
        </div> */}

        {/* <div className="col-12 col-md-12 mt-2">
          <InputField
            error={formState.errors["gender"]}
            label="Gender"
            name="gender"
            startIcon={<Image src={gen} alt="" />}
            className="input-fill"
            placeholder="Gender"
            control={control}
          />
        </div> */}
        <div className="col-12 mt-2 relative login-expert gender">
          <SelectField
            options={gender}
            label="Gender"
            startIcon={<Image src={gen} alt="" />}
            name="gender"
            className="login-select"
            error={formState.errors["gender"]}
            control={control}
            emitChange={(val) => console.log(val)}
          />
        </div>

        <div className="col-12 col-md-12 mt-4">
          <InputField
            error={formState.errors["email"]}
            label="Enter Your Email"
            name="email"
            startIcon={<Image src={emails} alt="" />}
            className="input-fill"
            placeholder="Enter Your Email"
            control={control}
          />
        </div>

        {/* <div className="col-12 mt-2">
          <PhoneInput
            className="form-control input-fill-ph phone-control"
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
        </div> */}

        <div className="col-12 mt-2">
          <InputPhone
            error={formState.errors["phoneNumber"]}
            label="Phone Number"
            name="phoneNumber"
            control={control}
            variant="filled"
          />
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
        <div className="col-12 mt-3 relative login-expert gender">
          <SelectField
            options={options}
            label="Legal Expertise"
            startIcon={<Image src={legal} alt="" />}
            name="expertise"
            placeholder="Legal"
            className="login-select"
            error={formState.errors["expertise"]}
            control={control}
            emitChange={(val) => console.log(val)}
          />
        </div>
        <div className="col-12 mt-3 relative login-expert gender">
          <SelectField
            options={languages}
            label="Languages Spoken"
            startIcon={<Image src={lang} alt="" />}
            name="language"
            placeholder="Legal"
            className="login-select"
            error={formState.errors["language"]}
            control={control}
          />
        </div>

        <div className="col-12 col-md-12 mt-4">
          {/* <FormControl>
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
          </FormControl> */}
        </div>

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
