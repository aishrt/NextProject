"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Form from "@/components/Form/Form";
import {
  Autocomplete,
  Button,
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
  Alert,
} from "@mui/material";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { IndividualForm } from "./individualForm";
import { CompanyForm } from "./companyForm";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import useSnackbar from "@/hooks/useSnackbar";

interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
  caseData: any;
}

const options = [
  { label: "Corporate Officer", value: "Corporate Officer" },
  { label: "Legal Director", value: "Legal Director" },
  { label: "Special Representative", value: "Special Representative" },
  { label: "Provisional Administrator", value: "Provisional Administrator" },
  { label: "Ad Hoc", value: "Ad Hoc" },
];

export default function YourInformation(props: IProps) {
  const router = useRouter();

  // Destructuring the props object
  const { handleChange, setProgressValue, caseData } = props;

  const searchParams = useSearchParams();
  const caseId = searchParams ? searchParams.get("caseId") : null;
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  // states
  const [locationGoogleArr, setLocation] = useState();
  const [locationLatLong, setLocationLatLong] = useState({
    lat: 0,
    lng: 0,
  });
  const [personType, setPersonType] = useState<String>("");
  const [individualData, setIndividualData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [isAuthorized, setisAuthorized] = useState("");
  const [authoriseTypeErr, setauthoriseTypeErr] = useState(false);
  const [authoriseErr, setAuthoriseErr] = useState(false);
  const [authoriseType, setauthoriseType] = useState("");
  const [companyData, setCompanyData] = useState({});
  const [openEnailDilog, setOpenEnailDilog] = useState(false);
  const [legalEmailErr, setlegalEmailErr] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [position, setPosition] = useState("");

  const [placeId, setPlaceId] = useState();

  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const [legalRepresentativeEmailErr, setlegalRepresentativeEmailErr] =
    useState(false);
  const [legalRepresentativeEmail, setlegalEmail] = useState("");

  const [err, setErr] = useState(false);
  const [actErr, setActErr] = useState(false);

  let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // functions
  const handleIndivisual = (value: string) => {
    setPersonType(value);
    setErr(false);
  };

  useEffect(() => {
    if (personType == "company") {
      setLocationError(false);
    }
    if (locationGoogleArr) {
      setLocationError(false);
    }
  }, [personType, locationGoogleArr]);

  const handleSubmitIndivisualForm = (data: any) => {
    if (!locationGoogleArr) {
      return setLocationError(true);
    }

    setProgressValue(50);

    return handleChange({
      isIndividual: personType,
      individualData: {
        ...data,
        address: locationGoogleArr,
        lat: locationLatLong?.lat,
        long: locationLatLong?.lng,
      },
      progress: 50,
      nextProgress: 50,
      companyData: {},
    });
  };

  // const handleIndividualFormLater = (data: any) => {
  //   setProgressValue(50);
  //   return handleChange({
  //     isIndividual: personType,
  //     individualData: {
  //       ...data,
  //       address: locationGoogleArr,
  //       lat: locationLatLong?.lat,
  //       long: locationLatLong?.lng,
  //     },
  //     progress: 50,
  //     resumeLater: "resumeLater",
  //   });
  // };

  const checkLegal = async (data: any) => {
    console.log(data);

    if (!data.legalRepresentative) {
      openSnackbar({
        message:
          "We were unable to recognize your company.We will contact you as soon as possible.",
        type: "info",
      });
      const caseData = await axios.post("/api/client/case/add-case", {
        isIndividual: personType,
        companyData: data,
        individualData: {},
        caseId: caseId,
      });
      console.log(caseData);
    }
    if (data.legalRepresentative) {
      console.log(data);

      let isError = false;
      if (`${data.first_name} ${data.last_name}` !== data.legalRepresentative) {
        isError = true;
      }
      if (isError) {
        setShowForm(isError);
      } else {
        setShowForm(false);
      }
      // if (isError && !isAuthorized)
      return isError;
    }
  };

  const errHandle = (): boolean => {
    let isErr = false;
    if (!legalRepresentativeEmail && showForm == true && isAuthorized == "no") {
      isErr = true;
      // return setlegalEmailErr(true);
    }
    if (
      showForm == true &&
      isAuthorized == "no" &&
      legalRepresentativeEmail != ""
    ) {
      const vals = pattern.test(legalRepresentativeEmail);
      if (!vals) {
        isErr = true;
      }
    }

    if (isErr) {
      setlegalEmailErr(isErr);
    } else {
      setlegalEmailErr(false);
    }

    if (showForm == true && !isAuthorized) {
      isErr = true;
    }
    if (!position && showForm == true) {
      isErr = true;
    }

    if (showForm && isAuthorized == "yes" && !authoriseType) {
      isErr = true;
    }

    return isErr;
  };

  const handleCompanyForm: (data: any) => Promise<any> = async (data: any) => {
    setCompanyData({
      isIndividual: personType,
      companyData: data,
      isAuthorized: isAuthorized,
      authoriseType: isAuthorized == "yes" ? authoriseType : "",
      legalRepresentativeEmail:
        isAuthorized == "no" ? legalRepresentativeEmail : "",
      progress: 50,
      nextProgress: 50,
    });
    // if (await checkLegal(data)) {
    //   console.log("1");
    //   return;
    // }

    // if (errHandle()) {
    //   console.log("2");
    //   return;
    // }

    console.log("finally api chali");
    // if (`${data.first_name} ${data.last_name}` !== data.legalRepresentative) {
    //   return setShowForm(true);
    // } else {
    //   return setShowForm(false);
    // }

    setProgressValue(50);
    return handleChange({
      isIndividual: personType,
      companyData: data,
      isAuthorized: isAuthorized,
      position,
      authoriseType: isAuthorized == "yes" ? authoriseType : "",
      legalRepresentativeEmail:
        isAuthorized == "no" ? legalRepresentativeEmail : "",
      progress: 50,
      nextProgress: 50,
      individualData: {},
    });
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

  useEffect(() => {
    setPersonType(caseData?.isIndividual);
  }, [caseData]);

  return (
    <>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <div className="first-step white-card rounded-lg p-5">
          <h3 className="f-26 fw-400 pb-2">
            Help Us Build Your Case: Start with Your Information
          </h3>
          <p className="f-18 fw-500 pt-3">Individual or Company?</p>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={personType}
              onChange={(e) => handleIndivisual(e.target.value)}
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
            {err && (
              <span className="text-danger">
                Please select, Individual or Company
              </span>
            )}
            {!personType && (
              <div className="step-btns mt-3 d-flex justify-content-center gap-3">
                <Button
                  variant="contained"
                  className="client-btn"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    if (!personType) {
                      return setErr(true);
                    }
                  }}
                >
                  Next
                </Button>
                <Button
                  variant="outlined"
                  className="border-0 text-black text-decoration-underline"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    handlePrevious();
                  }}
                >
                  Previous
                </Button>

                {/* <Button
              variant="outlined"
              className="green-border"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                if (!personType) {
                  return setErr(true);
                }
              }}
            >
              Next
            </Button> */}
              </div>
            )}
          </FormControl>
          {personType === "individual" && (
            <>
              <p className="f-20 mt-3 fw-400"> Individual Details </p>
              <IndividualForm
                locationGoogleArr={locationGoogleArr}
                locationLatLong={locationLatLong}
                setLocation={setLocation}
                locationError={locationError}
                setLocationError={setLocationError}
                setLocationLatLong={setLocationLatLong}
                individualData={caseData.individualData}
                setPlaceId={setPlaceId}
                placeId={placeId}
                handleSubmit={handleSubmitIndivisualForm}
                //handleSaveLater={handleIndividualFormLater}
              />
            </>
          )}

          {personType == "company" && (
            <>
              <p className="f-20 mt-3 fw-400">Your Company Details</p>
              <CompanyForm
                isIndividual={personType}
                companyData={caseData?.companyData}
                session={session}
              />
            </>
          )}
        </div>
      )}

      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </>
  );
}
