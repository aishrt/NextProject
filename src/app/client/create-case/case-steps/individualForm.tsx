"use client";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { InputField } from "@/components/Form/InputField";
import React, { Dispatch, FormEvent, SetStateAction } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DateField from "@/components/Form/DateField";
import { Moment } from "moment";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import axios from "axios";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";

type FormValues = {
  firstName: string;
  lastName: string;
  date: string;
  phone: number;
  email: string;
};

const schema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Please enter first name")
    .regex(/^[A-Za-z\s]+$/, "First Name must only contain letters"), // spaces not allowed: /^[A-Za-z]+$/

  lastName: z
    .string()
    .trim()
    .min(1, "Please enter the last name")
    .regex(/^[A-Za-z\s]+$/, "Last Name must only contain letters"),

  email: z
    .string()
    .min(1, "Email is required")
    .regex(
      /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
      "Please enter the valid email address"
    ),
  phone: z.custom(isValidMobile, isValidMobileMsg),
});

export const IndividualForm = ({
  individualData,
  locationGoogleArr,
  locationLatLong,
  setLocation,
  setLocationLatLong,
  setPlaceId,
  placeId,
  handleSubmit,
  setLocationError,
  locationError,
}: {
  individualData: any;
  locationGoogleArr: any;
  locationLatLong: any;
  setLocation: any;
  setLocationLatLong: any;
  setPlaceId: any;
  placeId: any;
  handleSubmit: (individualData: any) => Promise<void>;
  setLocationError: any;
  locationError: any;
}) => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const initialLocationsArray: any[] | (() => any[]) = [];
  const [valueArr, setValueArr] = useState<any>();
  const [postalCode, setPostalCode] = useState("");

  const searchParams = useSearchParams();
  const caseId = searchParams?.get("caseId");
  const [locationsArray, setLocationsArray] = useState(initialLocationsArray);

  // useEffect(() => {
  //   if (locationGoogleArr) {
  //     setLocationError(false);
  //   }
  // }, [locationGoogleArr]);

  const handleChangeLocationArray = async (value: any) => {
    if (!value) {
      setLocation(null);
      setValueArr(null); 
      return setLocationError(true); 
    }
    const placeId = value?.value?.place_id;
    console.log(placeId);

    setValueArr(value);
    setPlaceId(placeId);

    if (value) {
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${googleMapsApiKey}`
      );
      const location = data?.results[0]?.formatted_address;
      const coordinates = data?.results[0]?.geometry?.location;
      const postalCode = data?.results[0]?.address_components.find(
        (component: { types: string | string[] }) =>
          component.types.includes("postal_code")
      )?.long_name;

      setPostalCode(postalCode);

      if (location) {
        setValueArr({
          label: `${location}`,
          value: value.value,
        });

        setLocation(location);
        setLocationLatLong(coordinates);
      }
    }
  };
  console.log(valueArr);
  console.log(locationGoogleArr);

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  useEffect(() => {
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      phone: 0,
    });
  }, []);

  useEffect(() => {
    if (individualData) {
      setValues(individualData);
      setLocation(individualData?.address);
    }
  }, [individualData]);

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const caseData = await axios.post("/api/client/case/add-case", {
        progress: 30,
        caseId: caseId,
      });
      router.push(`/client/create-case?progress=30&caseId=${caseId}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <div className="minors-form indivi-form">
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-3">
            <InputField
              error={formState.errors["firstName"]}
              label=""
              placeholder="First Name"
              name="firstName"
              control={control}
              variant="filled"
              className="bglight-ip"
            />
          </div>
          <div className="col-12  col-md-6 mb-3">
            <InputField
              error={formState.errors["lastName"]}
              label=""
              placeholder="Last Name"
              name="lastName"
              variant="filled"
              className="bglight-ip"
              control={control}
            />
          </div>

          <div className="col-12  col-md-6 mb-3">
            <InputField
              error={formState.errors["email"]}
              label=""
              placeholder="Email"
              type="text"
              name="email"
              control={control}
              variant="filled"
              className="bglight-ip"
            />
          </div>

          <div className="col-12  col-md-6 new-phone mb-3">
            {/* <InputPhone
              error={formState.errors["phone"]}
              label="Phone Number"
              name="phone"
              type="number"
              control={control}
              variant="filled"
              className="bglight-ip"
            /> */}
            <InputPhone
              error={formState.errors["phone"]}
              label=""
              name="phone"
              control={control}
              variant="filled"
              className="bglight-ip phone"
            />
          </div>
          <div className="col-12 col-md-12 mb-3 google-loc">
            <GooglePlacesAutocomplete
              apiKey={googleMapsApiKey}
              selectProps={{
                defaultInputValue: individualData?.address,
                // defaultInputValue: valueArr?.label || '',
                value: valueArr,
                isClearable: true,
                placeholder: "Search for city/location..",
                onChange: handleChangeLocationArray,
              }}
            />
            {locationError && (
              <span className="text-danger f-14">Please enter location</span>
            )}
          </div>
        </div>
        <div className="step-btns mt-4 d-flex gap-3">
          <Button
            type="submit"
            className="client-btn"
            variant="contained"
            onClick={() => {
              if (!locationGoogleArr) {
                console.log(locationGoogleArr);
                return setLocationError(true);
              }
              // //!locationGoogleArr ? handleLocationerror : () => {}
            }}
          >
            Next{" "}
          </Button>
          <Button
            type="submit"
            variant={"outlined"}
            className="border-0 text-black text-decoration-underline"
            onClick={(e) => {
              e.preventDefault();
              handlePrevious();
            }}
          >
            Previous
          </Button>
        </div>
      </Form>
    </div>
  );
};
