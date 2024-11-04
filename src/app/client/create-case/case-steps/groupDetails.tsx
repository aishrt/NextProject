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
  TextField,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import DateField from "@/components/Form/DateField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";

type GroupValues = {
  name: string;
  surname: string;
  dob: Dayjs;
};

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
}

type PersonErrors = {
  name: string;
  surname: string;
  dob: string;
};

interface RepresentativeCoord {
  lat: number;
  lng: number;
}

type FormValues = {
  people: string;
  first_name: string;
  last_name: string;
  representative_email: string;
  representative_phone_no: string;
};

// interface
interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
  caseData: any;
}

export default function GroupDetails(props: IProps) {
  // Destructuring the props object
  const { handleChange, setProgressValue, caseData } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const caseId = searchParams ? searchParams.get("caseId") : null;
  const [loading, setLoading] = useState(false);

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

  const [renewalDate, setRenewalDate] = useState<Dayjs | null>(dayjs(""));

  const [personErrors, setPersonErrors] = useState<PersonErrors[]>([
    {
      name: "",
      surname: "",
      dob: "",
    },
  ]);

  const [errors, setErrors] = useState({
    err: false,
    chooseErr: false,
    addressErr: false,
    spouseAddressErr: false,
  });

  const handleValueChange = (
    index: number,
    val: string | number | null | Dayjs,
    field: keyof GroupValues
  ) => {
    setGroupData((prev) => {
      let newPersons: any = [...prev];
      if (newPersons[index]) {
        newPersons[index][field] = val;
      }
      return newPersons;
    });

    setPersonErrors((prev) => {
      let prevErrs = [...prev];
      if (prevErrs[index]) {
        prevErrs[index][field] = "";
      }
      return prevErrs;
    });
  };

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
    if (isRepresentative == "no") {
      isError = false;
      errorObj = { ...errorObj, addressErr: false };
    }
    // if (isSpouse == "yes" && !spouseLocation) {
    //   isError = true;
    //   errorObj = { ...errorObj, spouseAddressErr: true };
    // }

    if (isError) {
      setErrors(errorObj);
    }

    return isError;
  };

  const schema = z.object({
    first_name:
      isRepresentative == "yes"
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

  const [groupData, setGroupData] = useState<GroupValues[]>([
    {
      name: "",
      surname: "",
      dob: dayjs(""),
    },
  ]);

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const handleSubmitGroup = async (values: any) => {
    try {
      if (checkValidations()) return;

      if (errHandle()) {
        return;
      }

      setData(values);
      if (isRepresentative == "yes") {
        setOpenDialog(true);
      } else {
        setProgressValue(70);
        handleChange({
          groupInfo: {
            // ...values,

            first_name: isRepresentative == "yes" ? values.first_name : "",
            last_name: isRepresentative == "yes" ? values.last_name : "",
            representative_email:
              isRepresentative == "yes" ? values.representative_email : "",
            representative_phone_no:
              isRepresentative == "yes" ? values.representative_phone_no : "",

            isSpouse,
            isRepresentative,
            representativeLocation:
              isRepresentative == "yes" ? representativeLocation : "",
            representativeCoord:
              isRepresentative == "yes" ? representativeCoord : {},
            personData: isSpouse == "yes" ? groupData : [{}],
          },
          progress: 70,
          nextProgress: caseData.role == "directParty" ? 70 : 60,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const caseData = await axios.post("/api/client/case/add-case", {
        progress: 50,
        caseId: caseId,
      });
      router.push(`/client/create-case?progress=50&caseId=${caseId}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  // const checkValidations = () => {
  //   let personItms = [...groupData];
  //   let errObj = [...personErrors];
  //   let isError = false;
  //   groupData.forEach((item, index) => {
  //     let initialItm = personItms[index];
  //     if (isSpouse == "yes" && !initialItm.name) {
  //       isError = true;
  //       errObj[index].name = "Please enter the name";
  //     }
  //     if (isSpouse == "yes" && !initialItm.surname) {
  //       isError = true;
  //       errObj[index].surname = "Please enter the surname";
  //     }

  //     if (
  //       (isSpouse == "yes" && !initialItm.dob) ||
  //       dayjs(initialItm.dob).format("YYYY/MM/DD") == "Invalid Date"
  //     ) {
  //       isError = true;
  //       errObj[index].dob = "Please enter the date of birth";
  //     }

  //     if (isError) {
  //       setPersonErrors(errObj);
  //     }

  //     if (isSpouse == "no") {
  //       isError = false;
  //       (errObj[index].name = ""),
  //         (errObj[index].surname = ""),
  //         (errObj[index].dob = "");
  //     }
  //   });
  //   return isError;
  // };

  const checkValidations = () => {
    let personItms = [...groupData];
    let errObj = personErrors.map(
      (error) => error || { name: "", surname: "", dob: "" }
    );
    let isError = false;

    groupData.forEach((item, index) => {
      let initialItm = personItms[index];

      if (!errObj[index]) {
        errObj[index] = { name: "", surname: "", dob: "" };
      }

      if (isSpouse === "yes") {
        if (!initialItm.name) {
          isError = true;
          errObj[index].name = "Please enter the name";
        } else {
          errObj[index].name = ""; // Clear error if valid
        }

        if (!initialItm.surname) {
          isError = true;
          errObj[index].surname = "Please enter the surname";
        } else {
          errObj[index].surname = ""; // Clear error if valid
        }

        if (
          !initialItm.dob ||
          dayjs(initialItm.dob).format("YYYY/MM/DD") === "Invalid Date"
        ) {
          isError = true;
          errObj[index].dob = "Please enter the date of birth";
        } else {
          errObj[index].dob = ""; // Clear error if valid
        }
      } else if (isSpouse === "no") {
        errObj[index].name = "";
        errObj[index].surname = "";
        errObj[index].dob = "";
      }
    });

    setPersonErrors(errObj);

    return isError;
  };

  const handleAddPerson = () => {
    // if (checkNumberValidation(noOfPremises)) return;
    if (checkValidations()) return;
    let newData = [...groupData];
    let newErrors = [...personErrors];
    // if (groupData.length < 3) {
    newData.push({
      name: "",
      surname: "",
      dob: dayjs(""),
    });
    newErrors.push({
      name: "",
      surname: "",
      dob: "",
    });
    newData.map((val) => dayjs(val.dob).format("YYYY/MM/DD"));
    setGroupData(newData);
    setPersonErrors(newErrors);
    // }
  };

  useEffect(() => {
    if (caseData?.groupInfo) {
      setValues(caseData?.groupInfo);
      setChoseRepresentative(caseData?.groupInfo?.isRepresentative);
      setIsSpouse(caseData?.groupInfo?.isSpouse);
      setLocation(caseData?.groupInfo?.representativeLocation);
      // setGroupData(caseData?.groupInfo?.personData ?? []);

      // Transform the data
      let data = caseData?.groupInfo?.personData;
      const grpData = data.map((item: any) => ({
        name: item.name,
        surname: item.surname,
        dob: dayjs(item.dob), // Convert dob to dayjs object
      }));

      // Set the state with transformed data
      setGroupData(grpData);
    }
  }, [caseData]);

  return (
    <div className="first-step white-card rounded-lg represent-form p-5">
      <h3 className="f-26 fw-400 pb-3">
        Tell Us About the Group You Represent
      </h3>
      <>
        <Form<FormValues> onSubmit={handleSubmitGroup} methods={methods}>
          <div className="group-info-comp">
            {/* <div className="group-info pb-4">
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
            </div> */}
            <div className="spouse-info pb-3">
              <p className="f-18 fw-500 ">
                <span className="tooltip-title relative">
                  Do any of the represented individuals include your married
                  spouse and/or minor children under your parental authority?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Parental authority: Legal rights and responsibilities to
                    make decisions and take actions on behalf of your minor
                    children
                  </span>
                </span>
              </p>

              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={isSpouse}
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
                  <span className="text-danger f-14">
                    {" "}
                    Please select, the parental authority
                  </span>
                )}
              </FormControl>
              {isSpouse == "yes" && (
                <div className="row legal-rep-yes">
                  {groupData?.map((i, index) => {
                    return (
                      <div key={index}>
                        <h3 className="f-18 semi-bold mt-4">
                          Person {index + 1}
                        </h3>
                        <div className="row mt-3">
                          <div className="col-12 col-md-6 mb-4">
                            <div className="lease-input">
                              <label className="tooltip-title relative">
                                Name
                              </label>
                              <TextField
                                sx={{ width: "100%" }}
                                value={i.name}
                                className="bglight-ip"
                                placeholder="Name"
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleValueChange(
                                    index,
                                    event.target.value,
                                    "name"
                                  );
                                }}
                              />
                            </div>
                            {personErrors[index] && (
                              <span className="text-danger f-14">
                                {personErrors[index].name}
                              </span>
                            )}
                          </div>

                          <div className="col-12 col-md-6 mb-4">
                            <div className="lease-input">
                              <label className="tooltip-title relative">
                                Surname
                              </label>
                              <TextField
                                sx={{ width: "100%" }}
                                value={i.surname}
                                className="bglight-ip"
                                placeholder="Surname"
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleValueChange(
                                    index,
                                    event.target.value,
                                    "surname"
                                  );
                                }}
                              />
                            </div>
                            {personErrors[index] && (
                              <span className="text-danger f-14">
                                {personErrors[index].surname}
                              </span>
                            )}
                          </div>

                          <div className="col-12 col-md-6 mb-4">
                            <div className="lease-input ">
                              <label className="tooltip-title relative">
                                Date of Birth
                              </label>
                              {/* <TextField
                                sx={{ width: "100%" }}
                                value={i.dob}
                                className="bglight-ip"
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleValueChange(
                                    index,
                                    event.target.value,
                                    "dob"
                                  );
                                }}
                              /> */}

                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={["DatePicker"]}>
                                  <DatePicker
                                    sx={{
                                      width: 500,
                                      backgroundColor: "#d5eae0",
                                    }}
                                    defaultValue={i.dob}
                                    // value={i.dob}
                                    className="bglight-ip"
                                    onChange={(date: Dayjs | null) => {
                                      handleValueChange(index, date, "dob");
                                    }}
                                  />
                                </DemoContainer>
                              </LocalizationProvider>
                            </div>
                            {personErrors[index] && (
                              <span className="text-danger f-14">
                                {personErrors[index].dob}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="text-left">
                    <Button
                      className="client-btn"
                      variant="contained"
                      onClick={handleAddPerson}
                    >
                      Add Another Person
                    </Button>
                  </div>

                  {/* <div className="col-12 mb-3">
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
                  </div> */}
                </div>
              )}
            </div>
            <div className="spouse-info">
              <p className="f-18 fw-500 ">
                Did others choose you as their representative?
              </p>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  value={isRepresentative}
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

                  {isRepresentative == "no" && (
                    <p
                      className="semi-bold tooltip-title relative"
                      style={{
                        marginLeft: "61px",
                        marginTop: "-42px",
                      }}
                    >
                      {/* Submit for yourself only. Add others later via e-mandate
                      request from your dashboard. */}
                      <Image className="bubble" src={bubble} alt="" />
                      <p className="hover-tip">
                        Submit for yourself only. Add others later via e-mandate
                        request from your dashboard
                      </p>
                    </p>
                  )}
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
              <div className="row legal-rep-yes  indivi-form">
                <div className="col-12 mb-3">
                  <InputField
                    error={formState.errors["first_name"]}
                    label=""
                    placeholder="First Name"
                    name="first_name"
                    control={control}
                    variant="filled"
                    className="bglight-ip"
                  />
                </div>
                <div className="col-12 mb-3">
                  <InputField
                    error={formState.errors["last_name"]}
                    label=""
                    placeholder="Last Name"
                    name="last_name"
                    control={control}
                    variant="filled"
                    className="bglight-ip"
                  />
                </div>
                <div className="col-12 mb-3">
                  <InputField
                    error={formState.errors["representative_email"]}
                    label=""
                    placeholder="Email Address"
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
                <div className="col-12 mb-3 google-loc">
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
                      defaultInputValue:
                        caseData?.groupInfo?.representativeLocation,
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

            {/* {isRepresentative == "no" && (
              <p className="semi-bold tooltip-title relative">
                Submit for yourself only. Add others later via e-mandate request
                from your dashboard.
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Submit for yourself only. Add others later via e-mandate
                  request from your dashboard
                </span>
              </p>
            )} */}
          </div>
          <div className="step-btns mt-3 d-flex  gap-3">
            <Button
              className="client-btn "
              type="submit"
              variant="contained"
              onClick={() => {
                errHandle();
              }}
            >
              Next
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
                    representativeLocation:
                      isRepresentative == "yes" ? representativeLocation : "",
                    representativeCoord:
                      isRepresentative == "yes" ? representativeCoord : {},

                    personData: isSpouse == "yes" ? groupData : [{}],
                  },
                  progress: 70,
                  //nextProgress: caseData.role == "directParty" ? 70 : 60,
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
