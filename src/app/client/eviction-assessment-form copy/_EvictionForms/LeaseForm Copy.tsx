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
import { InputAdornment } from "@mui/material";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import TextAreaField from "@/components/Form/TextArea";
import euro from "@/assets/euro.png";
import axios from "axios";
import thank from "@/assets/thank.png";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Button } from "@/components/Form/Button";

type FormValues = {
  initialLease: string;
  nature: string;
  taxes: string;
  rent: string;
  activity: string;
  activityDetail: string;
  years: string;
  date: string;
  weightedArea: string;
  area: string;
  floor: string;
  surface: string;
  activity_type: string;
  automotive: string;
  housing: string;
  food: string;
  sales: string;
  services: string;
  other: string;
};

type LeaseForm = {
  initialLease: string;
  years: string;
  rent: string;
};
const options = [
  { label: "Automotive Sector", value: "automotiveSector" },
  { label: "Housing Sector", value: "housingSector" },
  { label: "Food Sector", value: "foodSector" },
  { label: "Sales Sector", value: "salesSector" },
  { label: "Services Sector", value: "servicesSector" },
];
const nature = [
  { label: "Offices", value: "offices" },
  { label: "Shop", value: "shop" },
  { label: "Workshop", value: "workshop" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Hotel", value: "hotel" },
  { label: "Warehouse", value: "warehouse" },
  { label: "Other", value: "other" },
];
const activity = [
  { label: "Automotive Sector", value: "automotiveSector" },
  { label: "Housing Sector", value: "housingSector" },
  { label: "Food Sector", value: "foodSector" },
  { label: "Sales Sector", value: "salesSector" },
  { label: "Services Sector", value: "servicesSector" },
  { label: "Other (please specify)", value: "other" },
];
const surface = [
  { label: "Sales area", value: "salesArea" },
  { label: "Stock", value: "stock" },
  { label: "Warehouse Reserve", value: "warehouseReserve" },
  { label: "Offices", value: "offices" },
  { label: "Annexes", value: "annexes" },
];
const automotive = [
  { label: "Garage", value: "garage" },
  { label: "Parking", value: "parking" },
  { label: "Service Station", value: "serviceStation" },
  { label: "Car Wash", value: "carWash" },
];
const housing = [
  { label: "Hotel", value: "hotel" },
  { label: "Other Residences", value: "otherResidences" },
  { label: "Real Estate Agency", value: "realEstateAgency" },
];
const food = [
  { label: "Supermarkets, Stores, Grocery", value: "grocery" },
  {
    label: "Bakery, Pastry Shop,Tea Room, Confectionery, Ice Cream Shop ",
    value: "bakery",
  },
  { label: "Butchery, Charcuterie, Fish Shop", value: "fishShop" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Café, Bar ", value: "cafe" },
  { label: "Other", value: "other" },
];
const sales = [
  { label: "Textiles, Clothing and Shoe Accessories", value: "textiles" },
  { label: "Bookstore", value: "bookstore" },
  { label: "Tobacco, Press, Lottery", value: "tobacco" },
  { label: "Jewelry, Watchmaking", value: "jewelry" },
  { label: "Other Sales", value: "otherSales" },
];
const services = [
  { label: "Hairdressing, Beauty", value: "beauty" },
  { label: "Dry Cleaning, Laundry", value: "dryCleaning" },
  { label: "Travel Agency", value: "travelAgency" },
  { label: "Storage Activities", value: "storageActivities" },
  { label: "Offices", value: "offices" },
  { label: "Other Services", value: "otherServices" },
];

const schema = z.object({
  initialLease: z.string().optional(),
  taxes: z.string().optional(),
  years: z.string().optional(),
  rent: z.string().optional(),
  weightedArea: z.string().optional(),
  date: z.string().optional(),
  nature: z.string().optional(),
  area: z.string().optional(),
  floor: z.string().optional(),
  activity_type: z.string().optional(),
  activity: z.string().optional(),
  activityDetail: z.string().optional(),
});

const LeaseForm = () => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [show, setShow] = useState<boolean>(false);
  const [count, setCount] = useState(0); // Initialize count state variable with 0
  const [useClause, setClause] = useState<boolean>(); // Initialize count state variable with 0
  const [isActivity, setActivity] = useState<boolean>(false);
  const [error, setErr] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [activityType, setActivityType] = useState<string | null>("");
  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const handleSubmit = (values: FormValues) => {
    try {
      setLoading(true);
      if (!values.initialLease) {
        return;
      }
      console.log(values.initialLease);

      console.log(formState.isValid);
    } catch (error) {
      console.log("err", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      initialLease: "",
      taxes: "",
      years: "",
      date: "",
      rent: "",
      weightedArea: "",
      activityDetail: "",
      activity: "",
      area: "",
      floor: "",
    });
  }, []);

  const handleAddInput = () => {
    const newCount = count + 1;
    setCount(newCount);
    // if (newCount == 1) {
    //   console.log(formState.isValid);
    // }
    newCount === 1 ? setShow(true) : setActivity(true);
  };
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = () => {
    setOpen(false);
    router.push("/client/eviction-assessment-form/proceed-second");
  };

  const handleChange = (val: string | null) => {
    setActivityType(val);
  };

  const handleNature = (val: string | null) => {};

  const handleSurface = (val: string | null) => {};

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mb-2">
        Eviction Compensation Assessment Form: Get the Compensation You Deserve!{" "}
      </h3>
      <div>
        <h2 className="f-14 gray pb-4">
          This form helps you estimate the eviction compensation you may be
          entitled to. Answer the questions as accurately as possible. Tooltips
          (?) are available for guidance.
        </h2>
        <h2 className="f-18 mb-2">Form Completion Tips: </h2>
        <p className="f-14 gray mb-1">
          📄 Have your lease documents handy. Accurate information is essential
          for this evaluation.
        </p>
        <p className="f-14 gray mb-1">
          💾 Unsure about a question? You can save your progress and come back
          to it later.
        </p>
        <p className="f-14 gray mt-3 bold">
          This should take about 10 minutes to complete. Let&apos;s start with
          your lease information.
        </p>
      </div>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <hr />
        <div className="row mt-5">
          <div className="col-12 col-md-12 mb-3">
            <h6 className="f-22 bold pb-3">Initial Lease Agreement Details</h6>
            <div className="row">
              <div className="col-12 col-md-6 mb-4 date-input">
                <div className="lease-input">
                  <label>Start date of the initial lease</label>
                  <DateField
                    error={formState.errors["initialLease"]}
                    label=""
                    name="initialLease"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Duration of the initial lease (in years)
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Generally, the initial term of the contract is 9 years
                    </span>
                    {/* </div> */}
                  </label>
                  <NumberField
                    error={formState.errors["years"]}
                    label="Duration of the initial lease (in years)"
                    name="years"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label>Current annual rent (excluding taxes)</label>
                  <InputField
                    error={formState.errors["rent"]}
                    label="Annual rent"
                    name="rent"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {show && (
          <div>
            <hr />
            <h3 className="f-22 bold my-4 gray">
              Continued Lease Terms Overview
            </h3>
            <div className="row">
              <div className="col-12 col-md-12">
                <div className="mb-4">
                  <label className="tooltip-title relative">
                    Exclusive Use Clause
                    {/* <div className="tooltip-icn relative"> */}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Did your lease specify the rented space was for your
                      exclusive use?
                    </span>
                    {/* </div> */}
                  </label>

                  <div className="buttons-row d-flex gap-3">
                    <Button
                      // variant={useClause == true ? "contained" : "white"}
                      variant="outline"
                      size="lg"
                      value="yes"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        {
                          setClause(true);
                          setErr(false);
                        }
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      // variant={useClause == false ? "contained" : "white"}
                      variant="outline"
                      value="no"
                      size="lg"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        {
                          setClause(false);
                          setErr(false);
                        }
                      }}
                    >
                      No
                    </Button>
                  </div>
                  {error && (
                    <span
                      className="text-danger"
                      style={{ fontSize: "0.75rem" }}
                    >
                      {" "}
                      Please select the exclusive use clause{" "}
                    </span>
                  )}
                </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="relative">Nature of the Premises</label>

                  <SelectField
                    options={nature}
                    label=""
                    name="nature"
                    className="bglight-select"
                    error={formState.errors["nature"]}
                    control={control}
                    emitChange={handleNature}
                  />
                </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="relative">Type of Surface</label>

                  <SelectField
                    options={surface}
                    label=""
                    name="surface"
                    className="bglight-select"
                    error={formState.errors["surface"]}
                    control={control}
                    emitChange={handleSurface}
                  />
                </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="relative">
                    Main Area of the Premises (in square meters)
                  </label>
                  <NumberField
                    error={formState.errors["area"]}
                    label="Main Area of the Premises "
                    name="area"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>

                <h3 className="f-22 bold mb-4 mt-5 gray">Business Activity</h3>
                <div className="mb-3 lease-input">
                  <label className="relative">Type of activity</label>

                  <SelectField
                    options={activity}
                    label=""
                    name="activity_type"
                    className="bglight-select"
                    emitChange={handleChange}
                    error={formState.errors["activity_type"]}
                    control={control}
                  />
                </div>

                {activityType == "automotiveSector" && (
                  <div className="mb-3 lease-input">
                    <label className="relative">Automotive Sector</label>

                    <SelectField
                      options={automotive}
                      label=""
                      name="automotive"
                      className="bglight-select"
                      emitChange={() => {}}
                      error={formState.errors["automotive"]}
                      control={control}
                    />
                  </div>
                )}

                {activityType == "housingSector" && (
                  <div className="mb-3 lease-input">
                    <label className="relative">Housing Sector</label>

                    <SelectField
                      options={housing}
                      label=""
                      name="housing"
                      className="bglight-select"
                      emitChange={() => {}}
                      error={formState.errors["housing"]}
                      control={control}
                    />
                  </div>
                )}

                {activityType == "foodSector" && (
                  <div className="mb-3 lease-input">
                    <label className="relative">Food Sector</label>

                    <SelectField
                      options={food}
                      label=""
                      name="food"
                      className="bglight-select"
                      error={formState.errors["food"]}
                      emitChange={() => {}}
                      control={control}
                    />
                  </div>
                )}

                {activityType == "salesSector" && (
                  <div className="mb-3 lease-input">
                    <label className="relative">Sales Sector</label>

                    <SelectField
                      options={sales}
                      label=""
                      name="sales"
                      className="bglight-select"
                      error={formState.errors["sales"]}
                      emitChange={() => {}}
                      control={control}
                    />
                  </div>
                )}

                {activityType == "servicesSector" && (
                  <div className="mb-3 lease-input">
                    <label className="relative">Services Sector</label>

                    <SelectField
                      options={services}
                      label=""
                      name="services"
                      className="bglight-select"
                      error={formState.errors["services"]}
                      emitChange={() => {}}
                      control={control}
                    />
                  </div>
                )}
                {activityType == "other" && (
                  <div className="mb-3 lease-input">
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
                )}
              </div>
            </div>
          </div>
        )}

        {count == 1 ? (
          <div className="col-12 col-md-12 text-end mt-4">
            <Button
              type="submit"
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
              size="lg"
              onClick={(e) => {
                e.preventDefault();
                handleAddInput();
              }}
            >
              Next
            </Button>
          </div>
        )}

      </Form>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <div className="thanks-icon text-center">
            <Image src={thank} alt="thank" />
          </div>
          <p className="f-15 gray bold text-center">
            Your form has been saved. An advisor may contact you for further
            details. You can now proceed to the second part of the form or
            contact one of our consultants for assistance if you experience any
            difficulties.
          </p>
        </DialogContent>
        <DialogActions className="justify-content-center pb-4">
          <Button variant="primary" onClick={handleClick} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LeaseForm;
