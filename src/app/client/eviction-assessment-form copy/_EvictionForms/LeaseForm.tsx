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
import moment from "moment";
import { Spinner } from "@/components/Form/Spinner";
import CircularProgress from "@mui/material/CircularProgress";

type FormValues = {
  leaseInitialDate: string;
  leaseInitialYear: string;
  annualRent: string;
  premisesNature: string;
  premisesArea: any;
  activitySector: any;
  useClause: any;
  surfaceType: string;
  taxes: string;
  date: string;
  weightedArea: string;
  floor: string;
  activityType: string;
  automotive: string;
  housing: string;
  food: string;
  sales: string;
  services: string;
  other: string;
};

type LeaseFormValues = {
  leaseInitialDate: string;
  leaseInitialYear: any;
  annualRent: string;
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

const leaseSchema = z.object({
  leaseInitialDate: z
    .string({ required_error: "Please select the start date of initial lease" })
    .min(1, "Please select the start date of initial lease"),
  leaseInitialYear: z
    .number({ invalid_type_error: "Please provide the initial lease year" })
    .min(1, "Please provide the initial lease year"),

  annualRent: z
    .number({ required_error: "Please enter the rent",invalid_type_error:"Please enter the rent" })
    .min(1, "Please enter the rent")
    //.regex(/^(?:[0-9]\d*|0)$/, "Only digits are allowed"),
});

const schema = z.object({
  premisesNature: z
    .string({ required_error: "Please select the nature of the premises" })
    .min(1, "Please select the nature of the premises"),
  surfaceType: z
    .string({ required_error: "Please select the type of surface" })
    .min(1, "Please select the type of surface"),
  premisesArea: z
    .number({ invalid_type_error: "Area is required" })
    .min(1, "Area is required"),
  activityType: z
    .string({ required_error: "Please select the activity" })
    .min(1, "Please select the activity"),
  activitySector: z
    .string({ required_error: "Please select the activity" })
    .min(1, "Please select the activity"),
});

const LeaseForm = () => {
  const { methods: leaseMethods, setValues: setLeaseValues } = useHookForm<
    LeaseFormValues,
    typeof leaseSchema
  >(leaseSchema);

  const { formState: leaseFormState, control: leaseControl } = leaseMethods;

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);

  const { formState, control } = methods;
  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  console.log(caseId);

  const [show, setShow] = useState<string>("first");
  const [count, setCount] = useState(0); // Initialize count state variable with 0
  const [showBtn, setShowBtn] = useState<boolean>(true);
  const [useClause, setClause] = useState<boolean>(); // Initialize count state variable with 0
  const [isActivity, setActivity] = useState<boolean>(false);
  const [error, setErr] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);
  const [evictionData, setEvi] = useState<any>({});
  const [activityType, setActivityType] = useState<string | null>("");
  const [id, SetIdd] = useState<string | null>("");
  const [activitySector, setActivitySector] = useState<string | null>("");
  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();
  console.log(leaseFormState.errors);
  const localid = window.localStorage.getItem("evId");

  useEffect(() => {
    SetIdd(localid);
  }, [localid]);
  console.log(id, "opopopopopoppopopp");

  const getData = async () => {
    setDataLoading(true);
    const data = await axios.get(`/api/client/category/eviction/getEviction?caseId=${caseId}`);
    console.log(data, "datatatatatat");
    setEvi(data?.data?.data);
    setDataLoading(false);
  };
  console.log(evictionData, "evictionData");

  useEffect(() => {
    if (caseId) {
      getData();
    }
  }, [caseId]);

  const handleLease = async (values: LeaseFormValues) => {
    try {
      setLoading(true);
      console.log(values);
      const response = await axios.post("/api/client/category/eviction/createEviction", {
        ...values,
        caseId: caseId,
      });
      console.log(response?.data?.data, "response?.data?.data");
      const userId = response?.data?.data?.user;
      const eviId = response?.data?.data?._id;
      SetIdd(eviId);
      window.localStorage.setItem("evId", eviId);
      setShow("second");
      setShowBtn(false);
    } catch (error) {
      console.log("err", error);
      setLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      values.useClause = useClause;
      console.log(values);
      await axios.post("/api/client/category/eviction/createEviction", {
        ...values,
        caseId: caseId,
      });

      setShow("second");
      setShowBtn(false);
      handleClickOpen();
    } catch (error) {
      console.log("err", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLeaseValues({
      leaseInitialDate: "",
      leaseInitialYear: "",
      annualRent: "",
    });
  }, []);

  useEffect(() => {
    setLeaseValues({
      leaseInitialDate: evictionData?.leaseInitialDate,
      leaseInitialYear: parseInt(evictionData?.leaseInitialYear, 10),
      annualRent: evictionData?.annualRent,
    });
  }, [evictionData]);

  useEffect(() => {
    setValues({
      premisesNature: evictionData?.premisesNature,
      surfaceType: evictionData?.surfaceType,
      premisesArea: parseInt(evictionData?.premisesArea, 10),
      activityType: evictionData?.activityType,
      activitySector: evictionData?.activitySector,
    });
    setActivityType(evictionData?.activityType);
    setClause(true);
    setErr(false);
  }, [evictionData]);

  console.log(
    activityType,
    "activityType --------------------------- activityType"
  );

  useEffect(() => {
    setValues({
      premisesNature: "",
      surfaceType: "",
      premisesArea: "",
      activityType: "",
      activitySector: "",
    });
  }, []);

  const handleAddInput = () => {
    if (show == "first") {
      // if (
      // ) {
      //   return false;
      // }
      // return true;
      // return ;
      // setShow("second");
    }
    // const newCount = count + 1;
    // setCount(newCount);
    // if (newCount == 1) {
    //   return;
    // }
    //newCount === 1 ? setShow(true) : setActivity(true);
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
    router.push(`/client/eviction-assessment-form/proceed-second?caseId=${caseId}`);
  };

  const handleChange = (val: string | null) => {
    setActivityType(val);
  };

  const handleNature = (val: string | null) => {
    if (!val) {
      setValues({ premisesNature: "" });
    }
  };

  const handleSurface = (val: string | null) => {
    if (!val) {
      setValues({ surfaceType: "" });
    }
  };

  const handleActivity = (val: string | null) => {
    if (!val) {
      setValues({ activityType: "" });
    }
  };
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mb-2">
        Eviction Compensation Assessment Form: Get the Compensation You Deserve!
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

      {loadingData ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <>
          <Form<LeaseFormValues> onSubmit={handleLease} methods={leaseMethods}>
            <hr />
            {show == "first" && (
              <div className="row mt-5">
                <div className="col-12 col-md-12 mb-3">
                  <h6 className="f-22 bold pb-3">
                    Initial Lease Agreement Details
                  </h6>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-4">
                      <div className="lease-input">
                        <label>Start date of the initial lease</label>

                        <DateField
                          error={leaseFormState.errors["leaseInitialDate"]}
                          label=""
                          name="leaseInitialDate"
                          variant="filled"
                          className="bglight-ip"
                          control={leaseControl}
                          // defaultValue={evictionData?.leaseInitialDate}
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
                            Generally, the initial term of the contract is 9
                            years
                          </span>
                          {/* </div> */}
                        </label>
                        <NumberField
                          error={leaseFormState.errors["leaseInitialYear"]}
                          label="Duration of the initial lease (in years)"
                          name="leaseInitialYear"
                          variant="filled"
                          className="bglight-ip"
                          control={leaseControl}
                        />
                      </div>
                    </div>
                    <div className="col-12 col-md-6 mb-4">
                      <div className="lease-input">
                        <label>Current annual rent (excluding taxes)</label>
                        <NumberField
                          error={leaseFormState.errors["annualRent"]}
                          label="Annual rent"
                          name="annualRent"
                          variant="filled"
                          className="bglight-ip"
                          control={leaseControl}
                          // defaultValue={evictionData?.annualRent}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showBtn && (
              <div className="col-12 col-md-12 text-end mt-4">
                <Button
                  type="submit"
                  className=""
                  variant="primary"
                  size="lg"
                  // onClick={handleClickOpen}
                >
                  Next
                </Button>
              </div>
            )}
          </Form>
          <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
            {show == "second" && (
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
                          className={
                            useClause == true ? "bg-black text-white" : ""
                          }
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
                          className={
                            useClause == false ? "bg-black text-white" : ""
                          }
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
                        name="premisesNature"
                        className="bglight-select"
                        error={formState.errors["premisesNature"]}
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
                        name="surfaceType"
                        className="bglight-select"
                        error={formState.errors["surfaceType"]}
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
                        error={formState.errors["premisesArea"]}
                        label="Main Area of the Premises "
                        name="premisesArea"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>

                    <h3 className="f-22 bold mb-4 mt-5 gray">
                      Business Activity
                    </h3>
                    <div className="mb-3 lease-input">
                      <label className="relative">Type of activity</label>

                      <SelectField
                        options={activity}
                        label=""
                        name="activityType"
                        className="bglight-select"
                        error={formState.errors["activityType"]}
                        control={control}
                        emitChange={(val) => {
                          setActivityType(val);
                          if (!val) {
                            setValues({ activityType: "" });
                          }
                        }}
                      />
                    </div>

                    {activityType == "automotiveSector" && (
                      <div className="mb-3 lease-input">
                        <label className="relative">Automotive Sector</label>

                        <SelectField
                          options={automotive}
                          label=""
                          name="activitySector"
                          className="bglight-select"
                          error={formState.errors["activitySector"]}
                          control={control}
                          emitChange={(val) => {
                            setActivitySector(val);
                            if (!val) {
                              setValues({ activitySector: "" });
                            }
                          }}
                        />
                      </div>
                    )}

                    {activityType == "housingSector" && (
                      <div className="mb-3 lease-input">
                        <label className="relative">Housing Sector</label>

                        <SelectField
                          options={housing}
                          label=""
                          name="activitySector"
                          className="bglight-select"
                          error={formState.errors["activitySector"]}
                          control={control}
                          emitChange={(val) => {
                            setActivitySector(val);
                            if (!val) {
                              setValues({ activitySector: "" });
                            }
                          }}
                        />
                      </div>
                    )}

                    {activityType == "foodSector" && (
                      <div className="mb-3 lease-input">
                        <label className="relative">Food Sector</label>

                        <SelectField
                          options={food}
                          label=""
                          name="activitySector"
                          className="bglight-select"
                          error={formState.errors["activitySector"]}
                          control={control}
                          emitChange={(val) => {
                            setActivitySector(val);
                            if (!val) {
                              setValues({ activitySector: "" });
                            }
                          }}
                        />
                      </div>
                    )}

                    {activityType == "salesSector" && (
                      <div className="mb-3 lease-input">
                        <label className="relative">Sales Sector</label>

                        <SelectField
                          options={sales}
                          label=""
                          name="activitySector"
                          className="bglight-select"
                          error={formState.errors["activitySector"]}
                          control={control}
                          emitChange={(val) => {
                            setActivitySector(val);
                            if (!val) {
                              setValues({ activitySector: "" });
                            }
                          }}
                        />
                      </div>
                    )}

                    {activityType == "servicesSector" && (
                      <div className="mb-3 lease-input">
                        <label className="relative">Services Sector</label>
                        <SelectField
                          options={services}
                          label=""
                          name="activitySector"
                          className="bglight-select"
                          error={formState.errors["activitySector"]}
                          control={control}
                          emitChange={(val) => {
                            setActivitySector(val);
                            if (!val) {
                              setValues({ activitySector: "" });
                            }
                          }}
                        />
                      </div>
                    )}
                    {activityType == "other" && (
                      <div className="mb-3 lease-input">
                        <label>Other</label>
                        <InputField
                          error={formState.errors["activitySector"]}
                          label="Other"
                          name="activitySector"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-12 text-end mt-4">
                  <Button
                    type="submit"
                    className=""
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      if (!useClause) {
                        setErr(true);
                      } else {
                        setErr(false);
                      }
                    }}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </>
      )}

      {/* <div className="col-12 col-md-12 text-end mt-4">
        <Button
          type="submit"
          className=""
          variant="primary"
          size="lg"
          // onClick={handleClickOpen}
        >
          Submit 
        </Button>
      </div> */}

      {/* {count == 1 ? (
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
          </div> */}
      {/* ) : ( */}
      {/* <div className="col-12 col-md-12 text-end">
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
        </div> */}
      {/* )
        
        } */}
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
