import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { Button, Radio } from "@mui/material";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import Form from "@/components/Form/Form";
import { z } from "zod";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";
import PhoneInput from "react-phone-number-input";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
// interface
interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
  caseData: any;
}
type Company = {
  voieadressagercs: string;
  siren: string;
  denoinsee: string;
  firstName: string;
  lastName: string;
};
type FormValuesIndivisual = {
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
};

type FormValuesCompany = {
  reg_no: string;
  companyName: string;
  legal: string;
  address: string;
  contact_name: string;
  phone_no: string;
  contact_email: string;
};

// const schemaIndivisual = z.object({
//   first_name: z
//     .string({ required_error: "First Name is required" })
//     .min(1, "First Name is required"),
//   last_name: z
//     .string({ required_error: "Last Name is required" })
//     .min(1, "Last Name is required"),
//   address: z.string().min(1, "Address is required"),
//   email: z
//     .string()
//     .min(1, "")
//     .regex(
//       /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
//       "Please enter a valid email"
//     )
//     .optional(),
//   phone_no: z.string().min(1, "Phone is required").optional(),
// });

const schemaIndivisual = (email: string, phone: any): z.ZodSchema => {
  return z.object({
    first_name: z
      .string({ required_error: "First Name is required" })
      .min(1, "First Name is required"),
    last_name: z
      .string({ required_error: "Last Name is required" })
      .min(1, "Last Name is required"),
    email: email
      ? z
          .string()
          // .min(0, "")
          .regex(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
            "Please enter a valid email"
          )
      : z.string().optional(),
    // phone_no: z.string().min(1, "Phone is required").optional(),
    phone_no: phone
      ? z.custom(isValidMobile, isValidMobileMsg)
      : z.string().optional(),
  });
};

export default function OpposingParty(props: IProps) {
  // Destructuring the props object
  const [show, setShow] = useState(false);

  const [name, setName] = useState("");

  const [directEmail, setDirectEmail] = useState("");

  const [directPhone, setDirectPhone] = useState("");
  const schemaCompany = z.object({
    reg_no: z
      .string()
      .min(1, "Registration Number is required")
      .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed"),

    companyName: show
      ? z
          .string({ required_error: "Company Name is required" })
          .min(1, "Company Name is required")
      : z.string().optional(),
    address: show
      ? z.string().min(1, "Address is required")
      : z.string().optional(),
    legal: show
      ? z
          .string({ required_error: "Legal representative is required" })
          .min(1, "Legal representative is required")
      : z.string().optional(),

    contact_name: name
      ? z
          .string({ required_error: "Contact name is required" })
          .min(1, "Contact name is required")
      : z.string().optional(),

    phone_no: directPhone
      ? z.custom(isValidMobile, isValidMobileMsg)
      : z.string().optional(),
    contact_email: directEmail
      ? z
          .string({ required_error: "Contact email is required" })
          .min(1, "Contact email is required")
          .regex(
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/,
            "Please enter a valid email"
          )
      : z.string().optional(),
  });

  const { handleChange, setProgressValue, caseData } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const caseId = searchParams?.get("caseId");
  const [opposing, setOpposing] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState<any>("");

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [valueArr, setValueArr] = useState(null);
  const [companyArr, setCompanyArr] = useState(null);
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [companylocation, setCompanyLocation] = useState("");
  const [err, setErr] = useState<boolean>(false);
  const [locationLatLng, setLatLong] = useState({
    lat: 0,
    lng: 0,
  });

  const [companyLatLng, setCompanyLatLong] = useState({
    lat: 0,
    lng: 0,
  });
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { methods: indivisualMethods, setValues: setValueIndivisual } =
    useHookForm<FormValuesIndivisual>(schemaIndivisual(email, phone));
  const { formState: formStateIndivisual, control: controlIndivisual } =
    indivisualMethods;

  const { methods: companyMethods, setValues: setValueCompany } = useHookForm<
    FormValuesCompany,
    typeof schemaCompany
  >(schemaCompany);
  const { formState: formStateCompany, control: controlCompany } =
    companyMethods;

  const [registration, setRegistration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<Company>();
  const [openDialog, setOpenDialog] = useState(false);

  //functions
  const handleOpposing = (value: string) => {
    setOpposing(value);
    setErr(false);
  };

  const [errors, setErrors] = useState({
    addressErr: false,
    companyAddressErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (opposing == "individual" && !location) {
      isError = true;
      errorObj = { ...errorObj, addressErr: true };
    }

    // if (opposing == "company" && !companylocation) {
    //   isError = true;
    //   errorObj = { ...errorObj, companyAddressErr: true };
    // }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handlecompanyLocation = async (value: any) => {
    try {
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.companyAddressErr = false;
        return newErrorObj;
      });
      const placeId = value?.value?.place_id;
      const { data } = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${googleMapsApiKey}`
      );
      const location = data?.results[0]?.formatted_address;
      const coordinates = data?.results[0]?.geometry?.location;

      if (location) {
        setCompanyLocation(location);
        setCompanyLatLong(coordinates);
        setCompanyArr(value);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLocation = async (value: any) => {
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
          setLatLong(coordinates);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  console.log(formStateIndivisual.errors);

  const handleSubmit = (values: any) => {
    try {
      if (errHandle()) {
        return;
      }
      setProgressValue(80);
      if (opposing == "individual") {
        handleChange({
          opposingIndividual: { ...values, location, locationLatLng },
          opposing,
          progress: 80,
          nextProgress: 80,
        });
      }
      if (opposing == "company") {
        handleChange({
          // opposingCompany: { ...values, companylocation, companyLatLng },
          opposingCompany: { ...values },
          opposing,
          progress: 80,
          nextProgress: 80,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setValueCompany({
      reg_no: companyInfo?.siren ? companyInfo?.siren : "",
      companyName: companyInfo?.denoinsee ? companyInfo?.denoinsee : "",
      legal: companyInfo
        ? companyInfo?.firstName + " " + companyInfo?.lastName
        : "",
      address: companyInfo?.voieadressagercs
        ? companyInfo?.voieadressagercs
        : "",
    });
  }, [companyInfo]);

  const companyAddress = async () => {
    try {
      setIsLoading(true);
      const data = await axios.get(
        `/api/client/company/companyInfo?registration=${registration}`
      );
      const legalData = await axios.get(
        `/api/client/company/legalInfo?registration=${registration}`
      );

      if (data?.data?.data && legalData?.data?.data?.data) {
        setShow(true);
      }

      setCompanyInfo({
        ...data?.data?.data.infolegales,
        firstName: legalData?.data?.data?.data?.dirigeants[0].prenompp,
        lastName: legalData?.data?.data?.data?.dirigeants[0].nompp,
      });
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);

      if (e && e?.response?.status == 400) {
        setOpenDialog(true);
        setShow(false);
        setValueCompany({
          companyName: "",
          address: "",
          legal: "",
        });
      }
    }
  };

  useEffect(() => {
    if (registration) {
      const data = setTimeout(() => {
        companyAddress();
      }, 1000);
      return () => clearTimeout(data);
    }
  }, [registration]);
  const handlePrevious = async () => {
    try {
      setLoading(true);
      const data = await axios.post("/api/client/case/add-case", {
        progress: caseData.role == "directParty" ? 50 : 60,
        caseId: caseId,
      });
      let pro = caseData.role == "directParty" ? 50 : 60;
      router.push(`/client/create-case?progress=${pro}&caseId=${caseId}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (caseData) {
      setOpposing(caseData?.opposing);
    }

    if (caseData?.opposingIndividual) {
      setValueIndivisual(caseData?.opposingIndividual);
      setLocation(caseData?.opposingIndividual?.location);
    }

    if (caseData?.opposingCompany) {
      setValueCompany(caseData?.opposingCompany);
      //setLocation(caseData?.opposingIndividual?.location);
    }

    if (
      caseData?.opposingCompany?.companyName ||
      caseData?.opposingCompany?.address ||
      caseData?.opposingCompany?.legal
    ) {
      setShow(true);
    }
  }, [caseData]);
  console.log(formStateCompany.errors);

  return (
    <div className="first-step white-card rounded-lg represent-form oppose p-5">
      <h3 className="f-26 fw-400 pb-3">
        To help us investigate, please provide details about the opposing party.
      </h3>

      <p className="f-20 fw-500 pt-2">Type of Opposing Party</p>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          name="radio-buttons-group"
          value={opposing}
          onChange={(e) => handleOpposing(e.target.value)}
        >
          <FormControlLabel
            value="individual"
            control={<Radio />}
            label="Individual"
          />
          <FormControlLabel
            value="company"
            control={<Radio />}
            label="Company"
          />
        </RadioGroup>
      </FormControl>
      {err && (
        <p className="text-danger f-14">
          Please select the type of opposing party
        </p>
      )}
      {!opposing && (
        <div className="step-btns mt-3 d-flex  gap-3">
          <Button
            className="client-btn "
            type="submit"
            variant="contained"
            onClick={() => {
              if (!opposing) {
                setErr(true);
              }
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
      )}
      <div className="indivi-form">
        {opposing == "individual" && (
          <Form<FormValuesIndivisual>
            onSubmit={handleSubmit}
            methods={indivisualMethods}
          >
            <div className="spouse-info opposing-party pb-3">
              <p className="f-18 fw-500 pt-3 pb-2">Individual Details</p>
              <div className="row indivisual-yes">
                <div className="col-12 col-md-6 mb-3">
                  <InputField
                    error={formStateIndivisual.errors["first_name"]}
                    label=""
                    placeholder="First Name"
                    name="first_name"
                    control={controlIndivisual}
                    variant="filled"
                    className="bglight-ip"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <InputField
                    error={formStateIndivisual.errors["last_name"]}
                    label=""
                    placeholder="Last Name"
                    name="last_name"
                    control={controlIndivisual}
                    variant="filled"
                    className="bglight-ip"
                  />
                </div>
                {/* <div className="col-12 col-md-6 mb-3">
                <InputField
                  error={formStateIndivisual.errors["address"]}
                  label="Address"
                  name="address"
                  control={controlIndivisual}
                  variant="filled"
                  className="bglight-ip"
                />
              </div> */}
                <div className="col-12 col-md-6 mb-3 new-phone">
                  {/* <InputField
                  type="number"
                  error={formState.errors["phone_no"]}
                  label="Phone Number"
                  name="phone_no"
                  control={control}
                  variant="filled"
                  className="bglight-ip"
                /> */}
                  <InputPhone
                    error={formStateIndivisual.errors["phone_no"]}
                    label=""
                    name="phone_no"
                    control={controlIndivisual}
                    variant="filled"
                    className="bglight-ip phone"
                    emitChange={(val) => setPhone(val)}
                  />
                </div>

                <div className="col-12 col-md-6 mb-3">
                  <InputField
                    error={formStateIndivisual.errors["email"]}
                    label=""
                    placeholder="Email Address"
                    name="email"
                    control={controlIndivisual}
                    variant="filled"
                    className="bglight-ip"
                    emitChange={(val) => {
                      setEmail(val);
                    }}
                  />
                </div>

                <div className="col-12 mb-3 google-loc">
                  <GooglePlacesAutocomplete
                    apiKey={googleMapsApiKey}
                    selectProps={{
                      defaultInputValue: caseData?.opposingIndividual?.location,
                      value: valueArr,
                      isClearable: true,
                      placeholder: "Search for city/location..",
                      onChange: handleLocation,
                    }}
                  />
                  {errors.addressErr && (
                    <span className="text-danger f-14">
                      Please enter Location
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="step-btns mt-3 d-flex gap-3">
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
        )}
        {opposing == "company" && (
          <Form<FormValuesCompany>
            onSubmit={handleSubmit}
            methods={companyMethods}
          >
            <div className="spouse-info opposing-party pb-3">
              <p className="f-18 fw-500 pt-4">Company Details</p>
              <div className="row indivisual-yes">
                <div className="col-12  col-md-6 mb-3">
                  <InputField
                    error={formStateCompany.errors["reg_no"]}
                    label=""
                    placeholder="Company Registration Number"
                    name="reg_no"
                    control={controlCompany}
                    variant="filled"
                    className="bglight-ip"
                    emitChange={(val) => setRegistration(val)}
                  />
                </div>

                {show && (
                  <>
                    <div className="col-12  col-md-6 mb-3">
                      <InputField
                        error={formStateCompany.errors["companyName"]}
                        label=""
                        placeholder="Company Name"
                        name="companyName"
                        variant="filled"
                        className="bglight-ip"
                        control={controlCompany}
                      />
                    </div>
                    <div className="col-12  col-md-6 mb-3">
                      <InputField
                        error={formStateCompany.errors["address"]}
                        label=""
                        placeholder="Company Address"
                        name="address"
                        variant="filled"
                        className="bglight-ip"
                        control={controlCompany}
                      />

                      {/* <GooglePlacesAutocomplete
                  apiKey={googleMapsApiKey}
                  selectProps={{
                    defaultInputValue: "",
                    value: companyArr,
                    isClearable: true,
                    placeholder: "Search for city/location..",
                    onChange: handlecompanyLocation,
                  }}
                />
                {errors.companyAddressErr && (
                  <span className="text-danger f-14">
                    Please enter Location
                  </span>
                )} */}
                    </div>
                    <div className="col-12  col-md-6 mb-3">
                      <InputField
                        error={formStateCompany.errors["legal"]}
                        label=""
                        placeholder="Legal Representative"
                        name="legal"
                        variant="filled"
                        className="bglight-ip"
                        control={controlCompany}
                      />
                    </div>
                  </>
                )}
              </div>
              <p className="f-18 fw-500 pt-4">Contact Information</p>
              <div className="row indivisual-yes">
                <div className="col-12 col-md-6 mb-3 new-phone">
                  <InputField
                    error={formStateCompany.errors["contact_name"]}
                    label=""
                    placeholder="Direct Contact Name"
                    name="contact_name"
                    control={controlCompany}
                    variant="filled"
                    className="bglight-ip"
                    emitChange={(val) => setName(val)}
                  />
                </div>
                <div className="col-12 col-md-6 mb-3">
                  <InputField
                    error={formStateCompany.errors["contact_email"]}
                    label=""
                    placeholder="Direct Contact Email"
                    name="contact_email"
                    control={controlCompany}
                    variant="filled"
                    className="bglight-ip"
                    emitChange={(val) => setDirectEmail(val)}
                  />
                </div>
                <div className="col-12 col-md-6 new-phone mb-3">
                  <InputPhone
                    error={formStateCompany.errors["phone_no"]}
                    label=""
                    name="phone_no"
                    control={controlCompany}
                    variant="filled"
                    className="bglight-ip phone"
                    emitChange={(val) => setDirectPhone(val)}
                  />
                </div>
              </div>
            </div>

            {openDialog && (
              <Dialog
                fullScreen={fullScreen}
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="responsive-dialog-title"
              >
                <DialogTitle id="responsive-dialog-title"></DialogTitle>
                <DialogContent>
                  <p className="f-18">
                    We were unable to recognize your company. Please provide
                    your phone number and/or email address so we can contact you
                    directly.
                  </p>
                </DialogContent>
                <DialogActions className="justify-content-center pb-4">
                  <Button
                    onClick={() => setOpenDialog(false)}
                    autoFocus
                    className="submit-btn-all "
                    type="submit"
                    variant="contained"
                  >
                    Ok
                  </Button>
                </DialogActions>
              </Dialog>
            )}

            <div className="step-btns mt-3 d-flex  gap-3">
              {/* <Button
                className="client-btn"
                type="submit"
                variant="contained"
                onClick={() => errHandle()}
              >
                Next
              </Button> */}

              <LoadingButton
                loading={isLoading}
                variant="contained"
                size="large"
                type="submit"
                onClick={() => {
                  errHandle();
                }}
              >
                Next
              </LoadingButton>

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
        )}
      </div>
    </div>
  );
}
