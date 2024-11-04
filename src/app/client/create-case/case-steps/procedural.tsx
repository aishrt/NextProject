"use client";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { InputField } from "@/components/Form/InputField";
import React, { Dispatch, SetStateAction } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import DateField from "@/components/Form/DateField";
import TextAreaField from "@/components/Form/TextArea";
import SelectField from "@/components/Form/SelectField";
import bubble from "@/assets/info.png";
import Image from "next/image";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";
import axios from "axios";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useSelectFile } from "@/hooks/useSelectFile";
import { uploadFile } from "@/utils/upload";

type FormValues = {
  reason: string;
  claimDate: string;
  responseType: string;
  stepTakenResp: string;
  decisionDate: string;
  court: string;
  appealDate: string;
  appealCourt: string;
  notSatisfy: string;
  legalDescription: string;
  briefDescription: string;
  // first_name: string;
  // last_name: string;
  // address: string;
  // email: string;
  // phone: number;
  appeal: string;
  objectives: string;
  documents: BinaryData;
};

// interface
interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
  caseData: any;
}

export default function Procedural(props: IProps) {
  // Destructuring the props object
  const { handleChange, setProgressValue, caseData } = props;
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams?.get("caseId");

  const [initialStatus, setinitialStatus] = useState("");
  const [recievedResp, setRecievedResp] = useState("");
  const [isTakenResp, setTakenResp] = useState("");
  const [isSatisfied, setIsSatisfied] = useState("");
  const [isPrimaryGround, setIsPrimaryGround] = useState("");
  const [legalType, setLegal] = useState("");
  const [loading, setLoading] = useState(false);
  const [other, setOther] = React.useState("");

  const {
    file,
    preview,
    setPicturePreview,
    handleChange: handleDoc,
  } = useSelectFile();

  const schema = z.object({
    reason:
      initialStatus == "not_taken"
        ? z
            .string({
              required_error: "Please enter the Reason for Inaction",
              invalid_type_error: "Please enter the Reason for Inaction",
            })
            .min(1, "Please enter the Reason for Inaction")
        : z.string().optional(),
    claimDate:
      initialStatus == "amicable_claim"
        ? z
            .string({ required_error: "Please select the date of claim" })
            .min(1, "Please select the date of claim")
        : z.string().optional(),
    responseType:
      initialStatus == "amicable_claim" && recievedResp == "yes"
        ? z
            .string({
              required_error: "Please select",
              invalid_type_error: "Please select",
            })
            .min(1, "Please select")
        : z.string().optional(),

    stepTakenResp:
      initialStatus == "not_taken" && isTakenResp == "yes"
        ? z
            .string({
              required_error: "Please select",
              invalid_type_error: "Please select",
            })
            .min(1, "Please select")
        : z.string().optional(),

    decisionDate:
      initialStatus == "first_instance"
        ? z
            .string({ required_error: "Please select the date of decision" })
            .min(1, "Please select the date of decision")
        : z.string().optional(),
    court:
      initialStatus == "first_instance"
        ? z
            .string({ required_error: "This field is required" })
            .min(1, "This field is required")
        : z.string().optional(),

    notSatisfy:
      initialStatus == "first_instance" && isSatisfied == "no"
        ? z
            .string({ required_error: "This field is required" })
            .min(1, "This field is required")
        : z.string().optional(),

    appealDate:
      initialStatus == "appeal_procedure"
        ? z
            .string({ required_error: "Please select the appealed date filed" })
            .min(1, "Please select the appealed date filed")
            .refine(
              (date) => {
                if (new Date(date) <= new Date()) {
                  return true;
                }
              },
              {
                message: "Future date not allowed",
              }
            )
            .refine(
              (date) => {
                if (new Date(date).getFullYear() >= 2000 ) {
                  return true;
                }
              },
              {
                message: "Invalid year",
              }
            )
        : // .refine(
          //   (date) => new Date(date).getFullYear() == 0,
          //   "Invalid year"
          // )
          z.string().optional(),

    appealCourt:
      initialStatus == "appeal_procedure"
        ? z
            .string({ required_error: "This field is required" })
            .min(1, "This field is required")
        : z.string().optional(),

    appeal:
      initialStatus == "appeal_procedure" && isPrimaryGround == "yes"
        ? z
            .string({
              required_error: "Please select the primary legal ground",
              invalid_type_error: "Please select the primary legal ground",
            })
            .min(1, "Please select the primary legal ground")
        : z.string().optional(),

    legalDescription:
      initialStatus == "appeal_procedure" && isPrimaryGround == "yes"
        ? z
            .string({
              required_error: "Please enter the description",
            })
            .min(1, "Please enter the description")
        : z.string().optional(),
    briefDescription: z
      .string({ required_error: "Please enter the description" })
      .min(1, "Please enter the description"),
    objectives: z
      .string({
        required_error: "Please enter the expectations and objectives",
      })
      .min(1, "Please enter the expectations and objectives"),
    // first_name: z
    //   .string({ required_error: "First name is required" })
    //   .min(1, "First name is required"),
    // last_name: z
    //   .string({ required_error: "Last name is required" })
    //   .min(1, "Last name is required"),
    // address: z
    //   .string({ required_error: "Address is required" })
    //   .min(1, "Address is required"),
    // address: z.string().optional(),
    // phone: z.custom(isValidMobile, isValidMobileMsg),
    // email: z
    //   .string({ required_error: "Email is required" })
    //   .min(1, "Email is required")
    //   .regex(
    //     /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
    //     "Please enter a valid email"
    //   ),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const options = [
    { label: "Seeking Counsel", value: "Seeking Counsel" },
    { label: "Negotiation", value: "Negotiation" },
    { label: "Litigation", value: "Litigation" },
  ];
  const appeal = [
    { label: "Error of Law", value: "Error of Law" },
    { label: "Error of Fact", value: "Error of Fact" },
    { label: "Procedural Error", value: "Procedural Error" },
    { label: "Abuse of Discretion ", value: "Abuse of Discretion " },
    { label: "Other", value: "other" },
  ];

  const [location, setLocation] = useState();
  const [locationLatLong, setLocationLatLong] = useState({
    lat: 0,
    lng: 0,
  });
  const [valueArr, setValueArr] = useState(null);

  const [errors, setErrors] = useState({
    initialErr: false,
    responseErr: false,
    takenErr: false,
    satisfyErr: false,
    legalErr: false,
    addressErr: false,
    otherErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!initialStatus) {
      isError = true;
      errorObj = { ...errorObj, initialErr: true };
    }
    if (initialStatus == "amicable_claim" && !recievedResp) {
      isError = true;
      errorObj = { ...errorObj, responseErr: true };
    }
    if (initialStatus == "not_taken" && !isTakenResp) {
      isError = true;
      errorObj = { ...errorObj, takenErr: true };
    }
    if (initialStatus == "first_instance" && !isSatisfied) {
      isError = true;
      errorObj = { ...errorObj, satisfyErr: true };
    }

    if (initialStatus == "appeal_procedure" && !isPrimaryGround) {
      isError = true;
      errorObj = { ...errorObj, legalErr: true };
    }
    if (
      initialStatus == "appeal_procedure" &&
      isPrimaryGround == "yes" &&
      legalType == "other" &&
      !other
    ) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }

    // if (!location) {
    //   isError = true;
    //   errorObj = { ...errorObj, addressErr: true };
    // }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleChangeLocationArray = async (value: any) => {
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
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }
      let caseType: string = "";
      if (initialStatus == "not_taken" || initialStatus == "amicable_claim") {
        caseType = "preLitigation";
      } else if (
        initialStatus == "first_instance" ||
        initialStatus == "appeal_procedure"
      ) {
        caseType = "litigation";
      }
      setProgressValue(90);
      handleChange({
        caseType,
        proceduralStatus: {
          ...values,
          initialStatus: initialStatus,
          takenResponse: isTakenResp,
          recievedResponse: recievedResp,
          satisfiedDecision: isSatisfied,
          primaryLegal: isPrimaryGround,
          otherAppeal: other,
          // address: location,

          // locationLatLong,
        },
        progress: 90,
        nextProgress: 90,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const caseData = await axios.post("/api/client/case/add-case", {
        progress: 70,
        caseId: caseId,
      });
      router.push(`/client/create-case?progress=70&caseId=${caseId}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseData?.proceduralStatus) {
      setValues(caseData.proceduralStatus);
      setinitialStatus(caseData?.proceduralStatus?.initialStatus);
      setLocation(caseData?.proceduralStatus?.address);
      setRecievedResp(caseData?.proceduralStatus?.recievedResponse);
      setTakenResp(caseData?.proceduralStatus?.takenResponse);
      setIsSatisfied(caseData?.proceduralStatus?.isSatisfied);
      setIsPrimaryGround(caseData?.proceduralStatus?.isPrimaryGround);
    }
  }, [caseData]);

  return (
    <div>
      <h3 className="f-26  semi-bold  pb-2 fw-400">Procedural Status</h3>
      <div className="first-step indivi-form white-card rounded-lg p-5 imp-dates">
        <p className="f-26 fw-400">
          Let&apos;s assess your situation! Tell us how pressing your claim is
          and what you hope to achieve.
        </p>
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="spouse-info initial pt-3 pb-3">
            <p className="f-18 fw-500">Initial Status</p>
            <FormControl className="initial-status">
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                name="radio-buttons-group"
                value={initialStatus}
                onChange={(e) => {
                  setinitialStatus(e.target.value);
                  setErrors((prev) => {
                    let newErrorObj = { ...prev };
                    newErrorObj.initialErr = false;
                    return newErrorObj;
                  });
                }}
              >
                <FormControlLabel
                  value="not_taken"
                  control={<Radio />}
                  label=" I have not taken any steps yet"
                />
                <FormControlLabel
                  value="amicable_claim"
                  control={<Radio />}
                  label="I have initiated an amicable claim"
                />
                <FormControlLabel
                  value="first_instance"
                  control={<Radio />}
                  label="I have obtained a first-instance decision"
                />
                <FormControlLabel
                  value="appeal_procedure"
                  control={<Radio />}
                  label="I am involved in an appeal procedure"
                />
              </RadioGroup>
            </FormControl>

            {errors.initialErr && (
              <div className="text-danger">
                Please select the initial status
              </div>
            )}
          </div>
          {initialStatus == "not_taken" && (
            <div className="row not-taken">
              <div className="col-12 col-md-12 mb-3">
                <TextAreaField
                  error={formState.errors["reason"]}
                  label="Reason for Inaction*"
                  name="reason"
                  control={control}
                  variant="filled"
                  className="bglight-area"
                />
              </div>

              <p className="f-20  pt-3">Have you received a response?</p>
              <div className="col-12 col-md-12 mb-3">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={isTakenResp}
                    onChange={(e) => {
                      setTakenResp(e.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.takenErr = false;
                        return newErrorObj;
                      });
                    }}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />

                    {errors.takenErr && (
                      <span className="text-danger">
                        Please select, if response received
                      </span>
                    )}
                  </RadioGroup>
                </FormControl>

                {isTakenResp == "yes" && (
                  <div className="do-response">
                    <SelectField
                      options={options}
                      label="Select Type"
                      name="stepTakenResp"
                      error={formState.errors["stepTakenResp"]}
                      control={control}
                      variant="filled"
                      className="bglight-select"
                      emitChange={() => {}}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* second radio */}
          {initialStatus == "amicable_claim" && (
            <div className="row claim-taken">
              <div className="col-12 col-md-12 mb-3  date-input">
                <DateField
                  error={formState.errors["claimDate"]}
                  label="Date of Claim*"
                  name="claimDate"
                  control={control}
                  variant="filled"
                  className="bglight-area"
                />
              </div>
              <p className="f-20  pt-3">Have you received a response?</p>
              <div className="col-12 col-md-12 mb-3">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={recievedResp}
                    onChange={(e) => {
                      setRecievedResp(e.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.responseErr = false;
                        return newErrorObj;
                      });
                    }}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />

                    {errors.responseErr && (
                      <span className="text-danger">
                        Please select, if response received{" "}
                      </span>
                    )}
                  </RadioGroup>
                </FormControl>

                {recievedResp == "yes" && (
                  <div className="do-response">
                    <SelectField
                      options={options}
                      label="Select Type"
                      name="responseType"
                      error={formState.errors["responseType"]}
                      control={control}
                      variant="filled"
                      className="bglight-select"
                      emitChange={() => {}}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Third radio */}
          {initialStatus == "first_instance" && (
            <div className="row claim-taken decision">
              <div className="col-12 col-md-6 mb-3 date-input">
                <DateField
                  error={formState.errors["decisionDate"]}
                  label="Date of Decision*"
                  name="decisionDate"
                  control={control}
                  variant="filled"
                  className="bglight-area"
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <InputField
                  error={formState.errors["court"]}
                  label=""
                  placeholder="Court"
                  name="court"
                  control={control}
                  variant="filled"
                  className="bglight-ip"
                />
              </div>
              <p className="f-18 fw-400 pt-3">
                {" "}
                Are you satisfied with the decision?
              </p>
              <div className="col-12 col-md-12 mb-3">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={isSatisfied}
                    onChange={(e) => {
                      setIsSatisfied(e.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.satisfyErr = false;
                        return newErrorObj;
                      });
                    }}
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>

                  {errors.satisfyErr && (
                    <span className="text-danger">
                      Please select, if you satisfied with the decision
                    </span>
                  )}
                </FormControl>

                {isSatisfied == "no" && (
                  <div className="no-response">
                    <SelectField
                      options={options}
                      label="Select Type"
                      name="notSatisfy"
                      error={formState.errors["notSatisfy"]}
                      control={control}
                      variant="filled"
                      className="bglight-select"
                      emitChange={() => {}}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Fourth radio */}
          {initialStatus == "appeal_procedure" && (
            <div className="row claim-taken appeal">
              <div className="col-12 col-md-6 mb-3  date-input">
                <DateField
                  error={formState.errors["appealDate"]}
                  label="Date Appeal Filed"
                  name="appealDate"
                  control={control}
                  variant="filled"
                  className="bglight-area"
                  disableFuture={true}
                />
              </div>
              <div className="col-12 col-md-6 mb-3">
                <InputField
                  error={formState.errors["appealCourt"]}
                  label=""
                  placeholder="Appeal Court"
                  name="appealCourt"
                  control={control}
                  variant="filled"
                  className="bglight-ip"
                />
              </div>
              <p className="f-20 fw-500  pt-3">
                Do you know the primary legal ground for appeal?
              </p>
              <div className="col-12 col-md-12 mb-3">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={isPrimaryGround}
                    onChange={(e) => {
                      setIsPrimaryGround(e.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.legalErr = false;
                        return newErrorObj;
                      });
                    }}
                    name="radio-buttons-group"
                  >
                    <FormControlLabel
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                    {errors.legalErr && (
                      <span className="text-danger">
                        Please select, if you know the primary legal ground{" "}
                      </span>
                    )}
                  </RadioGroup>
                </FormControl>

                {isPrimaryGround == "yes" && (
                  <div>
                    <p className="f-15 fw-500  pt-3">
                      Select the primary legal ground for appeal
                    </p>
                    <div className="appeal-select mb-3">
                      <SelectField
                        options={appeal}
                        label=""
                        name="appeal"
                        error={formState.errors["appeal"]}
                        control={control}
                        variant="filled"
                        className="bglight-select"
                        emitChange={(val: any) => {
                          setLegal(val);
                        }}
                      />
                    </div>

                    {legalType == "other" && (
                      <div className="my-4">
                        <TextField
                          fullWidth
                          id="filled-basic"
                          label="Other"
                          variant="filled"
                          value={other}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setOther(event.target.value);
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.otherErr = false;
                              return newErrorObj;
                            });
                          }}
                        />

                        {errors.otherErr && (
                          <span className="text-danger">
                            Please describe the other statement
                          </span>
                        )}
                      </div>
                    )}

                    <div className="others mb-3">
                      <TextAreaField
                        error={formState.errors["legalDescription"]}
                        label="Description of the legal ground"
                        name="legalDescription"
                        control={control}
                        variant="filled"
                        className="bglight-area"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <hr />

          <p className="f-18 fw-400 pt-3">
            <strong className="f-16">Important Case Elements:</strong> Please
            list and briefly describe any important elements of your case. These
            could include Expert Reports (?), Witness Testimonies (?), Photos or
            Videos (?), Documents.
          </p>
          <div className="expectations mb-3">
            <TextAreaField
              error={formState.errors["briefDescription"]}
              label=""
              name="briefDescription"
              placeholder="Description"
              control={control}
              variant="filled"
              className="bglight-area"
            />
          </div>
          <div className="expectations mb-3">
            <TextAreaField
              error={formState.errors["objectives"]}
              label=""
              placeholder="Expectations and Objectives"
              name="objectives"
              control={control}
              variant="filled"
              className="bglight-area"
            />
          </div>
          <div style={{ marginBottom: "20px", paddingBottom: "10px" }}>
            <label>Upload Documents</label>
            <InputField
              type="file"
              error={formState.errors["documents"]}
              label=""
              name="documents"
              control={control}
              variant="filled"
              className="bglight-ip"
            />
          </div>

          <div className="step-btns mt-3 d-flex  gap-3">
            <Button
              className="client-btn"
              type="submit"
              variant="contained"
              onClick={() => errHandle()}
            >
              Next
            </Button>
            <Button
              variant={"outlined"}
              className="border-0 text-black text-decoration-underline"
              onClick={() => {
                handlePrevious();
              }}
            >
              Previous
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
