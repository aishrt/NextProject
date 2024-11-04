"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import DateField from "@/components/Form/DateField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import { Button } from "@/components/Form/Button";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import { Autocomplete, FormGroup, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { axios } from "@/utils/axios";

type FormValues = {
  taxes: string;
  reason: string;
  sublease: string;
  employee: number;
  non_renew: string;
  date: string;
  premises_type: string;
  building: string;
  age: string;
  location: string;
  describe: string;
  renew: number;
  situation: string;
  openhours: string;
  area: string;
  frontage: number;
  finance: string;
  state: string;
  transport: string;
  reputed_brands: string;
  brands: string;
  other: string;
  surface_area: number;
  premisesUse: string;
  premises_state: string;
  notoriety: string;
  weekhours: string;
  clientele: string;
  strength: string;
  weakness: string;
  retention: string;
  valuation: string;
  revenue: number;
  gross: string;
  annual_amount: string;
  collective: string;
};

const options = [
  {
    label: "Simple refusal of renewal, unspecified termination reason",
    value: "refusal",
  },
  { label: "Construction/Reconstruction/Elevation", value: "construct" },
  { label: "Conversion of an accessory dwelling", value: "convert" },
  {
    label:
      "Transformation for principal residential use of an existing building by reconstruction or rehabilitation",
    value: "transformation",
  },
  {
    label:
      "Execution of works prescribed within the scope of a building restoration operation",
    value: "execution",
  },
  {
    label: "Demolition within the framework of an urban renewal project",
    value: "demolition",
  },
  { label: "Economic ruin of the leased property", value: "economic" },
  {
    label:
      "The lessee does not fulfill the conditions for renewal rights required by Article L145-1 of the French Commercial Code",
    value: "renewalRights",
  },
];
const building = [
  { label: "Concrete ", value: "concrete " },
  {
    label: "Prefabricated/Metal",
    value: "metal",
  },
  { label: "Brick", value: "brick" },
  { label: "Exposed ancient stone", value: "exposed" },
  {
    label: "Cut stone including Haussmann-style buildings",
    value: "buildings",
  },
  { label: "Listed", value: "listed" },
  { label: "Other", value: "other" },
];
const openhours = [
  { label: "Regular business hours ", value: "regularHours" },
  {
    label: "Extended hours",
    value: "extHours",
  },
  { label: "24/7", value: "24/7" },
  { label: "Other", value: "other" },
];
const strength = [
  { label: "Not particularly", value: "Not particularly" },
  {
    label: "Favorable location of the premises",
    value: "Favorable location of the premises",
  },
  { label: "Tax advantages", value: "Tax advantages" },
];
const retention = [
  { label: "Clientele not retained", value: "Clientele not retained" },
  {
    label: "Clientele partially retained ",
    value: "Clientele partially retained ",
  },
  { label: "Clientele fully retained", value: "Clientele fully retained" },
];
const collective = [
  { label: "None", value: "none" },
  {
    label: "Safeguard",
    value: "Safeguard ",
  },
  { label: "Recovery", value: "recovery" },
  { label: "Liquidation", value: "liquidation" },
];
const valuation = [
  { label: "Revenue", value: "Revenue" },
  {
    label: "Gross Operating Surplus",
    value: "Gross Operating Surplus",
  },
  {
    label: "Average between revenue and gross operating surplus",
    value: "Average between revenue and gross operating surplus",
  },
  { label: "Gross margin", value: "Gross margin" },
  { label: "Special: daily receipts", value: "Special: daily receipts" },
];
const weakness = [
  { label: "Not particularly", value: "Not particularly" },
  {
    label: "Unfavorable location of the premises",
    value: "Unfavorable location of the premises",
  },
  { label: "Tax disadvantages", value: "Tax disadvantages" },
];
const weekhours = [
  { label: "1-3 days Extended hours ", value: "extendedHours" },
  {
    label: "4-5 Days ",
    value: "4-5 Days ",
  },
  { label: "6 Days", value: "6 Days" },
  { label: "7 Days", value: "7 Days" },
];
const age = [
  { label: "Old ", value: "old " },
  {
    label: "Intermediate",
    value: "intermediate",
  },
  { label: "Recent", value: "recent" },
  { label: "New", value: "new" },
];
const reputedbrand = [
  { label: "None ", value: "none " },
  {
    label: "Few",
    value: "few",
  },
  { label: "Several", value: "several" },
  { label: "Many", value: "many" },
];
const finance = [
  { label: "Profitable ", value: "profitable " },
  {
    label: "Break-Even",
    value: "breakEven",
  },
  { label: "Loss", value: "loss" },
];
const clientele = [
  {
    label: "Direct sales and/or service ",
    value: "Direct sales and/or service ",
  },
  {
    label: "Takeaway",
    value: "takeaway",
  },
  { label: "Delivery", value: "delivery" },
];
const notoriety = [
  { label: "Local ", value: "local " },
  {
    label: "Regional",
    value: "regional",
  },
  { label: "National ", value: "national " },
  { label: "International ", value: "international " },
];
const competebrand = [
  { label: "None ", value: "none " },
  {
    label: "Few",
    value: "few",
  },
  { label: "Several", value: "several" },
  { label: "Many", value: "many" },
];
const location = [
  { label: "City Center", value: "cityCenter  " },
  {
    label: "Commercial Zone",
    value: "commercialZone",
  },
  { label: "Residential Area", value: "ResidentialArea" },
  { label: "Industrial Area", value: "industrialArea" },
  { label: "Other", value: "other" },
];
const nonrenew = [
  { label: "Transfer of the business", value: "transferBusiness" },
  {
    label: "Partial disappearance of the business",
    value: "partialDisappearance",
  },
  { label: "Total disappearance of the business", value: "totalDisappearance" },
];
const situation = [
  { label: "Tertiary artery ", value: "artery" },
  {
    label: "Secondary artery",
    value: "secondaryArtery",
  },
  { label: "Main artery (main street with shops)", value: "mainArtery" },
];
const premises_state = [
  { label: "New", value: "new" },
  {
    label: "Recent",
    value: "recent",
  },
  { label: "Normal ", value: "normal " },
  { label: "Dilapidated", value: "dilapidated" },
  { label: "In need of renovation", value: "inNeed" },
  {
    label:
      "Loss of the leased property (e.g., collapse) OR Normal OR Recent OR New",
    value: "loss",
  },
];
const transport = [
  { label: "None", value: "none" },
  {
    label: "Poor",
    value: "poor",
  },
  { label: "Average ", value: "average " },
  { label: "Good", value: "good" },
  { label: "Excellent", value: "excellent" },
];
const sublease = [
  { label: "No subleasing", value: "noSubleasing" },
  {
    label: "Subleasing without knowledge of the subleased area",
    value: "subleasedArea",
  },
  { label: "Subleasing less than half the area", value: "lessThanHalf" },
  { label: "Subleasing more than half the area", value: "moreThanHalf" },
  { label: "Subleasing the total area", value: "totalArea" },
];
const premisesUse = [
  { label: "Sales area ", value: "salesArea " },
  {
    label: "Stock",
    value: "stock",
  },
  { label: "Warehouse reserve", value: "warehouse" },
  { label: "Offices", value: "offices" },
  { label: "Annexes", value: "annexes" },
  { label: "Other", value: "other" },
];
const premises = [
  { label: "Office", value: "office" },
  {
    label: "Shop",
    value: "shop",
  },
  { label: "Workshop", value: "workshop" },
  { label: "Other ", value: "other" },
];
const schema = z.object({
  taxes: z.string().min(1, "Rent is required"),
  reason: z.string().min(1, "Reason is required"),
  date: z.string().min(1, "Date is required"),
  type: z.string().min(1, "Type is required"),
  non_renew: z.string().min(1, "This is required"),
  city_size: z.string().min(1, "This is required"),
  age: z.string().min(1, "This is required"),
  location: z.string().min(1, "This is required"),
  nature: z.string().min(1, "This is required"),
  area: z.string().min(1, "This is required"),
  state: z.string().min(1, "This is required"),
  frontage: z.string().min(1, "This is required"),
  transport: z.string().min(1, "This is required"),
  reputed_brands: z.string().min(1, "This is required"),
  brands: z.string().min(1, "This is required"),
});
const styles = {
  errorForms: {
    color: "red",
    fontSize: "13px",
    fontWeight: "600",
    marginTop: "5px",
  },
};

export const LocationForm = () => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [defaultView, setDefaultView] = useState(true);
  const [show, setShow] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const [count, setCount] = useState(0); // Initialize count state variable with 0
  const [useClause, setClause] = useState(""); // Initialize count state variable with 0
  const [isActivity, setActivity] = useState<boolean>(false);
  const [isAppeal, setAppeal] = useState<boolean>(false);
  const [isFinancial, setFinancial] = useState<boolean>(false);
  const [isOperation, setOperation] = useState<boolean>(false);
  const [isLease, setLease] = useState<boolean>(false);
  const [isBusiness, setBusiness] = useState<boolean>(false);
  const [isValuation, setValuation] = useState<boolean>(false);
  const [isAspects, setAspects] = useState<boolean>(false);
  const [variant, setVariant] = useState<string>("");
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [isRenew, setRenewed] = useState<boolean>(false); // Initialize count state variable with 0
  const [isActivityInPremises, setActivityPremises] = useState<boolean>(false);
  const [isSubletting, setSubletting] = useState<string>("");
  const [isValuationMethod, setValuationMethod] = useState<string | null>("");

  const searchParmas = useSearchParams();
  const progressFromQuery = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const handleAddInput = () => {
    const newCount = count + 1; // Increment count
    setCount(newCount); // Update count state variable
    newCount === 1
      ? setShow(true)
      : newCount == 2
      ? setActivity(true)
      : newCount == 3
      ? setAppeal(true)
      : newCount == 4
      ? setFinancial(true)
      : newCount == 5
      ? setOperation(true)
      : newCount == 6
      ? setLease(true)
      : newCount == 7
      ? setBusiness(true)
      : newCount == 8
      ? setValuation(true)
      : newCount == 9
      ? setAspects(true)
      : newCount == 10;
  };
  const [value, setValue] = React.useState("yearactivity");
  const [valueSublet, setSubletValue] = React.useState("No subletting");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const [business, setBusines] = React.useState("");
  const [checked, isChecked] = React.useState(false);

  const handleBusiness = (event: any) => {
    setBusines((event.target as HTMLInputElement).name);
    isChecked(event.target.checked);
  };
  const handleSubletChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubletValue((event.target as HTMLInputElement).value);
  };

  const handleValuation = (val: string | null) => {
    setValuationMethod(val);
  };
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  // -------------------------

  // Validation error states
  const [leaseEndDateError, setLeaseEndDateError] = useState("");
  const [leaseEndReasonError, setLeaseEndReasonError] = useState("");
  const [terminationDateError, setTerminationDateError] = useState("");
  const [nonRenewalEffectError, setNonRenewalEffectError] = useState("");
  const [subleasingError, setSubleasingError] = useState("");
  const [premisesTypeError, setPremisesTypeError] = useState("");
  const [otherPremisesError, setOtherPremisesError] = useState("");
  const [surfacedAreaError, setSurfacedAreaError] = useState("");
  const [premisesUseValueError, setPremisesUseValueError] = useState("");
  const [frontageError, setFrontageError] = useState("");
  const [premisesStateValueError, setPremisesStateValueError] = useState("");
  const [buildingVlaueError, setBuildingVlaueError] = useState("");
  const [buildingAgeVlaueError, setBuildingAgeVlaueError] = useState("");
  const [locationValueError, setLocationValueError] = useState("");
  const [situationValueError, setSituationValueError] = useState("");
  const [transportValueError, setTransportValueError] = useState("");
  const [reputedBrandValueError, setReputedBrandValueError] = useState("");
  const [competeBrandValueError, setCompeteBrandValueError] = useState("");
  const [financeValueError, setFinanceValueError] = useState("");
  const [notorietyValueError, setNotorietyValueError] = useState("");
  const [employeeError, setEmployeeError] = useState("");
  const [openhoursValueError, setOpenhoursValueError] = useState("");
  const [weekhoursValueError, setWeekhoursValueError] = useState("");
  const [describeError, setDescribeError] = useState("");
  const [clienteleValueError, setClienteleValueError] = useState("");
  const [strengthValueError, setStrengthValueError] = useState("");
  const [weaknessValueError, setWeaknessValueError] = useState("");
  const [retentionValueError, setRetentionValueError] = useState("");
  const [collectiveValueError, setCollectiveValueError] = useState(false);
  const [renewNumberError, setRenewNumberError] = useState("");
  const [otherActivityError, setOtherActivityError] = useState("");
  const [percentOfSpaceError, setPercentOfSpaceError] = useState("");
  const [numberLesseActivityError, setNumberLesseActivityError] = useState("");
  const [averageRevenueError, setAverageRevenueError] = useState("");
  const [grossSurplusError, setGrossSurplusError] = useState("");
  const [averageGrossError, setAverageGrossError] = useState("");
  const [grossMarginError, setGrossMarginError] = useState("");
  const [dailyRevenueError, setDailyRevenueError] = useState("");

  // Validation functions
  const validate = () => {
    let isValid = true;

    // Validate lease end date
    if (!leaseEndDate) {
      setLeaseEndDateError("Please select end date of the lease.");
      isValid = false;
    } else {
      setLeaseEndDateError("");
    }

    // Validate lease end reason
    if (!leaseEndReason) {
      setLeaseEndReasonError(
        "Please provide a reason for the end of the lease."
      );
      isValid = false;
    } else {
      setLeaseEndReasonError("");
    }

    // Validate termination date
    if (!terminationDate) {
      setTerminationDateError(
        "Please select date of Notice of Non-Renewal/Termination."
      );
      isValid = false;
    } else {
      setTerminationDateError("");
    }

    // Validate non-renewal effect
    if (!nonRenewalEffect) {
      setNonRenewalEffectError("Please provide effect of non-renewal.");
      isValid = false;
    } else {
      setNonRenewalEffectError("");
    }

    // Validate subleasing
    if (!subleasing) {
      setSubleasingError("Please provide subleasing information.");
      isValid = false;
    } else {
      setSubleasingError("");
    }

    return isValid;
  };

  const validatePDC = () => {
    let isValid = true;

    if (!premisesType) {
      setPremisesTypeError("Please select premises type.");
      isValid = false;
    } else {
      setPremisesTypeError("");
    }

    if (premisesType?.value == "other") {
      if (!otherPremises) {
        setOtherPremisesError("Please provide other reason.");
        isValid = false;
      } else {
        setOtherPremisesError("");
      }
    }

    if (!surfacedArea) {
      setSurfacedAreaError("Please provide surfaced area.");
      isValid = false;
    } else {
      setSurfacedAreaError("");
    }

    if (!premisesUseValue) {
      setPremisesUseValueError("Please provide premises use.");
      isValid = false;
    } else {
      setPremisesUseValueError("");
    }

    if (!frontage) {
      setFrontageError("Please provide frontage information.");
      isValid = false;
    } else {
      setFrontageError("");
    }

    if (!premisesStateValue) {
      setPremisesStateValueError("Please provide premises state information.");
      isValid = false;
    } else {
      setPremisesStateValueError("");
    }

    return isValid;
  };

  const validateUEA = () => {
    let isValid = true;

    if (!buildingVlaue) {
      setBuildingVlaueError("Please select building.");
      isValid = false;
    } else {
      setBuildingVlaueError("");
    }

    if (!buildingAgeVlaue) {
      setBuildingAgeVlaueError("Please select building age.");
      isValid = false;
    } else {
      setBuildingAgeVlaueError("");
    }

    if (!locationValue) {
      setLocationValueError("Please provide location.");
      isValid = false;
    } else {
      setLocationValueError("");
    }

    if (!situationValue) {
      setSituationValueError("Please provide situation.");
      isValid = false;
    } else {
      setSituationValueError("");
    }

    if (!transportValue) {
      setTransportValueError("Please provide transport information.");
      isValid = false;
    } else {
      setTransportValueError("");
    }

    return isValid;
  };

  const validateNAMP = () => {
    let isValid = true;

    if (!reputedBrandValue) {
      setReputedBrandValueError("Please select reputed brand.");
      isValid = false;
    } else {
      setReputedBrandValueError("");
    }

    if (!competeBrandValue) {
      setCompeteBrandValueError("Please select compete brand.");
      isValid = false;
    } else {
      setCompeteBrandValueError("");
    }

    return isValid;
  };

  const validateFRO = () => {
    let isValid = true;

    if (!financeValue) {
      setFinanceValueError("Please select financial situation.");
      isValid = false;
    } else {
      setFinanceValueError("");
    }

    if (!notorietyValue) {
      setNotorietyValueError("Please select noteriety.");
      isValid = false;
    } else {
      setNotorietyValueError("");
    }

    if (!employee) {
      setEmployeeError("Please provide number of employee.");
      isValid = false;
    } else {
      setEmployeeError("");
    }

    return isValid;
  };

  const validateBOD = () => {
    let isValid = true;

    if (!openhoursValue) {
      setOpenhoursValueError("Please select opening hours.");
      isValid = false;
    } else {
      setOpenhoursValueError("");
    }

    if (!weekhoursValue) {
      setWeekhoursValueError("Please select weekly opening hours.");
      isValid = false;
    } else {
      setWeekhoursValueError("");
    }

    return isValid;
  };

  const validateILTA = () => {
    let isValid = true;

    if (isRenew) {
      if (!renewNumber) {
        setRenewNumberError("Please provide number.");
        isValid = false;
      } else {
        setRenewNumberError("");
      }
    }

    if (isActivityInPremises) {
      if (!otherActivity) {
        setOtherActivityError("Please describe.");
        isValid = false;
      } else {
        setOtherActivityError("");
      }
    }

    if (isSubletting == "partial") {
      if (!percentOfSpace) {
        setPercentOfSpaceError("Please provide value.");
        isValid = false;
      } else {
        setPercentOfSpaceError("");
      }
    }

    return isValid;
  };

  const validateBEC = () => {
    let isValid = true;

    if (business == "other" && checked == true && !describe) {
      setDescribeError("Please provide description.");
      isValid = false;
    } else {
      setDescribeError("");
    }

    if (!clienteleValue) {
      setClienteleValueError("Please select Nature of Clientele Reception.");
      isValid = false;
    } else {
      setClienteleValueError("");
    }

    if (!strengthValue) {
      setStrengthValueError("Please select Strengths of the Business.");
      isValid = false;
    } else {
      setStrengthValueError("");
    }

    if (!weaknessValue) {
      setWeaknessValueError("Please select Weaknesses of the Business.");
      isValid = false;
    } else {
      setWeaknessValueError("");
    }

    if (!retentionValue) {
      setRetentionValueError("Retention of Clientele.");
      isValid = false;
    } else {
      setRetentionValueError("");
    }

    return isValid;
  };

  const validateBV = () => {
    let isValid = true;

    if (isValuationMethod == "Revenue") {
      if (!numberLesseActivity) {
        setNumberLesseActivityError("Please provide number.");
        isValid = false;
      } else {
        setNumberLesseActivityError("");
      }

      if (!averageRevenue) {
        setAverageRevenueError("Please provide average revenue.");
        isValid = false;
      } else {
        setAverageRevenueError("");
      }
    }

    if (isValuationMethod == "Gross Operating Surplus") {
      if (!grossSurplus) {
        setGrossSurplusError("Please provide info");
        isValid = false;
      } else {
        setGrossSurplusError("");
      }
    }

    if (
      isValuationMethod == "Average between revenue and gross operating surplus"
    ) {
      if (!averageGross) {
        setAverageGrossError("Please provide value.");
        isValid = false;
      } else {
        setAverageGrossError("");
      }
    }

    if (isValuationMethod == "Gross margin") {
      if (!grossMargin) {
        setGrossMarginError("Please provide value.");
        isValid = false;
      } else {
        setGrossMarginError("");
      }
    }

    if (isValuationMethod == "Special: daily receipts") {
      if (!dailyRevenue) {
        setDailyRevenueError("Please provide revenue.");
        isValid = false;
      } else {
        setDailyRevenueError("");
      }
    }

    return isValid;
  };

  // Handle Next button click
  const handleNextClick = () => {
    if (validate()) {
      console.log("handleNextClick handleNextClick ");
      setDefaultView(false);
      setShow(true);
      // Proceed to next step or submit form
    } else {
      // Scroll to top or first invalid input
      console.log("handleNextClick handleNextClick handleNextClick ");
    }
  };

  const handlePDCNextClick = () => {
    if (validatePDC()) {
      console.log("handleNextClick handleNextClick ");
      setShow(false);
      setActivity(true);
      // Proceed to next step or submit form
    } else {
      // Scroll to top or first invalid input
      console.log("handleNextClick handleNextClick handleNextClick ");
    }
  };

  const handleUEANextClick = () => {
    if (validateUEA()) {
      console.log("handleNextClick handleNextClick ");

      setActivity(false);
      setAppeal(true);
      // Proceed to next step or submit form
    } else {
      // Scroll to top or first invalid input
      console.log("handleNextClick handleNextClick handleNextClick ");
    }
  };

  const handleNAMPNextClick = () => {
    if (validateNAMP()) {
      console.log("handleNextClick handleNextClick ");
      setAppeal(false);
      setFinancial(true);
      // Proceed to next step or submit form
    } else {
      // Scroll to top or first invalid input
      console.log("handleNextClick handleNextClick handleNextClick ");
    }
  };

  const handleFRONextClick = () => {
    if (validateFRO()) {
      console.log("handleNextClick handleNextClick ");
      setFinancial(false);
      setOperation(true);
      // Proceed to next step or submit form
    } else {
      // Scroll to top or first invalid input
      console.log("handleNextClick handleNextClick handleNextClick ");
    }
  };

  const handleBODNextClick = () => {
    if (validateBOD()) {
      console.log("handleNextClick handleNextClick ");
      setOperation(false);
      setLease(true);
      // Proceed to next step or submit form
    } else {
      // Scroll to top or first invalid input
      console.log("handleNextClick handleNextClick handleNextClick ");
    }
  };

  const handleILTANextClick = () => {
    if (validateILTA()) {
      console.log("handleNextClick handleNextClick ");
      setLease(false);
      setBusiness(true);
    } else {
    }
  };

  const handleBECNextClick = () => {
    if (validateBEC()) {
      console.log("handleNextClick handleNextClick ");
      setBusiness(false);
      setValuation(true);
      // Proceed to next step or submit form
    } else {
      // Scroll to top or first invalid input
      console.log("handleNextClick handleNextClick handleNextClick ");
    }
  };

  const handleBVNextClick = () => {
    if (validateBV()) {
      console.log("handleNextClick handleNextClick ");
      setValuation(false);
      setAspects(true);
    } else {
    }
  };

  const [leaseEndDate, setLeaseEndDate] = useState<any>(null);
  const [terminationDate, setTerminationDate] = useState<any>(null);
  const [leaseEndReason, setleaseEndReason] = useState<any>(null);
  const [nonRenewalEffect, setNonRenewalEffect] = useState<any>(null);
  const [subleasing, setsubleasing] = useState<any>(null);
  const [leaseManagement, setLeaseManagement] = useState<any>("No");
  const [premisesType, setPremisesType] = useState<any>(null);
  const [otherPremises, setOtherPremises] = useState<any>(null);
  const [surfacedArea, setSurfacedArea] = useState<any>(null);
  const [premisesUseValue, setPremisesUseValue] = useState<any>(null);
  const [easyCustomerAccess, setEasyCustomerAccess] = useState<any>("No");
  const [frontage, setFrontage] = useState<any>(null);
  const [premisesStateValue, setPremisesStateValue] = useState<any>(null);
  const [buildingVlaue, setBuildingVlaue] = useState<any>(null);
  const [buildingAgeVlaue, setBuildingAgeVlaue] = useState<any>(null);
  const [locationValue, setLocationValue] = useState<any>(null);
  const [situationValue, setSituationValue] = useState<any>(null);
  const [transportValue, setTransportValue] = useState<any>(null);
  const [proximityPOI, setProximityPOI] = useState<any>("No");
  const [reputedBrandValue, setReputedBrandValue] = useState<any>(null);
  const [competeBrandValue, setCompeteBrandValue] = useState<any>(null);
  const [financeValue, setFinanceValue] = useState<any>(null);
  const [notorietyValue, setNotorietyValue] = useState<any>(null);
  const [employee, setEmployee] = useState<any>(null);
  const [openhoursValue, setOpenhoursValue] = useState<any>(null);
  const [weekhoursValue, setWeekhoursValue] = useState<any>(null);
  const [describe, setdescribe] = useState<any>(null);
  const [clienteleValue, setClienteleValue] = useState<any>(null);
  const [strengthValue, setStrengthValue] = useState<any>(null);
  const [weaknessValue, setWeaknessValue] = useState<any>(null);
  const [retentionValue, setRetentionValue] = useState<any>(null);
  const [collectiveValue, setCollectiveValue] = useState<any>(null);
  const [renewNumber, setRenewNumber] = useState<any>(null);
  const [otherActivity, setOtherActivity] = useState<any>(null);
  const [percentOfSpace, setPercentOfSpace] = useState<any>(null);
  const [numberLesseActivity, setNumberLesseActivity] = useState<any>(null);
  const [averageRevenue, setAverageRevenue] = useState<any>(null);
  const [grossSurplus, setGrossSurplus] = useState<any>(null);
  const [averageGross, setAverageGross] = useState<any>(null);
  const [grossMargin, setGrossMargin] = useState<any>(null);
  const [dailyRevenue, setDailyRevenue] = useState<any>(null);

  const handleOptionChange = (event: any, newValue: any) => {
    setleaseEndReason(newValue);
    setLeaseEndReasonError("");
  };
  const handleNRE = (event: any, newValue: any) => {
    setNonRenewalEffect(newValue);
    setNonRenewalEffectError("");
  };
  const handleSubLease = (event: any, newValue: any) => {
    setsubleasing(newValue);
    setSubleasingError("");
  };
  const handlePremisesTypeChange = (event: any, newValue: any) => {
    setPremisesType(newValue);
    setPremisesTypeError("");
  };

  const handleOtherPremises = (event: any, newValue: any) => {
    setOtherPremises(newValue);
    setOtherPremisesError("");
  };

  const handleSurfacedAreaChange = (event: any, newValue: any) => {
    setSurfacedArea(newValue);
    setSurfacedAreaError("");
  };

  const handlePremisesUseChange = (event: any, newValue: any) => {
    setPremisesUseValue(newValue);
    setPremisesUseValueError("");
  };

  const handleFrontage = (event: any, newValue: any) => {
    setFrontage(newValue);
    setFrontageError("");
  };

  const handlePremisesStateValueChange = (event: any, newValue: any) => {
    setPremisesStateValue(newValue);
    setPremisesStateValueError("");
  };

  const handlebuildingValueChange = (event: any, newValue: any) => {
    setBuildingVlaue(newValue);
    setBuildingVlaueError("");
  };

  const handlebuildingAgeValueChange = (event: any, newValue: any) => {
    setBuildingAgeVlaue(newValue);
    setBuildingAgeVlaueError("");
  };

  const handlelocationValueChange = (event: any, newValue: any) => {
    setLocationValue(newValue);
    setLocationValueError("");
  };

  const handleSituationValueChange = (event: any, newValue: any) => {
    setSituationValue(newValue);
    setSituationValueError("");
  };

  const handleTransportValueChange = (event: any, newValue: any) => {
    setTransportValue(newValue);
    setTransportValueError("");
  };

  const handleReputedBrandValueChange = (event: any, newValue: any) => {
    setReputedBrandValue(newValue);
    setReputedBrandValueError("");
  };

  const handleCompeteBrandValueChange = (event: any, newValue: any) => {
    setCompeteBrandValue(newValue);
    setCompeteBrandValueError("");
  };

  const handleFinanceValueChange = (event: any, newValue: any) => {
    setFinanceValue(newValue);
    setFinanceValueError("");
  };

  const handleNotorietyValueChange = (event: any, newValue: any) => {
    setNotorietyValue(newValue);
    setNotorietyValueError("");
  };

  const handleEmployeeChange = (event: any, newValue: any) => {
    setEmployee(newValue);
    setEmployeeError("");
  };

  const handleopenhoursValueChange = (event: any, newValue: any) => {
    setOpenhoursValue(newValue);
    setOpenhoursValueError("");
  };

  const handleweekhoursChange = (event: any, newValue: any) => {
    setWeekhoursValue(newValue);
    setWeekhoursValueError("");
  };

  const handleDescribeChange = (event: any, newValue: any) => {
    setdescribe(newValue);
    setDescribeError("");
  };

  const handleClientelesChange = (event: any, newValue: any) => {
    setClienteleValue(newValue);
    setClienteleValueError("");
  };

  const handleStrengthChange = (event: any, newValue: any) => {
    setStrengthValue(newValue);
    setStrengthValueError("");
  };

  const handleWeaknessChange = (event: any, newValue: any) => {
    setWeaknessValue(newValue);
    setWeaknessValueError("");
  };

  const handleRetentionChange = (event: any, newValue: any) => {
    setRetentionValue(newValue);
    setRetentionValueError("");
  };

  const handleCollectiveChange = (event: any, newValue: any) => {
    setCollectiveValue(newValue);
    setCollectiveValueError(false);
  };

  const handleRenewChange = (event: any, newValue: any) => {
    setRenewNumber(newValue);
    setRenewNumberError("");
  };

  const handleOtherActivityChange = (event: any, newValue: any) => {
    setOtherActivity(newValue);
    setOtherActivityError("");
  };

  const handlePercentOfSpaceChange = (event: any, newValue: any) => {
    setPercentOfSpace(newValue);
    setPercentOfSpaceError("");
  };

  const handlenumberLesseActivityChange = (event: any, newValue: any) => {
    setNumberLesseActivity(newValue);
    setNumberLesseActivityError("");
  };

  const handleAverageRevenueChange = (event: any, newValue: any) => {
    setAverageRevenue(newValue);
    setAverageRevenueError("");
  };

  const handleGrossSurplusChange = (event: any, newValue: any) => {
    setGrossSurplus(newValue);
    setGrossSurplusError("");
  };

  const handleAverageGrossChange = (event: any, newValue: any) => {
    setAverageGross(newValue);
    setAverageGrossError("");
  };

  const handleGrossMarginChange = (event: any, newValue: any) => {
    setGrossMargin(newValue);
    setGrossMarginError("");
  };

  const handleDailyRevenueChange = (event: any, newValue: any) => {
    setDailyRevenue(newValue);
    setDailyRevenueError("");
  };

  const handleSubmit = async () => {
    if (!collectiveValue) {
      setCollectiveValueError(true);
    }

    const values = {
      leaseEndDate: leaseEndDate,
      leaseEndReason: leaseEndReason?.label,
      terminationDate: terminationDate,
      nonRenewalEffect: nonRenewalEffect?.label,
      subleasing: subleasing?.label,
      leaseManagement: leaseManagement,
      premisesType: premisesType?.label,
      other: otherPremises,
      surfaceArea: surfacedArea,
      primaryUse: premisesUseValue?.label,
      customerAccess: easyCustomerAccess,
      facadeFrontage: frontage,
      premisesState: premisesStateValue?.label,
      buildingType: buildingVlaue?.label,
      buildingAge: buildingAgeVlaue?.label,
      location: locationValue?.label,
      citySituation: situationValue?.label,
      transportConnectivity: transportValue?.label,
      pointOfInterest: proximityPOI,
      reputedBrand: reputedBrandValue?.label,
      competingBrand: competeBrandValue?.label,
      financialSituation: financeValue?.label,
      notoriety: notorietyValue?.label,
      employeesNumber: employee,
      openingHours: openhoursValue?.label,
      weeklyOpening: weekhoursValue?.label,
      describeActivity: describe,
    };
    try {
      setLoading(true);
      console.log("all values: " + JSON.stringify(values));
      const response = await axios.post(
        "/api/client/category/eviction/createEviction",
        {
          ...values,
          caseId: caseId,
        }
      );
      console.log(response);
      handleClickOpen();
    } catch (error) {
      console.log("err", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log({
      leaseEndDate,
      terminationDate,
      leaseEndReason,
      nonRenewalEffect,
      subleasing,
      leaseManagement,
    });
  }, [
    leaseEndDate,
    terminationDate,
    leaseEndReason,
    nonRenewalEffect,
    subleasing,
    leaseManagement,
  ]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mb-4">Lease Termination & Impact </h3>

      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        {defaultView && (
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label>End date of the lease</label>
                <DatePicker
                  format="DD/MM/YYYY"
                  label="Select Date"
                  value={leaseEndDate}
                  onChange={(date) => {
                    setLeaseEndDate(date);
                    setLeaseEndDateError("");
                  }} // Assuming the date object is directly provided by the onChange event
                />
                {leaseEndDateError && (
                  <div className="errorForms" style={styles.errorForms}>
                    {leaseEndDateError}
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label>Reason for the end of the lease</label>

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={options} // Make sure options array is provided
                  sx={{ width: 300 }}
                  value={leaseEndReason} // Pass the leaseEndReason state as the value
                  onChange={handleOptionChange} // Handle option change
                  freeSolo // Allow free input
                  renderInput={(params) => (
                    <TextField {...params} label="Lease End Reason" />
                  )}
                />
                {leaseEndReasonError && (
                  <div className="errorForms" style={styles.errorForms}>
                    {leaseEndReasonError}
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label>Date of Notice of Non-Renewal/Termination</label>
                <DatePicker
                  label="Select Date"
                  value={terminationDate}
                  onChange={(date) => {
                    setTerminationDate(date);
                    setTerminationDateError("");
                  }} // Assuming the date object is directly provided by the onChange event
                />
                {terminationDateError && (
                  <div className="errorForms" style={styles.errorForms}>
                    {terminationDateError}
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  Effect of Non-Renewal
                  {/* <div className="tooltip-icn relative"> */}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Explain whether the business moved, was downsized, or ceased
                    operations.
                  </span>
                  {/* </div> */}
                </label>

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={nonrenew} // Make sure options array is provided
                  sx={{ width: 300 }}
                  value={nonRenewalEffect} // Pass the leaseEndReason state as the value
                  onChange={handleNRE} // Handle option change
                  freeSolo // Allow free input
                  renderInput={(params) => (
                    <TextField {...params} label="Lease End Reason" />
                  )}
                />
                {nonRenewalEffectError && (
                  <div className="errorForms" style={styles.errorForms}>
                    {nonRenewalEffectError}
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label>Subleasing</label>
                <Autocomplete
                  disablePortal
                  onClick={() => handleAddInput()}
                  id="combo-box-demo"
                  options={sublease} // Make sure options array is provided
                  sx={{ width: 300 }}
                  value={subleasing} // Pass the leaseEndReason state as the value
                  onChange={handleSubLease} // Handle option change
                  freeSolo // Allow free input
                  renderInput={(params) => (
                    <TextField {...params} label="Lease End Reason" />
                  )}
                />
                {subleasingError && (
                  <div className="errorForms" style={styles.errorForms}>
                    {subleasingError}
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3">
                <label className="relative">Lease Management</label>

                <div className="buttons-row d-flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    value="Yes"
                    className={
                      leaseManagement == "Yes" ? "bg-black text-white" : ""
                    }
                    // onClick={() => handleAddInput()}
                    onClick={() => setLeaseManagement("Yes")}
                  >
                    Yes
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    value="No"
                    className={
                      leaseManagement == "No" ? "bg-black text-white" : ""
                    }
                    onClick={() => setLeaseManagement("No")}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-12 text-end flex">
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handleNextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {show && (
          <div>
            <hr />
            <h3 className="f-22 bold my-4 mt-5 gray">
              Property Details & Characteristics
            </h3>
            <div className="row">
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label>Type of premises</label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={premises} // Make sure options array is provided
                    sx={{}}
                    value={premisesType} // Pass the leaseEndReason state as the value
                    onChange={handlePremisesTypeChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Type of premises" />
                    )}
                  />
                  {premisesTypeError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {premisesTypeError}
                    </div>
                  )}
                </div>
              </div>
              {premisesType?.value == "other" && (
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input">
                    <label>Other</label>
                    <TextField
                      type="text"
                      id="component-outlined"
                      sx={{ width: "100%" }}
                      value={otherPremises}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const val = event.target.value;
                        handleOtherPremises(event, val);
                      }}
                      placeholder="Other"
                      className="bglight-ip"
                    />
                    {otherPremisesError && (
                      <div className="errorForms" style={styles.errorForms}>
                        {otherPremisesError}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="relative">
                    Surface area (in square meters)
                  </label>
                  <TextField
                    type="number"
                    id="component-outlined"
                    sx={{ width: "100%" }}
                    value={surfacedArea}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const val = event.target.value;
                      handleSurfacedAreaChange(event, val);
                    }}
                    placeholder="Surface area (in square meters)"
                    className="bglight-ip"
                  />
                  {surfacedAreaError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {surfacedAreaError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="">
                  <label className="tooltip-title relative">
                    Primary use of the Premises
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Select the primary use of the space (even if you used it
                      differently)
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={premisesUse} // Make sure options array is provided
                    sx={{}}
                    value={premisesUseValue} // Pass the leaseEndReason state as the value
                    onChange={handlePremisesUseChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Primary use of the Premises"
                      />
                    )}
                  />
                  {premisesUseValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {premisesUseValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-12 mb-4">
                <div className="">
                  <label className="relative">Easy customer access?</label>
                  <div className="buttons-row d-flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      value="Yes"
                      className={
                        easyCustomerAccess == "Yes" ? "bg-black text-white" : ""
                      }
                      onClick={() => setEasyCustomerAccess("Yes")}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      value="No"
                      className={
                        easyCustomerAccess == "No" ? "bg-black text-white" : ""
                      }
                      onClick={() => setEasyCustomerAccess("No")}
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Facade Frontage (Meters)
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      The length of the building&apos;s front facing the street
                    </span>
                    {/* </div> */}
                  </label>
                  <TextField
                    type="number"
                    id="component-outlined"
                    sx={{ width: "100%" }}
                    value={frontage}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const val = event.target.value;
                      handleFrontage(event, val);
                    }}
                    placeholder="Facade Frontage (Meters)"
                    className="bglight-ip"
                  />
                  {frontageError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {frontageError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="">
                  <label className="tooltip-title relative">
                    State of the Premises
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Describe the overall condition at the time of lease
                      termination.
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={premises_state} // Make sure options array is provided
                    sx={{}}
                    value={premisesStateValue} // Pass the leaseEndReason state as the value
                    onChange={handlePremisesStateValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="State of the Premises" />
                    )}
                  />
                  {premisesStateValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {premisesStateValueError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setDefaultView(true);
                  setShow(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handlePDCNextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {isActivity && (
          <div>
            <hr />
            <h6 className="f-22 bold mb-4 gray mt-5">
              Urban Environment & Accessibility
            </h6>
            <div className="row mt-3">
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Type of Building
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Exceptional buildings designed by architects may be
                      classified in the &quot;Other&quot; category.
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={building} // Make sure options array is provided
                    sx={{}}
                    value={buildingVlaue} // Pass the leaseEndReason state as the value
                    onChange={handlebuildingValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Type of Building" />
                    )}
                  />
                  {buildingVlaueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {buildingVlaueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className=" relative">Age of Building</label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={age} // Make sure options array is provided
                    sx={{}}
                    value={buildingAgeVlaue} // Pass the leaseEndReason state as the value
                    onChange={handlebuildingAgeValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Age of Building" />
                    )}
                  />
                  {buildingAgeVlaueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {buildingAgeVlaueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className=" relative">Location</label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={location} // Make sure options array is provided
                    sx={{}}
                    value={locationValue} // Pass the leaseEndReason state as the value
                    onChange={handlelocationValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Location" />
                    )}
                  />
                  {locationValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {locationValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className=" relative">Situation Within City</label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={situation} // Make sure options array is provided
                    sx={{}}
                    value={situationValue} // Pass the leaseEndReason state as the value
                    onChange={handleSituationValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Situation Within City" />
                    )}
                  />
                  {situationValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {situationValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Public Transport Connectivity
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Assess the overall ease of access to your location using
                      public transportation options.
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={transport} // Make sure options array is provided
                    sx={{}}
                    value={transportValue} // Pass the leaseEndReason state as the value
                    onChange={handleTransportValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Public Transport Connectivity"
                      />
                    )}
                  />
                  {transportValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {transportValueError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setShow(true);
                  setActivity(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handleUEANextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {isAppeal && (
          <div>
            <hr />
            <h6 className="f-22 bold mb-4 mt-5 gray">
              Neighborhood Appeal & Market Presence
            </h6>
            <div className="row mt-3">
              <div className="col-12 col-md-12 mb-4">
                <div className="">
                  <label className="tooltip-title relative">
                    Proximity to a Point of interest
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Select yes if the premises are near an economic, cultural,
                      or tourist attraction.
                    </span>
                    {/* </div> */}
                  </label>
                  <div className="buttons-row d-flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      value="Yes"
                      className={
                        proximityPOI == "Yes" ? "bg-black text-white" : ""
                      }
                      onClick={() => setProximityPOI("Yes")}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      value="No"
                      className={
                        proximityPOI == "No" ? "bg-black text-white" : ""
                      }
                      onClick={() => setProximityPOI("No")}
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Reputed Brands Nearby
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      To evaluate the attractiveness of the neighborhood,
                      consider the reputed brands near the premises, i.e.,
                      activities in the same street or adjacent streets. If
                      there are a maximum of 3 reputed brands nearby, indicate
                      &quot;several brands&quot;. If there are only reputed
                      brands, indicate &quot;exclusively
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={reputedbrand} // Make sure options array is provided
                    sx={{}}
                    value={reputedBrandValue} // Pass the leaseEndReason state as the value
                    onChange={handleReputedBrandValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Reputed Brands Nearby" />
                    )}
                  />
                  {reputedBrandValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {reputedBrandValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Competing Brands Nearby
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      To assess competitiveness in the neighborhood, consider
                      competing brands near the premises, i.e., similar
                      activities in the same street or adjacent streets. If
                      there are a maximum of 3 competing brands nearby, indicate
                      &quot;a few brands&quot;. If there are more, indicate
                      &quot;several brands
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={competebrand} // Make sure options array is provided
                    sx={{}}
                    value={competeBrandValue} // Pass the leaseEndReason state as the value
                    onChange={handleCompeteBrandValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Competing Brands Nearby" />
                    )}
                  />
                  {competeBrandValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {competeBrandValueError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setActivity(true);
                  setAppeal(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handleNAMPNextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {isFinancial && (
          <div>
            <hr />
            <h6 className="f-22 bold mb-4 mt-5 gray">
              Financial and Reputation Overview
            </h6>
            <div className="row mt-3">
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="relative">
                    Current Financial Situation
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={finance} // Make sure options array is provided
                    sx={{}}
                    value={financeValue} // Pass the leaseEndReason state as the value
                    onChange={handleFinanceValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Current Financial Situation"
                      />
                    )}
                  />
                  {financeValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {financeValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Notoriety
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Reflects the reach of your business reputation
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={notoriety} // Make sure options array is provided
                    sx={{}}
                    value={notorietyValue} // Pass the leaseEndReason state as the value
                    onChange={handleNotorietyValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Notoriety" />
                    )}
                  />
                  {notorietyValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {notorietyValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="mb-3 lease-input">
                  <label className="tooltip-title relative">
                    Number of employees
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Reflects The number of employees at the date of leave or
                      refusal of renewal
                    </span>
                    {/* </div> */}
                  </label>
                  <TextField
                    type="number"
                    id="component-outlined"
                    sx={{ width: "100%" }}
                    value={employee}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const val = event.target.value;
                      handleEmployeeChange(event, val);
                    }}
                    placeholder="Number of employees"
                    className="bglight-ip"
                  />
                  {employeeError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {employeeError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setAppeal(true);
                  setFinancial(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handleFRONextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {isOperation && (
          <div>
            <hr />
            <h6 className="f-22 bold mb-4 mt-5 gray">
              Business Operations Details
            </h6>
            <div className="row mt-3">
              <div className="col-12 col-md-12 mb-4">
                <div className="business-radio">
                  <FormControl className="w-100">
                    <label>Business Operation Period of the Lessee</label>
                    <RadioGroup
                      className="w-100"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        className="radio-light-ip"
                        value="yearactivity"
                        control={<Radio />}
                        label="Year-round activity"
                      />
                      <FormControlLabel
                        className="radio-light-ip"
                        value="Seasonal activity"
                        control={<Radio />}
                        label="Seasonal activity"
                      />
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="relative">Opening hours</label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={openhours} // Make sure options array is provided
                    sx={{}}
                    value={openhoursValue} // Pass the leaseEndReason state as the value
                    onChange={handleopenhoursValueChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Opening hours" />
                    )}
                  />
                  {openhoursValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {openhoursValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Weekly Opening Range
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Reflects The number of employees at the date of leave or
                      refusal of renewal
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={weekhours} // Make sure options array is provided
                    sx={{}}
                    value={weekhoursValue} // Pass the leaseEndReason state as the value
                    onChange={handleweekhoursChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Weekly Opening Range" />
                    )}
                  />
                  {weekhoursValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {weekhoursValueError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setFinancial(true);
                  setOperation(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handleBODNextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {isLease && (
          <div>
            <hr />
            <h6 className="f-22 bold mb-4  mt-5 gray">
              Initial Lease Terms & Activities
            </h6>
            <div className="row mt-3">
              <div className="col-12 col-md-12 mb-4">
                <div className="">
                  <label className="tooltip-title relative">
                    Lease renewal: Have you ever renewed your lease?
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Renewals before the one at issue
                    </span>
                    {/* </div> */}
                  </label>

                  <div className="buttons-row d-flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      value="yes"
                      className={isRenew == true ? "bg-black text-white" : ""}
                      onClick={() => {
                        {
                          setRenewed(true);
                        }
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      value="no"
                      size="lg"
                      className={isRenew == false ? "bg-black text-white" : ""}
                      onClick={() => {
                        {
                          setRenewed(false);
                        }
                      }}
                    >
                      No
                    </Button>
                  </div>
                  {isRenew && (
                    <div className="mb-3 lease-input mt-3">
                      <label>Add Number</label>
                      <TextField
                        type="number"
                        id="component-outlined"
                        sx={{ width: "100%" }}
                        value={renewNumber}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const val = event.target.value;
                          handleRenewChange(event, val);
                        }}
                        placeholder="Add Number"
                        className="bglight-ip"
                      />
                      {renewNumberError && (
                        <div className="errorForms" style={styles.errorForms}>
                          {renewNumberError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-12 mb-4">
                <div className="mb-4">
                  <label className="tooltip-title relative">
                    Activity in the rented premises: Was the activity different
                    from that indicated above?
                  </label>

                  <div className="buttons-row d-flex gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      value="yes"
                      className={
                        isActivityInPremises == true
                          ? "bg-black text-white"
                          : ""
                      }
                      onClick={() => {
                        {
                          setActivityPremises(true);
                        }
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="outline"
                      value="no"
                      size="lg"
                      className={
                        isActivityInPremises == false
                          ? "bg-black text-white"
                          : ""
                      }
                      onClick={() => {
                        {
                          setActivityPremises(false);
                        }
                      }}
                    >
                      No
                    </Button>
                  </div>

                  {isActivityInPremises && (
                    <div className="mb-3 mt-3 lease-input">
                      <label>Please Describe</label>
                      <TextField
                        type="text"
                        id="component-outlined"
                        sx={{ width: "100%" }}
                        value={otherActivity}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const val = event.target.value;
                          handleOtherActivityChange(event, val);
                        }}
                        placeholder="Please Describe"
                        className="bglight-ip"
                      />
                      {otherActivityError && (
                        <div className="errorForms" style={styles.errorForms}>
                          {otherActivityError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mb-4">
                  <FormControl className="w-100">
                    <label>Subletting: Have you practiced subletting?</label>
                    <RadioGroup
                      className="w-100"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={valueSublet}
                      onChange={handleSubletChange}
                    >
                      <FormControlLabel
                        className="radio-light-ip"
                        value="No subletting"
                        control={<Radio />}
                        label="No subletting"
                        onClick={() => setSubletting("no")}
                      />
                      <FormControlLabel
                        className="radio-light-ip"
                        value="Partial subletting of the space (please specify the surface area)"
                        control={<Radio />}
                        label="Partial subletting of the space (please specify the surface area)"
                        onClick={() => setSubletting("partial")}
                      />
                    </RadioGroup>
                  </FormControl>
                  {isSubletting == "partial" && (
                    <div className="mb-3 mt-3 lease-input">
                      <label>Percent of Space</label>
                      <TextField
                        type="number"
                        id="component-outlined"
                        sx={{ width: "100%" }}
                        value={percentOfSpace}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const val = event.target.value;
                          handlePercentOfSpaceChange(event, val);
                        }}
                        placeholder="Percent of Space"
                        className="bglight-ip"
                      />
                      {percentOfSpaceError && (
                        <div className="errorForms" style={styles.errorForms}>
                          {percentOfSpaceError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setOperation(true);
                  setLease(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handleILTANextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {isBusiness && (
          <div>
            <hr />
            <h6 className="f-22 bold mb-4 mt-5 gray">
              Business Environment & Characteristics
            </h6>
            <div className="row mt-3">
              <div className="col-12 col-md-12 mb-4">
                <div className="radio-end-input four-cols">
                  <label className="d-block">Miscellaneous Advantages</label>
                  <FormGroup>
                    <FormControlLabel
                      className="radio-light-ip"
                      control={<Checkbox defaultChecked />}
                      label="None"
                      name="None"
                      onChange={handleBusiness}
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      control={<Checkbox />}
                      label="Right to display"
                      name="Right"
                      onChange={handleBusiness}
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      control={<Checkbox />}
                      label="Terrace"
                      name="Terrace"
                      onChange={handleBusiness}
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      control={<Checkbox />}
                      label="Other"
                      name="other"
                      onChange={handleBusiness}
                    />
                  </FormGroup>
                  {business == "other" && checked == true && (
                    <div className="mb-3 mt-3 lease-input">
                      <label>Please Describe</label>
                      <TextField
                        type="text"
                        id="component-outlined"
                        sx={{ width: "100%" }}
                        value={describe}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const val = event.target.value;
                          handleDescribeChange(event, val);
                        }}
                        placeholder="Please Describe"
                        className="bglight-ip"
                      />
                      {business == "other" && describeError && (
                        <div className="errorForms" style={styles.errorForms}>
                          {describeError}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Nature of Clientele Reception
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      For It is important to understand how clientele is
                      received on the premises, which depends on the nature of
                      the activity. If the main nature of the premises
                      corresponds to offices, it will be: &quot;Sales and/or
                      direct service&quot;
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={clientele} // Make sure options array is provided
                    sx={{}}
                    value={clienteleValue} // Pass the leaseEndReason state as the value
                    onChange={handleClientelesChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nature of Clientele Reception"
                      />
                    )}
                  />
                  {clienteleValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {clienteleValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Strengths of the Business
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      For example, a hotel that attracts tourists due to its
                      proximity to the coast has a favorable location. Tax
                      advantages can be obtained to encourage the acquisition of
                      a business, e.g., in the context of a student residence
                      providing services
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={strength} // Make sure options array is provided
                    sx={{}}
                    value={strengthValue} // Pass the leaseEndReason state as the value
                    onChange={handleStrengthChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Strengths of the Business"
                      />
                    )}
                  />
                  {strengthValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {strengthValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Weaknesses of the Business
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={weakness} // Make sure options array is provided
                    sx={{}}
                    value={weaknessValue} // Pass the leaseEndReason state as the value
                    onChange={handleWeaknessChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Weaknesses of the Business"
                      />
                    )}
                  />
                  {weaknessValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {weaknessValueError}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Retention of Clientele
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={retention} // Make sure options array is provided
                    sx={{}}
                    value={retentionValue} // Pass the leaseEndReason state as the value
                    onChange={handleRetentionChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField {...params} label="Retention of Clientele" />
                    )}
                  />
                  {retentionValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      {retentionValueError}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setLease(true);
                  setBusiness(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handleBECNextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {isValuation && (
          <div>
            <hr />
            <h6 className="f-22 bold mb-4 mt-5 gray">Business Valuation</h6>
            <div className="row mt-3">
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Preferred Valuation Method(s)
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Select the calculation method you wish to use for the
                      simulation
                    </span>
                    {/* </div> */}
                  </label>
                  <SelectField
                    options={valuation}
                    label=""
                    name="valuation"
                    className="bglight-select"
                    error={formState.errors["valuation"]}
                    control={control}
                    emitChange={handleValuation}
                  />
                </div>

                {isValuationMethod == "Revenue" && (
                  <>
                    <div className="mb-3 lease-input">
                      <label className="tooltip-title relative">
                        Lessee&apos;s Activities
                        {/* <div className="tooltip-icn relative"> */}
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          Please indicate the number of lessee&apos;s
                          activities. This then implies a revenue specific to
                          each activity
                        </span>
                        {/* </div> */}
                      </label>
                      <TextField
                        type="number"
                        id="component-outlined"
                        sx={{ width: "100%" }}
                        value={numberLesseActivity}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const val = event.target.value;
                          handlenumberLesseActivityChange(event, val);
                        }}
                        placeholder="Number of Lessee's Activities"
                        className="bglight-ip"
                      />
                      {numberLesseActivityError && (
                        <div className="errorForms" style={styles.errorForms}>
                          {numberLesseActivityError}
                        </div>
                      )}
                    </div>
                    <div className="mb-3 lease-input">
                      <label className="tooltip-title relative">
                        Average Annual Revenue over the Last Three Years of the
                        Activity
                        {/* <div className="tooltip-icn relative"> */}
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          Please indicate the three-year average in euros
                        </span>
                        {/* </div> */}
                      </label>
                      <TextField
                        type="number"
                        id="component-outlined"
                        sx={{ width: "100%" }}
                        value={averageRevenue}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const val = event.target.value;
                          handleAverageRevenueChange(event, val);
                        }}
                        placeholder="Average Annual Revenue"
                        className="bglight-ip"
                      />
                      {averageRevenueError && (
                        <div className="errorForms" style={styles.errorForms}>
                          {averageRevenueError}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {isValuationMethod == "Gross Operating Surplus" && (
                  <div className="mb-3 lease-input">
                    <label className="tooltip-title relative">
                      Annual Gross Operating Surplus
                    </label>
                    <TextField
                      type="text"
                      id="component-outlined"
                      sx={{ width: "100%" }}
                      value={grossSurplus}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const val = event.target.value;
                        handleGrossSurplusChange(event, val);
                      }}
                      placeholder="Annual Gross Operating Surplus"
                      className="bglight-ip"
                    />
                    {grossSurplusError && (
                      <div className="errorForms" style={styles.errorForms}>
                        {grossSurplusError}
                      </div>
                    )}
                  </div>
                )}

                {isValuationMethod ==
                  "Average between revenue and gross operating surplus" && (
                  <div className="mb-3 lease-input">
                    <label className="tooltip-title relative">
                      Average Annual Amount between Revenue and Gross Operating
                      Surplus.
                    </label>
                    <TextField
                      type="text"
                      id="component-outlined"
                      sx={{ width: "100%" }}
                      value={averageGross}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const val = event.target.value;
                        handleAverageGrossChange(event, val);
                      }}
                      placeholder="Annual Gross Operating Surplus"
                      className="bglight-ip"
                    />
                    {averageGrossError && (
                      <div className="errorForms" style={styles.errorForms}>
                        {averageGrossError}
                      </div>
                    )}
                  </div>
                )}

                {isValuationMethod == "Gross margin" && (
                  <div className="mb-3 lease-input">
                    <label className="tooltip-title relative">
                      Annual Gross Margin Amount
                    </label>
                    <TextField
                      type="text"
                      id="component-outlined"
                      sx={{ width: "100%" }}
                      value={grossMargin}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const val = event.target.value;
                        handleGrossMarginChange(event, val);
                      }}
                      placeholder="Annual Gross Margin Amount"
                      className="bglight-ip"
                    />
                    {grossMarginError && (
                      <div className="errorForms" style={styles.errorForms}>
                        {grossMarginError}
                      </div>
                    )}
                  </div>
                )}
                {isValuationMethod == "Special: daily receipts" && (
                  <div className="mb-3 lease-input">
                    <label className="tooltip-title relative">
                      Daily Revenue
                    </label>
                    <TextField
                      type="text"
                      id="component-outlined"
                      sx={{ width: "100%" }}
                      value={dailyRevenue}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        const val = event.target.value;
                        handleDailyRevenueChange(event, val);
                      }}
                      placeholder="Daily Revenue"
                      className="bglight-ip"
                    />
                    {dailyRevenueError && (
                      <div className="errorForms" style={styles.errorForms}>
                        {dailyRevenueError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setBusiness(true);
                  setValuation(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => handleBVNextClick()}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {isAspects && (
          <div>
            <hr />
            <h6 className="f-22 bold mb-4 mt-5 gray">Legal Aspects</h6>
            <div className="row mt-3">
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Collective Procedure Existence
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Renewals before the one at issue
                    </span>
                    {/* </div> */}
                  </label>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={collective} // Make sure options array is provided
                    sx={{}}
                    value={collectiveValue} // Pass the leaseEndReason state as the value
                    onChange={handleCollectiveChange} // Handle option change
                    freeSolo // Allow free input
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Collective Procedure Existence"
                      />
                    )}
                  />
                  {collectiveValueError && (
                    <div className="errorForms" style={styles.errorForms}>
                      Please enter the collective value
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-12 text-end">
              <Button
                style={{ marginRight: 10 }}
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  setValuation(true);
                  setAspects(false);
                }}
              >
                Back
              </Button>
              <Button
                className=""
                variant="primary"
                size="sm"
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            </div>
          </div>
        )}

        {/* {count == 9 ? (
          <div className="col-12 text-end mt-4">
            <Button
              className=""
              variant="primary"
              size="lg"
              onClick={handleClickOpen}
            >
              Submit
            </Button>
          </div>
        ) : (
          <div className="col-12 col-md-12 text-end">
            <Button
              className=""
              variant="primary"
              size="sm"
              onClick={() => handleAddInput()}
            >
              Next
            </Button>
          </div>
        )} */}
      </Form>

      <Dialog
        fullScreen={fullScreen}
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <h3 className="text-center bold">
            Thank you for completing this form!
          </h3>
          <p className="f-15 gray bold text-center">
            This form helps you understand the potential for a judicial
            determination of rent. This is not a substitute for legal advice;
            it&apos;s strongly recommended to consult an attorney to confirm
            eligibility and guide you through the formal process. One of our
            advisors will be reviewing your information and will be in touch
            soon..
          </p>
        </DialogContent>
        <DialogActions className="justify-content-center pb-4">
          <Button
            variant="primary"
            onClick={() => {
              setOpenDialog(false);
              router.push("/client/cases");
            }}
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
