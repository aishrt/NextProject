"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Judicial } from "@/types/Judicial";

type FormValues = {
  notableDate: string;
};

const rentArr = [
  { label: "Despecialization", value: "Despecialization" },
  { label: "Deterioration of Premises", value: "Deterioration of Premises" },
  { label: "Ongoing/Recent Works", value: "Ongoing/Recent Works" },

  { label: "Increase in Property Tax", value: "Increase in Property Tax" },

  {
    label: "New Favorable Local Factors",
    value: "Favorable",
  },

  {
    label: "New Unfavorable Local Factors",
    value: "Unfavorable",
  },
];
const favorableArr = [
  { label: "Population Increase", value: "Population Increase" },
  { label: "Increased Tourism", value: "Increased Tourism" },
  { label: "Improved Transportation", value: "Improved Transportation" },

  { label: "New Shops", value: "New Shops" },

  {
    label: "New Real Estate Development",
    value: "New Real Estate Development",
  },

  { label: "Urban Renovation", value: "Urban Renovation" },

  { label: "Pedestrian Zone Creation", value: "Pedestrian Zone Creation" },
];

const unfavorableArr = [
  { label: "Increased Unemployment", value: "Increased Unemployment" },
  { label: "Insecurity", value: "Insecurity" },
  { label: "Area Desertification", value: "Area Desertification" },
  { label: "Closures of Businesses", value: "Closures of Businesses" },
  {
    label: "Redevelopment (Diverting Traffic)",
    value: "Redevelopment (Diverting Traffic)",
  },
];

const options = [
  { label: "Outside Last Lease Period ", value: "Outside Last Lease Period " },
  { label: "During Last Lease", value: "During Last Lease" },
];

const schema = z.object({
  notableDate: z
    .string({
      required_error: "Please select the date of notable modifications",
      invalid_type_error: "Please select the date of notable modifications",
    })
    .min(1, "Please select the date of notable modifications"),
});

const RentAdjustment = ({
  data,
  hide,
}: {
  data: Judicial | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const [value, setValue] = React.useState("yes");
  const [factor, setFactor] = React.useState("sell_pr");
  const factorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFactor((event.target as HTMLInputElement).value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [reasonsForRent, setReasonsForRent] = React.useState<string[]>([]);

  const handleRent = (label: number) => {
    setReasonsForRent((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.reasonErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const [favorableFactors, setFavorableFactors] = React.useState<string[]>([]);

  const handleFavorable = (label: number) => {
    setFavorableFactors((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.favorErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const [unfavorableFactors, setUnFavorableFactors] = React.useState<string[]>(
    []
  );

  const handleUnFavorable = (label: number) => {
    setUnFavorableFactors((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.unfavorErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const [errors, setErrors] = useState({
    reasonErr: false,
    favorErr: false,
    unfavorErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (reasonsForRent.length == 0) {
      isError = true;
      errorObj = { ...errorObj, reasonErr: true };
    }

    if (reasonsForRent.includes("Favorable") && favorableFactors.length == 0) {
      isError = true;
      errorObj = { ...errorObj, favorErr: true };
    }

    if (
      reasonsForRent.includes("Unfavorable") &&
      unfavorableFactors.length == 0
    ) {
      isError = true;
      errorObj = { ...errorObj, unfavorErr: true };
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
      // const payload:any = {
      //   caseId: caseId,
      //   ...values,
      //   reasonsForRent,
      //   favorableFactors,
      //   unfavorableFactors,
      //   progress: 90,
      //   nextProgress: 90,
      // }

      if (hide) {
        payload = {
          caseId: caseId,
          ...values,
          reasonsForRent,
          favorableFactors,
          unfavorableFactors,
        };
      } else {
        payload = {
          caseId: caseId,
          ...values,
          reasonsForRent,
          favorableFactors,
          unfavorableFactors,
          progress: 90,
          nextProgress: 90,
        };
      }

      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        payload
      );

      if (!hide) {
        let id = data.data.caseId;
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "90");
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

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        {
          caseId: caseId,
          progress: 70,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");
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
    setValues({
      notableDate: data?.notableDate,
    });

    setReasonsForRent(data?.reasonsForRent ?? []);
    setFavorableFactors(data?.favorableFactors ?? []);
    setUnFavorableFactors(data?.unfavorableFactors ?? []);
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> 
        Factors Influencing Rent Adjustment
      </h6>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="radio-end-input two-cols mb-3">
                <label className="d-block">Reasons for Rent De-Capping</label>

                <FormGroup>
                  {rentArr.map((i: any, index: number) => {
                    return (
                      <FormControlLabel
                        key={index}
                        className="radio-light-ip"
                        disabled={hide}
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleRent(i.value)}
                        checked={reasonsForRent.includes(i.value) ?? false}
                      />
                    );
                  })}
                </FormGroup>
                {errors.reasonErr && (
                  <span className="text-danger">
                    Please select the reasons for rent de-capping
                  </span>
                )}
              </div>
            </div>
            {reasonsForRent.includes("Favorable") && (
              <div className="col-12 col-md-12 mb-4">
                <div className="radio-end-input two-cols mb-3">
                  <label className="d-block">If New Favorable Factors</label>
                  <FormGroup>
                    {favorableArr.map((i: any, index: number) => {
                      return (
                        <FormControlLabel
                          key={index}
                          disabled={hide}
                          className="radio-light-ip"
                          control={<Checkbox />}
                          label={i.label}
                          onChange={() => handleFavorable(i.value)}
                          checked={favorableFactors.includes(i.value) ?? false}
                        />
                      );
                    })}
                  </FormGroup>
                  {errors.favorErr && (
                    <span className="text-danger">
                      Please select the new favorable factor
                    </span>
                  )}
                </div>
              </div>
            )}
            {reasonsForRent.includes("Unfavorable") && (
              <div className="col-12 col-md-12 mb-4">
                <div className="radio-end-input two-cols mb-3">
                  <label className="d-block">If New Unfavorable Factors</label>
                  <FormGroup>
                    {unfavorableArr.map((i: any, index: number) => {
                      return (
                        <FormControlLabel
                          key={index}
                          disabled={hide}
                          className="radio-light-ip"
                          control={<Checkbox />}
                          label={i.label}
                          onChange={() => handleUnFavorable(i.value)}
                          checked={
                            unfavorableFactors.includes(i.value) ?? false
                          }
                        />
                      );
                    })}
                  </FormGroup>
                  {errors.unfavorErr && (
                    <span className="text-danger">
                      Please select the new unfavorable factor
                    </span>
                  )}
                </div>
              </div>
            )}
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input md-3">
                <label className="d-block">Date of Notable Modifications</label>
                <SelectField
                  options={options}
                  label=""
                  name="notableDate"
                  className="bglight-select"
                  disabled={hide}
                  error={formState.errors["notableDate"]}
                  control={control}
                />
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

export default RentAdjustment;
