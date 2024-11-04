"use client";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { InputField } from "@/components/Form/InputField";
import React, { Dispatch, FormEvent, SetStateAction } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";
import axios from "axios";
import useSnackbar from "@/hooks/useSnackbar";
import SelectField from "@/components/Form/SelectField";
import LoadingButton from "@mui/lab/LoadingButton";

type Company = {
  voieadressagercs: string;
  siren: string;
  denoinsee: string;
  firstName: string;
  lastName: string;
};
type FormValues = {
  reg_no: string;
  companyName: string;
  legalRepresentative: string;
  date: string;
  first_name: string;
  last_name: string;
  address: string;
  phone_number: string;
  position: string;
  authoriseType: string;
  legalRepresentativeEmail: string;
};
type ContactValues = {
  directPhone: string;
  directEmail: string;
};
const options = [
  { label: "Corporate Officer", value: "Corporate Officer" },
  { label: "Legal Director", value: "Legal Director" },
  { label: "Special Representative", value: "Special Representative" },
  { label: "Provisional Administrator", value: "Provisional Administrator" },
  { label: "Ad Hoc", value: "Ad Hoc" },
];
export const CompanyForm = ({
  isIndividual,
  companyData,
  session,
}: {
  isIndividual: any;
  companyData: any;
  session: any;
}) => {
  const [show, setShow] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isAuthorized, setisAuthorized] = useState("");
  const [isloading, setLoad] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [directDetails, setDirectDetails] = useState<ContactValues>();
  const [isVal, setIsValue] = useState<boolean>(false);
  const [legalEmail, setLegalEmail] = useState("");
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const schema = z.object({
    reg_no: z
      .string()
      .min(1, "Registration Number is required")
      .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed"),
    companyName: show
      ? z.string().min(1, "Company Name is required")
      : z.string().optional(),
    legalRepresentative: show
      ? z.string().min(1, "Legal representative Name is required")
      : z.string().optional(),
    address: show
      ? z.string().min(1, "Address is required")
      : z.string().optional(),
    first_name: show
      ? z.string().min(1, "First Name is required")
      : z.string().optional(),
    last_name: show
      ? z
          .string({
            required_error: "Last name is required",
            invalid_type_error: "Last name is required",
          })
          .min(1, "Last name is required")
      : z.string().optional(),
    phone_number: show
      ? z.custom(isValidMobile, isValidMobileMsg)
      : z.string().optional(),

    position: showForm
      ? z
          .string({ required_error: "Position is required" })
          .min(1, "Position is required")
      : z.string().optional(),

    authoriseType:
      showForm && isAuthorized == "yes"
        ? z
            .string({
              required_error: "Please select authorization type",
              invalid_type_error: "Please select authorization type",
            })
            .min(1, "Please select authorization type")
        : z.string().optional(),

    legalRepresentativeEmail:
      showForm == true && isAuthorized == "no"
        ? z
            .string({ required_error: "Email is required" })
            .min(1, "Email is required")
            .regex(
              /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
              "Please enter the valid email address"
            )
        : z.string().optional(),
  });

  const contactSchema = z.object({
    directPhone: z.custom(isValidMobile, isValidMobileMsg),

    directEmail: z
      .string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .regex(
        /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
        "Please enter the valid email address"
      ),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, trigger } = methods;

  const { methods: contactMethods, setValues: setContactValues } = useHookForm<
    ContactValues,
    typeof contactSchema
  >(contactSchema);
  const { formState: contactFormState, control: contactControl } =
    contactMethods;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [registration, setRegistration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<Company>();
  const [isDisable, setDisable] = useState(false);

  const searchParams = useSearchParams();
  const caseId = searchParams?.get("caseId");

  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [openSnack, setOpenSnackbar] = useState(false);

  const router = useRouter();
  const [legal, setLegal] = useState("");
  const [lastname, setLastName] = useState("");
  const [matchReg, setRegNo] = useState("");
  useEffect(() => {
    setValues({
      reg_no: companyInfo?.siren ? companyInfo?.siren : registration,
      companyName: companyInfo?.denoinsee ? companyInfo?.denoinsee : "",
      legalRepresentative: companyInfo
        ? companyInfo?.firstName + " " + companyInfo?.lastName
        : "",
      first_name: session ? session?.user?.firstName : "",
      last_name: session?.user?.lastName ? session?.user?.lastName : lastname,
      address: companyInfo?.voieadressagercs
        ? companyInfo?.voieadressagercs
        : "",
    });
  }, [session, companyInfo]);

  useEffect(() => {
    setIsLoading(true);

    if (companyData) {
      setValues(companyData);
      setLastName(companyData?.last_name);
      setRegistration(companyData?.reg_no);
      // setRegNo(companyData?.reg_no);
      setLegalEmail(companyData?.legalRepresentativeEmail);
    }

    if (companyData?.directDetails) {
      setContactValues(companyData?.directDetails);
    }

    if (companyData && !companyData?.legalRepresentative) {
      setShow(false);
    }

    if (companyData && companyData?.legalRepresentative) {
      setShow(true);
    }

    if (companyData?.position) {
      setShowForm(true);
      setisAuthorized(companyData?.isAuthorized);
    }
    setLegal(companyData?.legalRepresentative);
    setIsLoading(false);
  }, [companyData]);

  useEffect(() => {
    //setShowForm(false);
    //setisAuthorized("");
    // setlegalEmail("");
    // setauthoriseType("");

    if (formState.errors["legalRepresentativeEmail"]) {
      return setEmailErr(false);
    }
  }, [formState.errors]);

  const handleEmailPoup = async () => {
    try {
      // setOpenDialog(true);
      if (formState.errors["legalRepresentativeEmail"]) {
        return setEmailErr(false);
      }
      if (!legalEmail) {
        return setEmailErr(true);
      }

      if (legalEmail !== "") {
        let isError;
        const pattern = /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/;
        const vals = pattern.test(legalEmail);
        if (!vals) {
          isError = true;
          return setEmailErr(true);
        } else {
          setEmailErr(false);
        }
      }

      setOpenSnackbar(true);
      await axios.post(`/api/client/authorized-mail`, {
        email: legalEmail,
        legalRepresentiveName: legal,
        employeeName: `${session.user.firstName} ${
          session.user.lastName ? session.user.lastName : ""
        }`,
      });
      //  setShowForm(false);
      // setisAuthorized("");
      // setlegalEmail("");
      // setauthoriseType("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCloses = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpenDialog(false);
    setOpenSnackbar(false);
  };

  const companyAddress = async () => {
    try {
      setLoad(true);
      setRegNo(registration);
      const data = await axios.get(
        `/api/client/company/companyInfo?registration=${registration}`
      );

      const legalData = await axios.get(
        `/api/client/company/legalInfo?registration=${registration}`
      );

      if (data?.data?.data && legalData?.data?.data?.data) {
        setShow(true);
        setIsValue(false);
      }

      setCompanyInfo({
        ...data?.data?.data.infolegales,
        firstName: legalData?.data?.data?.data?.dirigeants[0].prenompp ?? "",
        lastName: legalData?.data?.data?.data?.dirigeants[0].nompp ?? "",
      });
      setLoad(false);
    } catch (e: any) {
      setLoad(false);
      console.log(e);
      if (e && e?.response?.status == 400) {
        if (companyData?.reg_no !== registration) {
          setContactValues({
            directEmail: "",
            directPhone: "",
          });
        }

        setOpenDialog(true);
        setShow(false);
      }
    }
  };

  const [errors, setErrors] = useState({
    actErr: false,
  });

  const companyErrHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (showForm && !isAuthorized) {
      isError = true;
      errorObj = { ...errorObj, actErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

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

  const checkLegal = (data: any) => {
    if (!data.legalRepresentative) {
      openSnackbar({
        message:
          "We were unable to recognize your company. We will contact you as soon as possible.",
        type: "info",
      });
    }

    if (data.legalRepresentative) {
      setLegal(data.legalRepresentative);
      let isError = false;
      if (`${data.first_name} ${data.last_name}` !== data.legalRepresentative) {
        isError = true;
      }
      if (isError) {
        setShowForm(isError);
        //return true; // Indicate that there was an error
      } else {
        setShowForm(false);
        return setIsValue(true);
      }
    }
    return false; // No errors
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoad(true);
      //debugger;

      if (matchReg !== values.reg_no) {
        companyAddress();
        return setIsValue(false);
      }

      const companyErrors = companyErrHandle();
      if (companyErrors) {
        return;
      }
      checkLegal(values);

      const payload = {
        isIndividual,
        companyData: {
          ...values,
          isAuthorized,
          directDetails: isAuthorized ? {} : directDetails,
        },
        progress: 50,
        nextProgress: 50,
        caseId: caseId,
        individualData: {},
      };

      if (isVal || isAuthorized) {
        const caseData = await axios.post("/api/client/case/add-case", payload);
        if (caseData) {
          router.push(
            `/client/create-case?progress=${caseData?.data?.data?.progress}&caseId=${caseData?.data?.data._id}`
          );
        }
      }
    } catch (err) {
      console.log(err);
      setLoad(false);
    } finally {
      setLoad(false);
    }
  };

  const handleContact = async (values: ContactValues) => {
    try {
      setDirectDetails(values);
      setIsValue(true);
      setOpenDialog(false);
      setValues({
        companyName: "",
        legalRepresentative: "",
        address: "",
        first_name: "",
        last_name: "",
        phone_number: "",
        position: "",
        authoriseType: "",
        legalRepresentativeEmail: "",
      });
      setisAuthorized("");
      setShowForm(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="minors-form  indivi-form">
      {isLoading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-3">
              <InputField
                error={formState.errors["reg_no"]}
                label=""
                placeholder="Company Registration Number"
                name="reg_no"
                control={control}
                variant="filled"
                className="bglight-ip"
                emitChange={(val) => setRegistration(val)}
              />
            </div>

            {show && (
              <>
                <div className="col-12  col-md-6 mb-3">
                  <InputField
                    error={formState.errors["companyName"]}
                    label=""
                    placeholder="Company Name"
                    name="companyName"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
                <div className="col-12  col-md-6 mb-3">
                  <InputField
                    error={formState.errors["address"]}
                    label=""
                    placeholder="Company Address"
                    name="address"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <InputField
                    error={formState.errors["legalRepresentative"]}
                    label=""
                    placeholder="Legal Representative"
                    name="legalRepresentative"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                    emitChange={(val) => {
                      setLegal(val);
                    }}
                  />
                </div>
                <div className="col-12  col-md-6 mb-3">
                  <InputField
                    error={formState.errors["first_name"]}
                    label=""
                    placeholder="Your First Name"
                    name="first_name"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
                <div className="col-12  col-md-6 mb-3">
                  <InputField
                    error={formState.errors["last_name"]}
                    label=""
                    placeholder="Your Last Name"
                    name="last_name"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                    emitChange={(val) => setLastName(val)}
                  />
                </div>
                <div className="col-12  col-md-6 mb-3">
                  <InputPhone
                    error={formState.errors["phone_number"]}
                    label=""
                    name="phone_number"
                    control={control}
                    variant="filled"
                    className="bglight-ip phone"
                  />
                </div>
              </>
            )}
          </div>

          {show == true && showForm == true && (
            <>
              <div className="col-12 col-md-6 mb-3">
                <InputField
                  error={formState.errors["position"]}
                  label="Your Position in the Company"
                  name="position"
                  control={control}
                  variant="filled"
                  className="bglight-ip"
                />
              </div>
              <p className="f-20 mt-3 semi-bold">
                Are you authorized to act on the company&apos;s behalf?
              </p>
              <div className="authorize-company">
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={isAuthorized}
                    onChange={(e) => {
                      setisAuthorized(e.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.actErr = false;
                        return newErrorObj;
                      });

                      if (e.target.value == "yes") {
                        setValues({
                          legalRepresentativeEmail: "",
                        });
                      }
                      if (e.target.value == "no") {
                        setValues({
                          authoriseType: "",
                        });
                        //setauthoriseType("");
                      }
                      setIsValue(true);
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
                  {errors.actErr && (
                    <span className="text-danger">
                      Please select, the authorized act on the company
                    </span>
                  )}
                </FormControl>
                {isAuthorized == "yes" && (
                  <div className="row legal-rep-yes">
                    <div className="col-12 col-md-6 mb-3">
                      <SelectField
                        options={options}
                        label=""
                        name="authoriseType"
                        className="bglight-select"
                        error={formState.errors["authoriseType"]}
                        control={control}
                      />
                    </div>
                  </div>
                )}

                {isAuthorized == "no" && (
                  <div className="legal-rep-no">
                    <div className="row ">
                      <div className="col-12 col-md-6 mb-3">
                        <InputField
                          error={formState.errors["legalRepresentativeEmail"]}
                          label=""
                          placeholder="Email"
                          name="legalRepresentativeEmail"
                          control={control}
                          variant="filled"
                          className="bglight-ip"
                          emitChange={(val) => {
                            setLegalEmail(val);
                            setEmailErr(false);
                          }}
                        />
                        {emailErr && (
                          <span className="text-danger f-14">
                            Please enter the valid email address
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outlined"
                      className="green-border mt-3 mb-5"
                      onClick={() => handleEmailPoup()}
                      disabled={isDisable ? true : false}
                      // type="submit"
                    >
                      Send Request for Delegation of Signature
                    </Button>

                    {
                      <div>
                        {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
                        {/* <Snackbar
                          open={openSnack}
                          key="GrowTransition"
                          autoHideDuration={5000}
                          anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                          }}
                          onClose={handleCloses}
                          // message="Your request is being processed. You can continue, but the form cannot be finalized until authorization is confirmed."
                          message="Your request is currently being processed. You may continue to navigate the platform, but please note that we cannot proceed with your case until we have received and confirmed the necessary authorization"
                        /> */}

                        <Dialog
                          fullScreen={fullScreen}
                          open={openSnack}
                          onClose={
                            () => handleCloses
                            // setOpenDialog(false)
                          }
                          aria-labelledby="responsive-dialog-title"
                        >
                          <DialogTitle id="responsive-dialog-title"></DialogTitle>
                          <DialogContent>
                            <p className="f-18 text-center">
                              Your request is currently being processed. You may
                              continue to navigate the platform, but please note
                              that we cannot proceed with your case until we
                              have received and confirmed the necessary
                              authorization.
                            </p>
                          </DialogContent>
                          <DialogActions className="justify-content-center pb-4">
                            <Button
                              onClick={() => {
                                setDisable(true);
                                setOpenSnackbar(false);
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
                      </div>
                    }
                  </div>
                )}
              </div>
            </>
          )}

          <div className="step-btns mt-3 d-flex gap-3">
            <LoadingButton
              loading={isloading}
              variant="contained"
              size="large"
              type="submit"
              onClick={() => {
                companyErrHandle();
              }}
            >
              Next
            </LoadingButton>

            <Button
              variant={"outlined"}
              className="border-0 text-black text-decoration-underline"
              onClick={() => handlePrevious()}
            >
              Previous{" "}
            </Button>
          </div>
        </Form>
      )}

      {openDialog && (
        <Dialog
          fullScreen={fullScreen}
          open={openDialog}
          // onClose={() => setOpenDialog(false)}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title"></DialogTitle>
          <DialogContent>
            <p className="f-14 text-center">
              We were unable to recognize your company. Please provide your
              phone number and/or email address so we can contact you directly.
            </p>
          </DialogContent>

          <Form<ContactValues>
            onSubmit={handleContact}
            methods={contactMethods}
          >
            <DialogContent>
              <div className="row indivi-form">
                <div className="col-12  col-md-6 new-phone mb-3">
                  <InputPhone
                    error={contactFormState.errors["directPhone"]}
                    label=""
                    name="directPhone"
                    control={contactControl}
                    variant="filled"
                    className="bglight-ip phone"
                  />
                </div>

                <div className="col-12 col-md-6">
                  <InputField
                    error={contactFormState.errors["directEmail"]}
                    label=""
                    placeholder="Email"
                    name="directEmail"
                    control={contactControl}
                    variant="filled"
                    className="bglight-ip"
                  />
                </div>
              </div>
            </DialogContent>
            <DialogActions className="justify-content-center pb-4">
              <Button
                // onClick={() => {
                //   //setOpenDialog(false);
                // }}
                autoFocus
                className="submit-btn-all"
                type="submit"
                variant="contained"
              >
                Ok
              </Button>
            </DialogActions>
          </Form>
        </Dialog>
      )}
    </div>
  );
};
