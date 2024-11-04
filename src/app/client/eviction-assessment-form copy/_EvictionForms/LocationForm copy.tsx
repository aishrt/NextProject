"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import DateField from "@/components/Form/DateField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter } from "next/navigation";
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
import { FormGroup } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
type FormValues = {
  taxes: string;
  reason: string;
  sublease: string;
  employee: number;
  non_renew: string;
  leaseEndDate: any;
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

export const LocationForm = () => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
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
  const [isRenew, setRenewed] = useState<boolean>(); // Initialize count state variable with 0
  const [isActivityInPremises, setActivityPremises] = useState<boolean>();
  const [isSubletting, setSubletting] = useState<string>("");
  const [isValuationMethod, setValuationMethod] = useState<string | null>("");

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();
  const handleSubmit = (values: FormValues) => {
    setLoading(true);
  };

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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
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
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mb-4">Lease Termination & Impact </h3>

      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label>End date of the lease</label>
              <DateField
                error={formState.errors["leaseEndDate"]}
                name="leaseEndDate"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label>Reason for the end of the lease</label>
              <SelectField
                options={options}
                label=""
                className="bglight-select"
                name="reason"
                error={formState.errors["reason"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label>Date of Notice of Non-Renewal/Termination</label>
              <DateField
                error={formState.errors["date"]}
                label="Date"
                name="date"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
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
              <SelectField
                options={nonrenew}
                label=""
                name="nonrenew"
                className="bglight-select"
                error={formState.errors["non_renew"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label>Subleasing</label>
              <SelectField
                options={sublease}
                label=""
                name="sublease"
                className="bglight-select"
                error={formState.errors["sublease"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-12 mb-4">
            <div className="mb-3">
              <label className="relative">Lease Management</label>

              <div className="buttons-row d-flex gap-3">
                <Button variant="outline" size="lg" value="yes">
                  Yes
                </Button>
                <Button variant="outline" size="lg" value="no">
                  No
                </Button>
              </div>
            </div>
          </div>
        </div>

        {show && (
          <div>
            <hr />
            <h3 className="f-22 bold my-4 mt-5 gray">
              Property Details & Characteristics
            </h3>
            <div className="row">
              <div className="col-12 col-md-6 mb-4">
                <div className="">
                  <label className="relative">Type of premises</label>
                  <SelectField
                    options={premises}
                    label=""
                    name="premises_type"
                    className="bglight-select"
                    error={formState.errors["premises_type"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label>Other</label>
                  <InputField
                    error={formState.errors["other"]}
                    label="Other"
                    name="other"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="relative">
                    Surface area (in square meters)
                  </label>
                  <NumberField
                    error={formState.errors["surface_area"]}
                    label="Surface area (in square meters)"
                    name="surface_area"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
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
                  <SelectField
                    options={premisesUse}
                    label=""
                    name="premisesUse"
                    className="bglight-select"
                    error={formState.errors["premisesUse"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-12 mb-4">
                <div className="">
                  <label className="relative">Easy customer access?</label>
                  <div className="buttons-row d-flex gap-3">
                    <Button variant="outline" size="lg" value="yes">
                      Yes
                    </Button>
                    <Button variant="outline" size="lg" value="no">
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
                  <NumberField
                    error={formState.errors["frontage"]}
                    label="Facade Frontage (Meters)"
                    name="frontage"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
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
                  <SelectField
                    options={premises_state}
                    label=""
                    name="premises_state"
                    className="bglight-select"
                    error={formState.errors["premises_state"]}
                    control={control}
                  />
                </div>
              </div>
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
                  <SelectField
                    options={building}
                    label=""
                    className="bglight-select"
                    name="building"
                    error={formState.errors["building"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className=" relative">Age of Building</label>
                  <SelectField
                    options={age}
                    label=""
                    className="bglight-select"
                    name="age"
                    error={formState.errors["age"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className=" relative">Location</label>
                  <SelectField
                    options={location}
                    label=""
                    className="bglight-select"
                    name="location"
                    error={formState.errors["location"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className=" relative">Situation Within City</label>
                  <SelectField
                    options={situation}
                    label=""
                    className="bglight-select"
                    name="situation"
                    error={formState.errors["situation"]}
                    control={control}
                  />
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

                  <SelectField
                    options={transport}
                    label=""
                    className="bglight-select"
                    name="transport"
                    error={formState.errors["transport"]}
                    control={control}
                  />
                </div>
              </div>
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
                    <Button variant="outline" size="lg" value="yes">
                      Yes
                    </Button>
                    <Button variant="outline" size="lg" value="no">
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
                  <SelectField
                    options={reputedbrand}
                    label=""
                    className="bglight-select"
                    name="brands"
                    error={formState.errors["brands"]}
                    control={control}
                  />
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
                  <SelectField
                    options={competebrand}
                    label=""
                    className="bglight-select"
                    name="brands"
                    error={formState.errors["brands"]}
                    control={control}
                  />
                </div>
              </div>
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
                  <SelectField
                    options={finance}
                    label=""
                    className="bglight-select"
                    name="finance"
                    error={formState.errors["finance"]}
                    control={control}
                  />
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
                  <SelectField
                    options={notoriety}
                    label=""
                    className="bglight-select"
                    name="notoriety"
                    error={formState.errors["notoriety"]}
                    control={control}
                  />
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
                  <NumberField
                    error={formState.errors["employee"]}
                    label="Number of employees"
                    name="employee"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
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
                  <SelectField
                    options={openhours}
                    label=""
                    className="bglight-select"
                    name="openhours"
                    error={formState.errors["openhours"]}
                    control={control}
                  />
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
                  <SelectField
                    options={weekhours}
                    label=""
                    className="bglight-select"
                    name="weekhours"
                    error={formState.errors["weekhours"]}
                    control={control}
                  />
                </div>
              </div>
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
                      <NumberField
                        error={formState.errors["renew"]}
                        label="Add Number"
                        name="renew"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
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
                      <InputField
                        error={formState.errors["describe"]}
                        label="Please Describe"
                        name="describe"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
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
                      value={value}
                      onChange={handleChange}
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
                      <InputField
                        error={formState.errors["describe"]}
                        label="Percent of Space"
                        name="percent"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  )}
                </div>
              </div>
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
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      control={<Checkbox />}
                      label="Right to display"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      control={<Checkbox />}
                      label="Terrace"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      control={<Checkbox />}
                      label="Other "
                    />
                  </FormGroup>
                  <div className="mb-3 mt-3 lease-input">
                    <label>Please Describe</label>
                    <InputField
                      error={formState.errors["describe"]}
                      label="Please Describe"
                      name="describe"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
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
                  <SelectField
                    options={clientele}
                    label=""
                    name="clientele"
                    className="bglight-select"
                    error={formState.errors["clientele"]}
                    control={control}
                  />
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
                  <SelectField
                    options={strength}
                    label=""
                    name="strength"
                    className="bglight-select"
                    error={formState.errors["strength"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Weaknesses of the Business
                  </label>
                  <SelectField
                    options={weakness}
                    label=""
                    name="weakness"
                    className="bglight-select"
                    error={formState.errors["weakness"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Retention of Clientele
                  </label>
                  <SelectField
                    options={retention}
                    label=""
                    name="retention"
                    className="bglight-select"
                    error={formState.errors["retention"]}
                    control={control}
                  />
                </div>
              </div>
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
                      <NumberField
                        error={formState.errors["revenue"]}
                        label="Lessee's Activities "
                        name="revenue"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
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
                      <NumberField
                        error={formState.errors["revenue"]}
                        label=" Average Annual Revenue"
                        name="revenue"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </>
                )}

                {isValuationMethod == "Gross Operating Surplus" && (
                  <div className="mb-3 lease-input">
                    <label className="tooltip-title relative">
                      Annual Gross Operating Surplus
                    </label>
                    <InputField
                      error={formState.errors["gross"]}
                      label="Annual Gross Operating Surplus"
                      name="gross"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                )}

                {isValuationMethod ==
                  "Average between revenue and gross operating surplus" && (
                  <div className="mb-3 lease-input">
                    <label className="tooltip-title relative">
                      Average Annual Amount between Revenue and Gross Operating
                      Surplus.
                    </label>
                    <InputField
                      error={formState.errors["gross"]}
                      label="Average Annual Amount between Revenue and Gross Operating Surplus."
                      name="gross"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                )}

                {isValuationMethod == "Gross margin" && (
                  <div className="mb-3 lease-input">
                    <label className="tooltip-title relative">
                      Annual Gross Margin Amount
                    </label>
                    <NumberField
                      error={formState.errors["annual_amount"]}
                      label="Annual Gross Margin Amount"
                      name="annual_amount"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                )}
                {isValuationMethod == "Special: daily receipts" && (
                  <div className="mb-3 lease-input">
                    <label className="tooltip-title relative">
                      Daily Revenue
                    </label>
                    <NumberField
                      error={formState.errors["annual_amount"]}
                      label="Daily Revenue"
                      name="annual_amount"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                )}
              </div>
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
                  <SelectField
                    options={collective}
                    label=""
                    name="collective"
                    className="bglight-select"
                    error={formState.errors["collective"]}
                    control={control}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {count == 9 ? (
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
        )}
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
