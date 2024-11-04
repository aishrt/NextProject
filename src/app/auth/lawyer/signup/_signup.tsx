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
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";
import emails from "@/assets/emial.png";
import names from "@/assets/names.png";
import pass from "@/assets/lock.png";
import call from "@/assets/call.png";
import gen from "@/assets/gen.png";
import address from "@/assets/address.png";
import { InputPhone } from "@/components/Form/InputPhone";
import SelectField from "@/components/Form/SelectField";// Import the new MultiSelect component
import "../../login/login.css";
import { useLawyerTypes } from "@/queries/lawyers";
import { MultiSelectField } from "@/components/Form/MultiSelectField";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

type FormValues = {
  name: string;
  address: string;
  gender: string;
  email: string;
  phone: string;
  expertise: string[];
  languages: string;
  password: string;
  confirmPassword: string;
};

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    gender: z.string().min(1, "Gender is required"),
    email: z
      .string()
      .email("Please enter a valid email address")
      .min(1, "Email is required"),
    phone: z.string().min(1, "Phone number is required"),
    expertise: z.array(z.string()).min(1, "Legal expertise is required"),
    languages: z.string().min(1, "Languages spoken is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupComponent() {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [valueArr, setValueArr] = useState(null);
  const [location, setLocation] = useState("");
  const [coordinates, setLocationLatLong] = useState({
    lat: 0,
    lng: 0,
  });
  const { formState, control, reset } = methods;
  const { data, isLoading } = useLawyerTypes({
    page: "all",
  });

  const options = data?.data?.map((item: any) => ({
    label: item.name,
    value: item._id,
  }));

  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar();
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    console.log({ ...values });
    try {
      setLoading(true);
      if (!location) {
        return setErr(true);
      }

      const payload = {
        name: values.name,
        phoneNumber: values.phone,
        email: values.email,
        legalExpertise: values.expertise,
        gender: values.gender,
        languages: values.languages,
        password: values.password,
        location,
        coordinates: JSON.stringify(coordinates),
        locationName: JSON.stringify({
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        }),
      };
      await axios.post("/api/auth/register/lawyer", payload);
      setValues({
        name: "",
        address: "",
        phone: "",
        email: "",
        expertise: [],
        gender: "",
        languages: "",
        password: "",
        confirmPassword: "",
      });
      openSnackbar({
        message: "Otp has been sent to your registered mail!",
        type: "success",
      });
      router.push(`/auth/otp-verification?email=${values.email}&role=lawyer`);
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
      name: "",
      address: "",
      gender: "",
      email: "",
      phone: "",
      expertise: [],
      languages: "",
      password: "",
      confirmPassword: "",
    });
  }, []);

  if (isLoading) {
    return (
      <center>
        Loading...
      </center>
    );
  }

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div className="row ml-5">
        <div className="col-12 col-md-12 mt-2">
          <InputField
            error={formState.errors["name"]}
            label="Name"
            name="name"
            startIcon={<Image src={names} alt="" />}
            className="input-fill"
            placeholder="Name"
            control={control}
          />
        </div>
        <div className="col-12 mb-3 lawyer-address">
          {/* <label className="d-block">Address</label> */}
          <GooglePlacesAutocomplete
            apiKey={googleMapsApiKey}
            selectProps={{
              defaultInputValue: location,
              value: valueArr,
              isClearable: true,
              placeholder: "Search for city/location..",
              onChange: handleLocation,
            }}
          />
          {!location && err && (
            <span className="text-danger f-14">
              Please enter Location
            </span>
          )}
        </div>
        <div className="col-12 col-md-12  lawyer-select">
          <SelectField
            label="Gender"
            name="gender"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
            control={control}
            error={formState.errors["gender"]}
          />
        </div>
        <div className="col-12 col-md-12 mt-3">
          <InputField
            type="email"
            error={formState.errors["email"]}
            label="Enter Your Email"
            name="email"
            startIcon={<Image src={emails} alt="" />}
            className="input-fill"
            placeholder="Enter Your Email"
            control={control}
          />
        </div>
        <div className="col-12 ">
          <InputPhone
            error={formState.errors["phone"]}
            label="Phone Number"
            name="phone"
            control={control}
            variant="filled"
          />
        </div>
        <div className="col-12 mt-3">
          <InputField
            type="text"
            label="Languages Spoken"
            name="languages"
            control={control}
            error={formState.errors["languages"]}
          />
        </div>
        <div className="col-12 ">
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
        <div className="col-12 ">
          <InputField
            type="password"
            className="input-fill"
            startIcon={<Image src={pass} alt="" />}
            placeholder="Confirm Password"
            error={formState.errors["confirmPassword"]}
            label="Confirm Password"
            name="confirmPassword"
            control={control}
          />
        </div>
        <div className="col-12  relative login-expert  lawyer-address">
          <MultiSelectField
            options={options}
            label="Legal Expertise"
            registration={{ name: "expertise" }}
            error={formState.errors["expertise"]}
            control={control}
          />
        </div>
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
