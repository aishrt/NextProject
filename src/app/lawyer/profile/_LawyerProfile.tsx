"use client";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useSelectFile } from "@/hooks/useSelectFile";
import { useSession } from "next-auth/react";
import DateField from "@/components/Form/DateField";
import { useRouter } from "next/navigation";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";
import { Button } from "@/components/Form/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert, CircularProgress } from "@mui/material";

type FormValues = {
  firstName: string;
  email: string;
  phoneNumber: string;
  dob: string;
  nationality: string;
  emergencyContact: string;
};
const schema = z.object({
  firstName: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please enter the name"
  ),
  email: ((msg) =>
    z
      .string({ required_error: msg })
      .min(1, msg)
      .regex(
        /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
        "Please enter the valid email address"
      ))("Email is required"),

  phoneNumber: z.custom(isValidMobile, isValidMobileMsg),

  dob: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please enter the date of birth"
  ),
  nationality: ((msg) => z.string().min(1, msg))(
    "Please enter the nationality"
  ),
  emergencyContact: z.custom(isValidMobile, isValidMobileMsg),
});

export const LawyerProfile = () => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [valueArr, setValueArr] = useState(null);

  const [location, setLocation] = useState("");

  const [coordinates, setLocationLatLong] = useState({
    lat: 0,
    lng: 0,
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const inputRef = useRef<HTMLInputElement>(null);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [isloading, setLoad] = useState(false);

  const router = useRouter();
  const { data, update } = useSession();
  const { file, preview, setPicturePreview, handleChange } = useSelectFile();
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

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

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoad(true);
      if (!location) {
        return setErr(true);
      }
      const payload = {
        ...values,
        location,
        coordinates: JSON.stringify(coordinates),
        locationName: JSON.stringify({
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        }),
      };
      const form = new FormData();
      (Object.keys(payload) as Array<keyof FormValues>).forEach((key) => {
        form.append(key, payload[key]);
      });
      if (file) {
        form.append("image", file);
      }

      const response = await axios.post("/api/lawyer/profile", form);
      update();

      if (!response) {
        throw new Error("There was an error while profile updating.");
      }
      openSnackbar({ message: response.data.message, type: "success" });
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to reset the password.";
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setLoad(false);
    }
  };
  useEffect(() => {
    setLoading(true);
    if (data?.user) {
      setValues({
        ...data?.user,
        dob: data?.user?.dob ? data?.user?.dob : "",
      });
      setLocation(data?.user?.location ?? "");
      setLoading(false);
    }
  }, [data]);
  const prev = "https://static.thenounproject.com/png/4035887-200.png";
  return (
    <div className="client-profile-form white-card rounded-lg p-4">
      <div className="minors-form">
        {loading ? (
          <p className="text-center">
            <CircularProgress />
          </p>
        ) : (
          <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
            <div className="row mt-3">
              <div className="col-12">
                <div className="client-profile-foto d-flex align-items-center gap-3 mb-4">
                  <div className="upload-img-box mb-0">
                    <label htmlFor="fileInput">
                      <>
                        {preview ? (
                          <img
                            className="upload-img"
                            src={preview}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = prev;
                            }}
                          />
                        ) : data?.user?.image ? (
                          <img
                            className="upload-img"
                            src={data?.user?.image}
                            onError={({ currentTarget }) => {
                              currentTarget.onerror = null;
                              currentTarget.src = prev;
                            }}
                          />
                        ) : (
                          <img src={prev} alt="" className="upload-img" />
                        )}
                      </>
                    </label>
                    <input
                      accept="image/*"
                      onChange={handleChange}
                      type="file"
                      id="fileInput"
                      className="d-none"
                    />
                  </div>
                  <h6 className="f-16">Edit Profile Photo</h6>
                </div>
              </div>
              <div className="col-12  col-md-6 mb-3">
                <InputField
                  error={formState.errors["firstName"]}
                  label="Name"
                  name="firstName"
                  control={control}
                  variant="filled"
                />
              </div>
              <div className="col-12  col-md-6 mb-3">
                <InputField
                  error={formState.errors["email"]}
                  label="Email"
                  name="email"
                  variant="filled"
                  control={control}
                />
              </div>
              <div className="col-12  col-md-12 mb-3">
                <InputPhone
                  error={formState.errors["phoneNumber"]}
                  label="Phone Number"
                  name="phoneNumber"
                  control={control}
                  variant="filled"
                />
              </div>
              <div className="col-12 birth-date   col-md-12 mb-3">
                <label className="d-block">Date of Birth</label>
                <DateField
                  label="Date of birth"
                  name="dob"
                  variant="filled"
                  error={formState.errors["dob"]}
                  control={control}
                />
              </div>
              <div className="col-12  col-md-12">
                <InputField
                  error={formState.errors["nationality"]}
                  label="Nationality"
                  name="nationality"
                  variant="filled"
                  control={control}
                />
              </div>
              <div className="col-12 mb-3">
              <label className="d-block">Address</label>
                <GooglePlacesAutocomplete
                  apiKey={googleMapsApiKey}
                  selectProps={{
                    defaultInputValue: data?.user?.location,
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
              <div className="col-12  col-md-12 mb-3">
                <InputPhone
                  error={formState.errors["emergencyContact"]}
                  label="Emergency Contact"
                  name="emergencyContact"
                  control={control}
                  variant="filled"
                />
              </div>
            </div>

            <div className="row mt-3">
              <div className="col-4">
                <LoadingButton
                  loading={isloading}
                  variant="contained"
                  size="large"
                  type="submit"
                  onClick={() => {
                    if (!location) {
                      return setErr(true);
                    }
                  }}
                >
                  Submit
                </LoadingButton>
              </div>
            </div>
            <Snackbar {...snackProps}>
              <Alert {...alertProps} />
            </Snackbar>
          </Form>
        )}
      </div>
    </div>
  );
};
