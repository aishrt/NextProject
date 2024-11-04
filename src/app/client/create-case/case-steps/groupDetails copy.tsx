"use client";
import { InputField } from "@/components/Form/InputField";
import Form from "@/components/Form/Form";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

interface GroupData {
  people: string;
  first_name: string;
  last_name: string;
  representative_email: string;
  representative_phone_no: string;
  isSpouse: string;
  isRepresentative: string;
  representativeLocation: string;
  representativeCoord: RepresentativeCoord;
  spouseLocation: string;
  spouseCoord: RepresentativeCoord;
}
interface RepresentativeCoord {
  lat: number;
  lng: number;
}

type FormValues = {
  people: string;
  name: string;
  first_name: string;
  spouse_first_name: string;
  last_name: string;
  spouse_last_name: string;
  spouse_email: string;
  representative_email: string;
  representative_phone_no: string;
  spouse_phone_no: string;
  address: string;
  spouse: string;
  isRepresentative: string;
};

// interface
interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
}

export default function GroupDetails(props: IProps) {
  // Destructuring the props object
  const { handleChange, setProgressValue } = props;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const [isSpouse, setIsSpouse] = useState("");
  const [isRepresentative, setChoseRepresentative] = useState("");
  const [valueArr, setValueArr] = useState(null);
  const [spouseValueArr, setSpouseValueArr] = useState(null);

  const [data, setData] = useState<GroupData>({
    people: "",
    first_name: "",
    last_name: "",
    representative_email: "",
    representative_phone_no: "",
    isSpouse: "",
    isRepresentative: "",
    representativeLocation: "",
    representativeCoord: { lat: 0, lng: 0 },
    spouseLocation: "",
    spouseCoord: { lat: 0, lng: 0 },
  });

  const [representativeLocation, setLocation] = useState("");
  const [spouseLocation, setSpouseLocation] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [spouseCoord, setSpouseLatLong] = useState({
    lat: 0,
    lng: 0,
  });

  const [representativeCoord, setLocationLatLong] = useState({
    lat: 0,
    lng: 0,
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [errors, setErrors] = useState({
    err: false,
    chooseErr: false,
    addressErr: false,
    spouseAddressErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!isSpouse) {
      isError = true;
      errorObj = { ...errorObj, err: true };
    }
    if (!isRepresentative) {
      isError = true;
      errorObj = { ...errorObj, chooseErr: true };
    }
    if (isRepresentative == "yes" && !representativeLocation) {
      isError = true;
      errorObj = { ...errorObj, addressErr: true };
    }

    if (isSpouse == "yes" && !spouseLocation) {
      isError = true;
      errorObj = { ...errorObj, spouseAddressErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const schema = z.object({
    people: z
      .string({ required_error: "Please enter the people" })
      .min(1, "Please enter the people"),
    first_name:
      isRepresentative == "yes"
        ? z
            .string({ required_error: "Name is required" })
            .min(1, "Name is required")
        : z.string().optional(),
    spouse_first_name:
      isSpouse == "yes"
        ? z
            .string({ required_error: "Name is required" })
            .min(1, "Name is required")
        : z.string().optional(),
    last_name:
      isRepresentative == "yes"
        ? z
            .string({ required_error: "Last Name is required" })
            .min(1, "Last Name is required")
        : z.string().optional(),
    spouse_last_name:
      isSpouse == "yes"
        ? z
            .string({ required_error: "Last Name is required" })
            .min(1, "Last Name is required")
        : z.string().optional(),

    spouse_email:
      isSpouse == "yes"
        ? z
            .string({ required_error: "Email is required" })
            .min(1, "Email is required")
            .regex(
              /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
              "Please enter a valid email"
            )
        : z.string().optional(),

    representative_email:
      isRepresentative == "yes"
        ? z
            .string({ required_error: "Email is required" })
            .min(1, "Email is required")
            .regex(
              /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
              "Please enter a valid email"
            )
        : z.string().optional(),

    representative_phone_no:
      isRepresentative == "yes"
        ? z.custom(isValidMobile, isValidMobileMsg)
        : z.string().optional(),
    spouse_phone_no:
      isSpouse == "yes"
        ? z.custom(isValidMobile, isValidMobileMsg)
        : z.string().optional(),
    // address: isRepresentative =='yes'
    //   ? z
    //       .string({ required_error: "Address is required" })
    //       .min(1, "Address is required")
    //   : z.string().optional(),
  });

  const handleSpouseLocation = async (value: any) => {
    try {
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.spouseAddressErr = false;
        return newErrorObj;
      });
      const placeId = value?.value?.place_id;
      setSpouseValueArr(value);

      if (value) {
        const { data } = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${googleMapsApiKey}`
        );
        const location = data?.results[0]?.formatted_address;
        const coordinates = data?.results[0]?.geometry?.location;
        console.log(data?.results[0]?.geometry?.location);

        if (location) {
          setSpouseLocation(location);
          setSpouseLatLong(coordinates);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRepresentativeLocation = async (value: any) => {
    try {
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.addressErr = false;
        return newErrorObj;
      });
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

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const handleSubmitGroup = async (groupData: any) => {
    try {
      if (errHandle()) {
        return;
      }
      setData(groupData);
      if (isRepresentative == "yes") {
        setOpenDialog(true);
      } else {
        setProgressValue(70);
        handleChange({
          groupInfo: {
            ...groupData,
            isSpouse,
            isRepresentative,
            representativeLocation,
            representativeCoord,
            spouseLocation,
            spouseCoord,
          },
          progress: 70,
        });
      }
      // setProgressValue(70);
      // handleChange({
      //   groupInfo: {
      //     ...groupData,
      //     isSpouse,
      //     isRepresentative,
      // representativeLocation,
      //   representativeCoord,
      //   spouseLocation,
      //   spouseCoord,
      //   },
      //   progress: 70,
      // });
      // await axios.post(`/api/client/gdpr-mail`, { email: groupData.email });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="first-step">
      <h3 className="f-26 bold">Tell Us About the Group You Represent</h3>
      <>
        <Form<FormValues> onSubmit={handleSubmitGroup} methods={methods}>
          <div className="group-info-comp">
            <div className="group-info pb-4">
              <p className="f-20 semi-bold">
                How many people do you represent?{" "}
              </p>
              <InputField
                type="number"
                error={formState.errors["people"]}
                label="How many people do you represent? "
                name="people"
                control={control}
                variant="filled"
                className="bglight-ip"
              />
            </div>
            <div className="spouse-info pb-3">
              <p className="f-20 semi-bold tooltip-title relative">
                Do any of the represented individuals include your married
                spouse and/or minor children under your parental authority?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Parental authority: Legal rights and responsibilities to make
                  decisions and take actions on behalf of your minor children
                </span>
              </p>

              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    onClick={() => {
                      setIsSpouse("yes");
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.err = false;
                        return newErrorObj;
                      });
                    }}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                    onClick={() => {
                      setIsSpouse("no");
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.err = false;
                        return newErrorObj;
                      });
                    }}
                  />
                </RadioGroup>
                {errors.err && (
                  <span className="text-danger f-14"> Please select</span>
                )}
              </FormControl>
              {isSpouse == "yes" && (
                <div className="row legal-rep-yes">
                  <div className="col-12 mb-3">
                    <InputField
                      error={formState.errors["spouse_first_name"]}
                      label="First Name"
                      name="spouse_first_name"
                      control={control}
                      variant="filled"
                      className="bglight-ip"
                    />
                  </div>
                  <div className="col-12 mb-3">
                    <InputField
                      error={formState.errors["spouse_last_name"]}
                      label="Last Name"
                      name="spouse_last_name"
                      control={control}
                      variant="filled"
                      className="bglight-ip"
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <InputField
                      error={formState.errors["spouse_email"]}
                      label="Email Address"
                      name="spouse_email"
                      control={control}
                      variant="filled"
                      className="bglight-ip"
                    />
                  </div>

                  <div className="col-12 new-phone mb-3">
                    {/* <InputField
                                type="number"
                                error={formState.errors["spouse_phone_no"]}
                                label="Phone Number"
                                name="spouse_phone_no"
                                control={control}
                                variant="filled"
                                className="bglight-ip"
                            /> */}
                    <InputPhone
                      error={formState.errors["spouse_phone_no"]}
                      label=""
                      name="spouse_phone_no"
                      control={control}
                      variant="filled"
                      className="bglight-ip phone"
                    />
                  </div>

                  <div className="col-12 mb-3">
                    <GooglePlacesAutocomplete
                      apiKey={googleMapsApiKey}
                      selectProps={{
                        defaultInputValue: "",
                        value: spouseValueArr,
                        isClearable: true,
                        placeholder: "Search for city/location..",
                        onChange: handleSpouseLocation,
                      }}
                    />
                    {errors.spouseAddressErr && (
                      <span className="text-danger f-14">
                        Please enter Location
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="spouse-info">
              <p className="f-20 semi-bold">
                Did others choose you as their representative?
              </p>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    onClick={() => {
                      setChoseRepresentative("yes");
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.chooseErr = false;
                        return newErrorObj;
                      });
                    }}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio />}
                    label="No"
                    onClick={() => {
                      setChoseRepresentative("no");
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.chooseErr = false;
                        return newErrorObj;
                      });
                    }}
                  />
                </RadioGroup>
                {errors.chooseErr && (
                  <span className="text-danger f-14">
                    {" "}
                    Please select, if others choose you as their representative
                  </span>
                )}
              </FormControl>
            </div>

            {/* // will be shown on condition */}

            {isRepresentative == "yes" && (
              <div className="row legal-rep-yes">
                <div className="col-12 mb-3">
                  <InputField
                    error={formState.errors["first_name"]}
                    label="First Name"
                    name="first_name"
                    control={control}
                    variant="filled"
                    className="bglight-ip"
                  />
                </div>
                <div className="col-12 mb-3">
                  <InputField
                    error={formState.errors["last_name"]}
                    label="Last Name"
                    name="last_name"
                    control={control}
                    variant="filled"
                    className="bglight-ip"
                  />
                </div>
                <div className="col-12 mb-3">
                  <InputField
                    error={formState.errors["representative_email"]}
                    label="Email Address"
                    name="representative_email"
                    control={control}
                    variant="filled"
                    className="bglight-ip"
                  />
                </div>
                <div className="col-12 new-phone mb-3">
                  {/* <InputField
                            type="number"
                            error={formState.errors["representative_phone_no"]}
                            label="Phone Number"
                            name="representative_phone_no"
                            control={control}
                            variant="filled"
                            className="bglight-ip"
                            /> */}
                  <InputPhone
                    error={formState.errors["representative_phone_no"]}
                    label=""
                    name="representative_phone_no"
                    control={control}
                    variant="filled"
                    className="bglight-ip phone"
                  />
                </div>
                <div className="col-12 mb-3">
                  {/* <InputField
                    error={formState.errors["address"]}
                    label="Address"
                    name="address"
                    control={control}
                    variant="filled"
                    className="bglight-ip"
                  /> */}

                  <GooglePlacesAutocomplete
                    apiKey={googleMapsApiKey}
                    selectProps={{
                      defaultInputValue: "",
                      value: valueArr,
                      isClearable: true,
                      placeholder: "Search for city/location..",
                      onChange: handleRepresentativeLocation,
                    }}
                  />
                  {errors.addressErr && (
                    <span className="text-danger f-14">
                      Please enter Location
                    </span>
                  )}
                </div>
              </div>
            )}

            {isRepresentative == "no" && (
              <p className="semi-bold tooltip-title relative">
                Submit for yourself only. Add others later via e-mandate request
                from your dashboard.
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  The form will be submitted for yourself only
                </span>
              </p>
            )}
          </div>
          <div className="step-btns mt-3 d-flex justify-content-center gap-3">
          <Button
              type="submit"
              variant={"outlined"}
              className="green-border"
              onClick={() => {
                // errHandle();
              }}
            >
              Previous
            </Button>
            <Button
              className="submit-btn-all "
              type="submit"
              variant="contained"
              onClick={() => {
                errHandle();
              }}
            >
              Next
            </Button>
            
          </div>
        </Form>

        <Dialog
          fullScreen={fullScreen}
          open={openDialog}
          // onClose={() => setOpenDialog(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title"></DialogTitle>
          <DialogContent>
            <h3 className="f-26 bold">GDPR Consent Required</h3>
            <p className="f-14">
              To proceed with your group&apos;s case, we need the electronic
              consent of each individual you represent. This ensures we comply
              with data protection laws and can process their information.
            </p>
            <p className="semi-bold f-18 mb-2">What to do:</p>
            <ol className="to-do f-14">
              <li className="py-2">
                <span className="bold">Inform your group members: </span>
                Let them know to expect an email with a GDPR consent document.
              </li>
              <li className="py-2">
                <span className="bold">Ask them to check their spam: </span>
                The email might land in their spam folder.
              </li>
              <li className="py-2">
                <span className="bold">Ensure they sign the document: </span>{" "}
                Their signature is crucial for us to proceed.
              </li>
            </ol>
            <p className="semi-bold f-18 mb-2">Why is this important?</p>
            <p className="f-14">
              Consent allows us to legally process their personal information,
              essential for a thorough case evaluation. Without consent, we
              cannot proceed with their claims.
            </p>
          </DialogContent>
          <DialogActions className="justify-content-center pb-4">
            <Button
              onClick={async () => {
                setOpenDialog(false);
                setProgressValue(70);
                handleChange({
                  groupInfo: {
                    ...data,
                    isSpouse,
                    isRepresentative,
                    representativeLocation,
                    representativeCoord,
                    spouseLocation,
                    spouseCoord,
                  },
                  progress: 70,
                });
                await axios.post(`/api/client/gdpr-mail`, {
                  email: data?.representative_email,
                });
              }}
              autoFocus
              className="submit-btn-all "
              type="submit"
              variant="contained"
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </>
      <div className="step-btns mt-3 d-flex justify-content-center gap-3"></div>
    </div>
  );
}
