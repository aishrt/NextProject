"use client";
import { Button, CircularProgress, TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Image from "next/image";
import roles from "@/assets/role.png";
import PhoneInput from "react-phone-number-input";
import { isValidMobileMsg, isValidMobile } from "@/components/Form/InputPhone";

import person from "@/assets/businessman.png";
import group from "@/assets/group-silhouette.png";
import document from "@/assets/file.png";
import shield from "@/assets/secure.png";

import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
  caseData: any;
}

// cards data
const cardData = [
  {
    label: "Directly Affected Party",
    value: "I am the person or company directly harmed.",
    image: person,
  },
  {
    label: "Lead Representative",
    value: "I was harmed, and I'm representing a group with the same issue.",
    image: group,
  },
  {
    label: "Authorized Representative",
    value: "I handle legal and financial matters for someone else's claim. ",
    image: document,
  },
  {
    label: "Trusted Person",
    value:
      "I'm a legal professional or authorized association (per the law of July 1, 1901).",
    image: shield,
  },
];

export default function YourRole(props: IProps) {
  // Destructuring the props object

  const { handleChange, setProgressValue, caseData } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const caseId = searchParams && searchParams.get("caseId");
  const [loading, setLoading] = useState(false);

  const [activeCard, setActiveCard] = useState(-1);
  const [role, setRole] = useState("");
  const [personEmail, setPersonEmail] = useState("");
  const [personPhone, setPersonPhone] = useState<any>("");

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

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!role) {
      isError = true;
      errorObj = { ...errorObj, roleErr: true };
    }
    if (
      (role == "authRepresentative" || role == "trustedPerson") &&
      !personEmail
    ) {
      isError = true;
      errorObj = { ...errorObj, emailErr: true };
    }
    if (
      role == "authRepresentative" ||
      (role == "trustedPerson" && personEmail != "")
    ) {
      const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const vals = pattern.test(personEmail);
      if (!vals) {
        isError = true;
        errorObj = { ...errorObj, emailErr: true };
      } else {
        errorObj = { ...errorObj, emailErr: false };
      }
    }

    if (
      (role == "authRepresentative" || role == "trustedPerson") &&
      !personPhone
    ) {
      isError = true;
      errorObj = { ...errorObj, phoneErr: "Phone number is required" };
    }

    // if (
    //   role == "authRepresentative" ||
    //   (role == "trustedPerson" && personPhone != "")
    // ) {
    //   const abc = isValidMobile(personPhone);
    //   console.log(abc);

    //   const test = isValidMobileMsg(personPhone);
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

  // functions
  const handleNext = () => {
    if (errHandle()) {
      return;
    }
    setProgressValue(40);
    if (role == "directParty" || role == "leadRepresentative") {
      handleChange({
        progress: 40,
        nextProgress: 40,
        role: role,
      });
    } else {
      handleChange({
        progress: 40,
        nextProgress: 40,
        personEmail,
        personPhone,
        role: role,
      });
    }
  };

  //   const handleNext = (resumeLater = "") => {
  //     setProgressValue(30)
  //     return handleChange({ progress: 30, resumeLater: resumeLater })
  // }

  const hadnleSetCard = (index: number) => {
    setActiveCard(index);
    if (index == 0) {
      setRole("directParty");
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.roleErr = false;
        return newErrorObj;
      });
    } else if (index == 1) {
      setRole("leadRepresentative");
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.roleErr = false;
        return newErrorObj;
      });
    } else if (index == 2) {
      setRole("authRepresentative");
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.roleErr = false;
        return newErrorObj;
      });
    } else if (index == 3) {
      setRole("trustedPerson");
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.roleErr = false;
        return newErrorObj;
      });
    }
  };
  console.log(role);

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const caseData = await axios.post("/api/client/case/add-case", {
        progress: 20,
        caseId: caseId,
      });
      router.push(`/client/create-case?progress=20&caseId=${caseId}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseData) {
      const role = caseData?.role;
      const email = caseData?.personEmail;
      const phone = caseData?.personPhone;
      setRole(role);
      if (role == "directParty") {
        setActiveCard(0);
      } else if (role == "leadRepresentative") {
        setActiveCard(1);
      } else if (role == "authRepresentative") {
        setActiveCard(2);
      } else if (role == "trustedPerson") {
        setActiveCard(3);
      }
      setPersonEmail(email);
      setPersonPhone(phone);
    }
  }, [caseData]);

  return (
    <>
      {loading ? (
        <div className="text-center mt-5">
          {" "}
          <CircularProgress />{" "}
        </div>
      ) : (
        <div className="first-step white-card rounded-lg p-5">
          {/* <h3 className="f-26 bold">Tell Us Your Role</h3> */}
          <p className="f-26 fw-400 pb-1">
            Select the option that best describes you:
          </p>

          <div className="row role-client-rw">
            {cardData.map((card, index) => (
              <div
                key={index}
                className={`col-12 col-md-6 col-xxl-3 mb-4 ${
                  activeCard === index ? "active" : ""
                }`}
              >
                <div
                  className="loan-inner-card bggreen d-flex flex-wrap  text-black mb-3"
                  onClick={() => hadnleSetCard(index)}
                >
                  <div className="role-icon-top">
                    <Image src={card?.image ?? ""} alt="role" />
                  </div>
                  <div className="roles-right-dta pl-2">
                    <h4 className="f-18  mb-2">{card.label}</h4>
                    <p className="f-14 mb-0">{card.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {errors.roleErr && (
            <span className="text-danger">Please select the role</span>
          )}

          {activeCard == 2 || activeCard == 3 ? (
            <>
              <p className="f-20 semi-bold pt-3 mb-2">
                Authorized Representative/Trusted Person:
              </p>
              <p className="f-14">
                Welcome! As an authorized representative or trusted person,
                you&apos;ll have special access. To expedite the setup, please
                tell us how to contact you:
              </p>
              <form className="indivi-form">
                <div className="row mt-3">
                  <div className="col-12 col-md-6 mb-3">
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      variant="filled"
                      className="bglight-ip rounded p-1"
                      value={personEmail}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setPersonEmail(event.target.value);
                        setErrors((prev) => {
                          let newErrorObj = { ...prev };
                          newErrorObj.emailErr = false;
                          return newErrorObj;
                        });
                      }}
                    />
                    {errors.emailErr && (
                      <span className="text-danger">
                        Please enter a valid email
                      </span>
                    )}
                  </div>

                  <div className="col-12 col-md-6 mb-3">
                    <PhoneInput
                      className="form-control phone-control"
                      placeholder="Enter phone number"
                      value={personPhone}
                      defaultCountry="FR"
                      isValidPhoneNumber={true}
                      onChange={(value) => {
                        setPersonPhone(value);
                        phoneErrHandle(value);
                      }}
                    />
                    {errors.phoneErr && (
                      <span className="text-danger">{errors.phoneErr}</span>
                    )}
                    {/* {!personPhoneErr &&
                      personPhone &&
                      (personPhone.replace(/\D/g, "").length < 10 ||
                        personPhone.replace(/\D/g, "").length > 10) && (
                        <span className="text-danger">
                          Phone number must be exactly 10 digits long
                        </span>
                      )} */}
                  </div>
                </div>
              </form>
            </>
          ) : null}
          <div className="step-btns mt-3 d-flex gap-3">
            <Button
              // variant={minor == "true" ? "contained" : "outlined"}
              variant="contained"
              className="client-btn"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                handleNext();
              }}
            >
              Next
            </Button>
            <Button
              variant="outlined"
              className="border-0 text-black text-decoration-underline"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                //handleSaveLater();
                // handleNext("resumeLater");
                handlePrevious();
              }}
            >
              Previous{" "}
            </Button>

            {/* <Button
              variant="outlined"
              className="green-border"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                //handleSaveLater();
                handleNext("resumeLater");
              }}
            >
              Save and resume later
            </Button> */}
          </div>
        </div>
      )}
    </>
  );
}
