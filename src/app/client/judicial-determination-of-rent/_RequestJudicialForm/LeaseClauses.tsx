"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import bubble from "@/assets/info.png";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Judicial } from "@/types/Judicial";

type FormValues = {
  businessActivity: string;
  specificActivity: string;
};

let clauseArr: any = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "Free Transfer of Lease",
    value: "Free Transfer of Lease",
  },
  {
    label: "Sublease Rights",
    value: "Sublease Rights",
  },

  {
    label: "Right to Management Lease",
    value: "Right to Management Lease",
  },

  {
    label: "Exempt from Maintenance",
    value: "Exempt from Maintenance",
  },

  {
    label: "Personal Use Allowed",
    value: "Personal Use Allowed",
  },

  {
    label: "Indivisibility Clause",
    value: "Indivisibility Clause",
  },
];

const options = [
  { label: "Automotive ", value: "Automotive" },
  { label: "Food", value: "Food" },
  { label: "Housing", value: "Housing" },
  { label: "Sales", value: "Sales" },
  { label: "Services", value: "Services" },
];
const specificActivity = [
  { label: "Student", value: "student" },
  { label: "Laborer", value: "laborer" },
];
const automotiveActivity = [
  { label: "Garage", value: "Garage" },
  { label: "Parking", value: "Parking" },
  { label: "Service Station", value: "Service Station" },
  { label: "Car Wash", value: "Car Wash" },
];
const foodActivity = [
  { label: "Supermarkets", value: "Supermarkets" },
  { label: "General Food Stores", value: "General Food Stores" },
  { label: "Grocery", value: "Grocery" },
  { label: "Bakery", value: "Bakery" },

  { label: "Pastry Shop", value: "Pastry Shop" },
  { label: "Tea Room", value: "Tea Room" },
  { label: "Confectionery", value: "Confectionery" },
  { label: "Ice Cream Shop", value: "Ice Cream Shop" },
  { label: "Butchery", value: "Butchery" },

  { label: "Charcuterie", value: "Charcuterie" },
  { label: "Fish Shop", value: "Fish Shop" },
  { label: "Restaurant", value: "Restaurant" },

  { label: "Cafe", value: "Cafe" },
  { label: "Bar", value: "Bar" },
];

const housingActivity = [
  { label: "Hotel", value: "Hotel" },
  { label: "Other Residences", value: "Other Residences" },
  { label: "Real Estate Agency", value: "Real Estate Agency" },
];
const salesActivity = [
  { label: "Textile", value: "Textile" },
  { label: "Clothing and Accessories", value: "Clothing and Accessories" },
  { label: "Shoes", value: "Shoes" },
  { label: "Bookstore", value: "Bookstore" },
  { label: "Tobacco", value: "Tobacco" },
  { label: "Press Lottery", value: "Press Lottery" },
  { label: "Jewelry", value: "Jewelry" },
  { label: "Watchmaking", value: "Watchmaking" },
  { label: "Other", value: "Other" },
];

const servicesActivity = [
  { label: "Hairdressing", value: "Hairdressing" },
  { label: "Aesthetics", value: "Aesthetics" },
  { label: "Dry Cleaning", value: "Dry Cleaning" },
  { label: "Laundry", value: "Laundry" },
  { label: "Travel Agency", value: "Travel Agency" },
  { label: "Storage Activities", value: "Storage Activities" },
  { label: "Offices", value: "Offices" },
  { label: "Other", value: "Other" },
];

const schema = z.object({
  businessActivity: z
    .string({
      required_error: "Please select the business activity sector",
      invalid_type_error: "Please select the business activity sector",
    })
    .min(1, "Please select the business activity sector"),

  specificActivity: z
    .string({
      required_error: "Please select the specific activity",
      invalid_type_error: "Please select the specific activity",
    })
    .min(1, "Please select the specific activity"),
});

const LeaseClauses = ({
  data,
  hide
}: {
  data: Judicial | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, setValue } = methods;

  const [loading, setLoading] = useState(false);
  const [activity, setActivity] = useState("");
  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const [errors, setErrors] = useState({
    clauseErr: false,
    favorableErr: false,
  });

  const [exclusiveClause, setExclusive] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setExclusive((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.clauseErr = false;
      return newErrorObj;
    });
  };
  const [favorableClause, setClause] = React.useState<string[]>([]);

  const handleClause = (label: number) => {
    setClause((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.favorableErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!exclusiveClause) {
      isError = true;
      errorObj = { ...errorObj, clauseErr: true };
    }

    if (favorableClause.length == 0) {
      isError = true;
      errorObj = { ...errorObj, favorableErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }

    return isError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }

      let payload = {};
      if (hide) {
        payload = {
          caseId: caseId,
          ...values,
          exclusiveClause,
          favorableClause
        }
      } else {
        payload = {
          caseId: caseId,
          ...values,
          exclusiveClause,
          favorableClause,
          progress: 40,
          nextProgress: 40,
        }
      }
      
      const { data } = await axios.post("/api/client/category/judicial/createJudicial", payload);
      if (!hide) {
        let id = data.data.caseId;
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");
        router.push(
          `/client/judicial-determination-of-rent?${searchParam.toString()}`
        );
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setValue("businessActivity", "null");
    setExclusive("");
    setClause([]);
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        {
          caseId: caseId,
          progress: 20,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(
        `/client/judicial-determination-of-rent?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue("businessActivity", data?.businessActivity ?? "");
    setValue("specificActivity", data?.specificActivity ?? "");
    setActivity(data?.businessActivity ?? "");
    setExclusive(data?.exclusiveClause ?? "");
    setClause(data?.favorableClause ?? []);
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> 
        Business Details & Lease Clauses
      </h6>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input md-3">
                <label className="d-block">Business Activity Sector</label>
                <SelectField
                  options={options}
                  label=""
                  name="businessActivity"
                  disabled={hide}
                  className="bglight-select"
                  error={formState.errors["businessActivity"]}
                  control={control}
                  emitChange={(val: any) => {
                    setActivity(val);
                  }}
                />
              </div>

              {activity == "Automotive" && (
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    {activity.toString()} Activity
                  </label>
                  <SelectField
                    options={automotiveActivity}
                    label=""
                    name="specificActivity"
                    className="bglight-select"
                    disabled={hide}
                    error={formState.errors["specificActivity"]}
                    control={control}
                  />
                </div>
              )}

              {activity == "Food" && (
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    {activity.toString()} Activity
                  </label>
                  <SelectField
                  disabled={hide}
                    options={foodActivity}
                    label=""
                    name="specificActivity"
                    className="bglight-select"
                    error={formState.errors["specificActivity"]}
                    control={control}
                  />
                </div>
              )}

              {activity == "Housing" && (
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    {activity.toString()} Activity
                  </label>
                  <SelectField
                    options={housingActivity}
                    label=""
                    disabled={hide}
                    name="specificActivity"
                    className="bglight-select"
                    error={formState.errors["specificActivity"]}
                    control={control}
                  />
                </div>
              )}

              {activity == "Sales" && (
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    {activity.toString()} Activity
                  </label>
                  <SelectField
                    options={salesActivity}
                    disabled={hide}
                    label=""
                    name="specificActivity"
                    className="bglight-select"
                    error={formState.errors["specificActivity"]}
                    control={control}
                  />
                </div>
              )}

              {activity == "Services" && (
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    {activity.toString()} Activity
                  </label>
                  <SelectField
                  disabled={hide}
                    options={servicesActivity}
                    label=""
                    name="specificActivity"
                    className="bglight-select"
                    error={formState.errors["specificActivity"]}
                    control={control}
                  />
                </div>
              )}
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Exclusive Destination Clause?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This clause restricts the use of the premises to a specific
                    purpose or activity.
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={exclusiveClause}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                    disabled={hide}
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="no"
                      control={<Radio />}
                      disabled={hide}
                      label="No"
                    />
                  </RadioGroup>
                  {errors.clauseErr && (
                    <span className="text-danger">
                      Please select the exclusive destination clause
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="radio-end-input two-cols mb-3">
                <label className="d-block">Favorable Clauses</label>

                <FormGroup>
                  {clauseArr.map((i: any, index: number) => {
                    return (
                      <FormControlLabel
                        key={index}
                        className="radio-light-ip"
                        disabled={hide}
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleClause(i.value)}
                        checked={favorableClause.includes(i.value) ?? false}
                      />
                    );
                  })}
                </FormGroup>
                {errors.favorableErr && (
                  <span className="text-danger">
                    Please select the evidence of violation
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
              <Button
                variant="outline"
                size="lg"
                className={`next-btn f-16 ${hide ? "d-none" : "block"}`}
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="contained"
                className={`client-btn submit-btn ${hide ? "d-none" : "block"}`}
                size="lg"
                onClick={() => errHandle()}
              >
                <span className="f-16">Next</span>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default LeaseClauses;
