import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
  formGroupClasses,
} from "@mui/material";
import Image from "next/image";
import bubble from "@/assets/info.png";
import PhoneInput from "react-phone-number-input";
import { isValidMobileMsg, isValidMobile } from "@/components/Form/InputPhone";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import SelectField from "@/components/Form/SelectField";

interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
  caseData: any;
}

const orgtype = [
  { label: "Lawyer", value: "Lawyer" },
  { label: "Collection Agency", value: "Collection Agency" },
  { label: "Legal Funder", value: "Legal Funder" },
  { label: "Other", value: "Other" },
];

export default function Representation(props: IProps) {
  // Destructuring the props object
  const { handleChange, setProgressValue, caseData } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const caseId = searchParams ? searchParams.get("caseId") : null;

  const [loading, setLoading] = useState(false);

  const [legalSupport, setLegalSupport] = useState("");
  const [legalSupportType, setlegalSupportType] = useState<any>();
  const [legalSupportOption, setlegalSupportOption] = useState("");
  const [legalSupportName, setlegalSupportName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<any>("");

  const [insurance, setinsurance] = useState("");

  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [policyNumber, setPolicyNumber] = useState("");
  const [coverage, setCoverage] = useState("");

  const [errors, setErrors] = useState({
    legalErr: false,
    legalTypeErr: false,
    nameErr: false,
    contactErr: false,
    otherErr: false,
    insuranceErr: false,
    emailErr: false,
    phoneErr: "",
    err: false,
  });

  //functions
  const handleLs = (event: any, newValue: any) => {
    setlegalSupportType(newValue);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.legalTypeErr = false;
      return newErrorObj;
    });
  };

  const phoneErrHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (legalSupport == "yes" && phone) {
      const abc = isValidMobile(phone);
      console.log(abc);

      const test = isValidMobileMsg(phone);
      if (!test.message) {
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

  const emailErrHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (legalSupport == "yes" && email) {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const vals = pattern.test(email);
      if (!vals) {
        isError = true;
        errorObj = { ...errorObj, emailErr: true };
      } else {
        errorObj = { ...errorObj, emailErr: false };
      }
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!legalSupport) {
      isError = true;
      errorObj = { ...errorObj, legalErr: true };
    }

    if (legalSupport == "yes" && !legalSupportType) {
      isError = true;
      errorObj = { ...errorObj, legalTypeErr: true };
    }

    if (
      legalSupport == "yes" &&
      legalSupportType?.value == "Other" &&
      !legalSupportOption
    ) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }

    if (!legalSupportName && legalSupport == "yes") {
      isError = true;
      errorObj = { ...errorObj, nameErr: true };
    }

    // if (!email && legalSupport == "yes") {
    //   isError = true;
    //   errorObj = { ...errorObj, emailErr: true };
    // }

    if (legalSupport == "yes" && !email && !phone) {
      isError = true;
      errorObj = { ...errorObj, err: true };
    }
    // if (legalSupport == "yes" && email) {
    //   const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    //   const vals = pattern.test(email);
    //   if (!vals) {
    //     isError = true;
    //     errorObj = { ...errorObj, emailErr: true };
    //   } else {
    //     errorObj = { ...errorObj, emailErr: false };
    //   }
    // }
    emailErrHandle();
    if (!insurance) {
      isError = true;
      errorObj = { ...errorObj, insuranceErr: true };
    }

    phoneErrHandle();

    // if (legalSupport == "yes" && !phone) {
    //   isError = true;
    //   errorObj = { ...errorObj, phoneErr: "Phone number is required" };
    // }
    // if (legalSupport == "yes" && phone) {
    //   const abc = isValidMobile(phone);
    //   console.log(abc);

    //   const test = isValidMobileMsg(phone);
    //   if (!test.message) {
    //     errorObj = { ...errorObj, phoneErr: "" };
    //   } else {
    //     isError = true;
    //     errorObj = { ...errorObj, phoneErr: test.message };
    //   }
    // }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleRepresentation = () => {
    if (errHandle()) {
      return;
    }

    setProgressValue(caseData.role == "directParty" ? 70 : 60);
    handleChange({
      legalInsurance: insurance,
      legalSupport: legalSupport,
      legalSupportName: legalSupportName,
      legalSupportType: legalSupportType ? legalSupportType.value : "",
      otherLegalSupportType: legalSupportOption,
      legalSupportContact: phone,
      legalSupportEmail: email,
      insuranceProvider,
      policyNumber,
      coverage,
      progress: caseData.role == "directParty" ? 70 : 60,
      nextProgress: caseData.role == "directParty" ? 70 : 60,
    });
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const data = await axios.post("/api/client/case/add-case", {
        progress: 40,
        caseId: caseId,
      });
      router.push(`/client/create-case?progress=40&caseId=${caseId}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLegalSupport(caseData?.legalSupport);
    setlegalSupportType(caseData?.legalSupportType);
    setlegalSupportName(caseData?.legalSupportName);
    setEmail(caseData?.legalSupportEmail);
    setPhone(caseData?.legalSupportContact);
    setinsurance(caseData?.legalInsurance);
    setInsuranceProvider(caseData?.insuranceProvider);
    setPolicyNumber(caseData?.policyNumber);
    setCoverage(caseData?.coverage);
    setLoading(false);
  }, [caseId, caseData]);

  return (
    <>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <div className="first-step white-card rounded-lg represent-form p-5">
          <h3 className="f-26 fw-400 pb-3">
            Do you already have legal support? Let us know!{" "}
          </h3>
          <p className="f-18 fw-500">
            Do you currently have legal representation for your case?
          </p>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={legalSupport}
              onChange={(e) => {
                setLegalSupport(e.target.value);
                setErrors((prev) => {
                  let newErrorObj = { ...prev };
                  newErrorObj.legalErr = false;
                  return newErrorObj;
                });
              }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
            {errors.legalErr && (
              <span className="text-danger f-14">
                {" "}
                Please select, if you have legal representation
              </span>
            )}
          </FormControl>
          {legalSupport == "yes" && (
            <div className="row legal-rep-yes">
              <div className="col-12 mb-3">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={orgtype}
                  value={legalSupportType}
                  fullWidth
                  onChange={handleLs} // Handle option change
                  renderInput={(params) => (
                    <TextField {...params} label="Organization Type" />
                  )}
                />
                {legalSupportType && legalSupportType.value == "Other" && (
                  <div className="col-12 mb-3 mt-3">
                    <TextField
                      fullWidth
                      label="Other"
                      name="other"
                      variant="filled"
                      className="bglight-ip"
                      onChange={(e) => {
                        setlegalSupportOption(e.target.value);
                        setErrors((prev) => {
                          let newErrorObj = { ...prev };
                          newErrorObj.otherErr = false;
                          return newErrorObj;
                        });
                      }}
                    />
                    {errors.otherErr && (
                      <span className="text-danger f-14">
                        Please specify the other statement
                      </span>
                    )}
                  </div>
                )}

                {errors.legalTypeErr && (
                  <span className="text-danger f-14">Please select type</span>
                )}
              </div>
              <div className="col-12 mb-3">
                <TextField
                  fullWidth
                  label="Name"
                  name="legal_name"
                  variant="filled"
                  value={legalSupportName}
                  className="bglight-ip"
                  onChange={(e) => {
                    setlegalSupportName(e.target.value);
                    setErrors((prev) => {
                      let newErrorObj = { ...prev };
                      newErrorObj.nameErr = false;
                      return newErrorObj;
                    });
                  }}
                />
                {errors.nameErr && (
                  <span className="text-danger f-14">Please enter name</span>
                )}
              </div>
              <label>Direct Contact</label>
              <div className="col-12 mb-3">
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  variant="filled"
                  className="bglight-ip"
                  value={email}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(event.target.value);
                    setErrors((prev) => {
                      let newErrorObj = { ...prev };
                      newErrorObj.emailErr = false;
                      newErrorObj.err = false;
                      return newErrorObj;
                    });
                    if (emailErrHandle()) {
                      return;
                    }
                  }}
                />
                {errors.emailErr && (
                  <span className="text-danger">
                    Please enter a valid email
                  </span>
                )}
              </div>
              <div className="col-12  mb-3">
                <PhoneInput
                  className="form-control phone-control"
                  placeholder="Enter phone number"
                  value={phone}
                  defaultCountry="FR"
                  isValidPhoneNumber={true}
                  onChange={(value) => {
                    setPhone(value);
                    setErrors((prev) => {
                      let newErrorObj = { ...prev };
                      newErrorObj.phoneErr = "";
                      newErrorObj.err = false;
                      return newErrorObj;
                    });
                    if (phoneErrHandle()) {
                      return;
                    }
                  }}
                />
                {errors.phoneErr && (
                  <span className="text-danger">{errors.phoneErr}</span>
                )}
              </div>
              {errors.err && (
                <span className="text-danger">
                  Please select the at least one of the email or phone number
                  fields
                </span>
              )}
            </div>
          )}

          <p className="f-18 fw-500  mt-5">Do you have any legal insurance or protection coverage?
          <span className="bubble-tool tooltip-title relative"> 
            <Image className="bubble" src={bubble} alt="" />
            <span className="hover-tip">
              Legal insurance/protection helps with dispute costs. It might be a
              separate policy or part of your home, car, or business insurance.
            </span>
            </span>
          </p>

          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={insurance}
              onChange={(e) => {
                setinsurance(e.target.value);
                setErrors((prev) => {
                  let newErrorObj = { ...prev };
                  newErrorObj.insuranceErr = false;
                  return newErrorObj;
                });
              }}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              {insurance == "yes" && (
                <>
                  <label>
                    Could you please provide the details of your legal insurance
                    or protection coverage ?
                  </label>
                  <div className="row">
                    <div className="col-12 mb-3 mt-3">
                      <TextField
                        fullWidth
                        label="Insurance provider"
                        value={insuranceProvider}
                        name="insuranceProvider"
                        variant="filled"
                        className="bglight-ip"
                        onChange={(e) => {
                          setInsuranceProvider(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-12 mb-3 mt-2">
                      <TextField
                        fullWidth
                        label="Policy number"
                        value={policyNumber}
                        name="policyNumber"
                        variant="filled"
                        className="bglight-ip"
                        onChange={(e) => {
                          setPolicyNumber(e.target.value);
                        }}
                      />
                    </div>

                    <div className="col-12 mb-3 mt-2">
                      <TextField
                        fullWidth
                        label="Coverage limits"
                        name="coverage"
                        value={coverage}
                        variant="filled"
                        className="bglight-ip"
                        onChange={(e) => {
                          setCoverage(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </>
              )}
              <FormControlLabel value="no" control={<Radio />} label="No" />
              <FormControlLabel
                value="not-sure"
                control={<Radio />}
                label="I'm not sure"
              />
            </RadioGroup>
            {errors.insuranceErr && (
              <span className="text-danger f-14">
                {" "}
                Please select the legal insurance
              </span>
            )}
          </FormControl>
          <div className="step-btns mt-3 d-flex gap-3">
            <Button
              // variant={minor == "true" ? "contained" : "outlined"}
              variant="contained"
              className="client-btn"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                handleRepresentation();
              }}
            >
              Next
            </Button>
            <Button
              variant="outlined"
              className="border-0 text-black text-decoration-underline"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                handlePrevious();
              }}
            >
              Previous
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
