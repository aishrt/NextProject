"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import axios from "axios";
import { Judicial } from "@/types/Judicial";
import { MaterialSelectField } from "@/components/Form/MaterialSelectField";

type FormValues = {};

const options = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Medium" },
  { label: "High", value: "High" },
];
const quality = [
  { label: "Lower", value: "Lower" },
  { label: "Equivalent", value: "Equivalent" },
  { label: "Higher", value: "Higher" },
];
const valuation = [
  {
    label: "Lease renewal with judicial rent setting",
    value: "Lease renewal with judicial rent setting",
  },
  {
    label: "New lease with judicial rent setting",
    value: "New lease with judicial rent setting",
  },
  {
    label: "New lease with amicable rent setting",
    value: "New lease with amicable rent setting",
  },
];
const transport = [
  { label: "Poor", value: "Poor" },
  { label: "Medium", value: "Medium" },
  { label: "Good", value: "Good" },
];

const schema = z.object({
  rental: z.number().optional(),
  similarity: z.string({ invalid_type_error: "" }).optional(),
  premisesQuality: z.string({ invalid_type_error: "" }).optional(),
  valuation: z.string({ invalid_type_error: "" }).optional(),
  area: z.number().optional(),
  price: z.number().optional(),
});

interface IProps {
  data: Judicial | undefined;
}

type PremisesValues = {
  similarityActivity: string;
  premisesQuality: string;
  valuationSource: string;
  weightedArea: number | undefined;
  price: number | undefined;
};

type PremisesErrors = {
  similarityActivity: string;
  premisesQuality: string;
  valuationSource: string;
  weightedArea: string;
  price: string;
};

const PremisesExpertise = ({
  data,
  hide,
  setData,
}: {
  data: Judicial | undefined | null;
  hide: boolean;
  setData?: any;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);
  const [noOfPremises, setPremises] = useState<number | undefined>();
  const [premisesErr, setPremisesErr] = useState<string>("");
  const [premisesData, setPremisesData] = useState<PremisesValues[]>([
    {
      similarityActivity: "",
      premisesQuality: "",
      valuationSource: "",
      weightedArea: undefined,
      price: undefined,
    },
  ]);

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const [value, setValue] = React.useState("yes");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [interest, setInterest] = React.useState("yes");
  const interestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInterest((event.target as HTMLInputElement).value);
  };

  const [errors, setErrors] = useState<PremisesErrors[]>([
    {
      similarityActivity: "",
      premisesQuality: "",
      valuationSource: "",
      weightedArea: "",
      price: "",
    },
  ]);

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      console.log({ ...values });
      console.log(caseId);

      console.log(premisesData);

      setLoading(true);
      if (checkNumberValidation(noOfPremises)) return;

      // if (errHandle()) {
      //   return;
      // }
      let payload: any = {
        caseId: caseId,
        rental: noOfPremises,
        premises: premisesData,

        // nextProgress: 80,
        //  progress:  80,
      };
      console.log(payload);

      if (!hide) {
        payload = { ...payload, nextProgress: 80, progress: 80 };
      }
      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        payload
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "80");

      if (!hide) {
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
          progress: 60,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(
        `/client/judicial-determination-of-rent?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleNumberChange = (
    index: number,
    val: string | number,
    field: keyof PremisesValues
  ) => {
    setPremisesData((prev) => {
      let newPremises: any = [...prev];
      if (newPremises[index]) {
        newPremises[index][field] = val;
      }
      return newPremises;
    });

    setErrors((prev) => {
      let prevErrs = [...prev];
      if (prevErrs[index]) {
        prevErrs[index][field] = "";
      }
      return prevErrs;
    });
  };

  const handleChangeValue = (val: string) => {
    const newValue = options.find((i) => i.value === val);
    console.log(newValue);

    return newValue;
  };

  const handleQualityValue = (val: string) => {
    const newValue = quality.find((i) => i.value === val);
    return newValue;
  };

  const handleSourceValue = (val: string) => {
    const newValue = valuation.find((i) => i.value === val);
    return newValue;
  };

  const checkNumberValidation = (val: number | undefined) => {
    console.log(val, "val");
    let isErr = false;
    let errorTxt = "";

    // if (!val) {
    //   isErr = true;
    //   errorTxt = "No of Premises is required";
    // }
    // if (val != undefined && val <= 0) {
    //   isErr = true;
    //   errorTxt = "No of Premises cannot be less than 1";
    // }
    // if (val != undefined && val > 3) {
    //   isErr = true;
    //   errorTxt = "No of Premises cannot be more than 3";
    // }

    if (val && val <= 0) {
      isErr = true;
      errorTxt = "No of Premises cannot be less than 1";
    }

    if (isErr) {
      setPremisesErr(errorTxt);
    }
    return isErr;
  };

  const checkValidations = () => {
    let premisesItms = [...premisesData];
    let errObj = [...errors];
    let isError = false;
    premisesData.forEach((item, index) => {
      let initialItm = premisesItms[index];
      if (!initialItm.premisesQuality) {
        isError = true;
        errObj[index].premisesQuality = "Please select quality of premises";
      }
      if (!initialItm.similarityActivity) {
        isError = true;
        errObj[index].similarityActivity =
          "Please select similarity of activity";
      }
      if (!initialItm.valuationSource) {
        isError = true;
        errObj[index].valuationSource = "Please select source of valuation";
      }
      if (!initialItm.price) {
        isError = true;
        errObj[index].price = "Please enter price per square meter";
      }
      if (!initialItm.weightedArea) {
        isError = true;
        errObj[index].weightedArea =
          "Please enter weighted area in square meter";
      }
      if (isError) {
        setErrors(errObj);
      }
    });
    return isError;
  };

  const handleAddPremises = () => {
    // if (checkNumberValidation(noOfPremises)) return;
    if (checkValidations()) return;
    let newData = [...premisesData];
    let newErrors = [...errors];
    if (premisesData.length < 3) {
      newData.push({
        similarityActivity: "",
        premisesQuality: "",
        valuationSource: "",
        weightedArea: undefined,
        price: undefined,
      });
      newErrors.push({
        similarityActivity: "",
        premisesQuality: "",
        valuationSource: "",
        weightedArea: "",
        price: "",
      });
      setPremisesData(newData);
      setErrors(newErrors);
    }
  };

  useEffect(() => {
    setPremises(data?.rental);
    setPremisesData(data?.premises ?? []);

    console.log(data?.premises);
  }, [data]);

  useEffect(() => {
    console.log(premisesData);
  }, [premisesData]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> 
        Nearby Premises Expertise (Optional)
      </h6>
      <p className="f-15 fw-500 pb-3">
        {`The following questions help us understand rental trends in your area.
        Your answers here will strengthen our evaluation. However, if you don't
        have this information readily available, you can skip this section.`}
      </p>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Number of Premises Assessed in Neighborhood Rental Study
                </label>
                <TextField
                  type="number"
                  sx={{ width: "100%" }}
                  value={noOfPremises}
                  className="bglight-ip p-0"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    let val = Number(event.target.value);
                    // if (val == 0) {
                    //   setPremises(undefined);
                    // } else {
                    setPremises(val);
                    // }
                    setPremisesErr("");
                  }}
                />
                {premisesErr && (
                  <span className="text-danger f-14">{premisesErr}</span>
                )}
              </div>
            </div>
          </div>
          <h3 className="f-18 fw-500 mt-4">
            Details for Nearby Premises (If Applicable):
          </h3>
          <p className="f-15">
            You can provide details for up to 3 comparable premises.
          </p>
          {premisesData.map((i, index) => {
            return (
              <div key={index}>
                <h3 className="f-18 fw-500 mt-4 ">Premises {index + 1}</h3>
                <div className="row mt-3">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="d-block">Similarity of Activity</label>
                      <MaterialSelectField
                        options={options}
                        className="bglight-select"
                        changeValue={handleChangeValue(i.similarityActivity)}
                        setChangeValue={(inputVal: any) =>
                          handleNumberChange(
                            index,
                            inputVal?.value,
                            "similarityActivity"
                          )
                        }
                      />
                    </div>
                    {errors[index] && (
                      <span className="text-danger f-14">
                        {errors[index].similarityActivity}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="d-block">Quality of Premises</label>
                      <MaterialSelectField
                        options={quality}
                        className="bglight-select"
                        changeValue={handleQualityValue(i.premisesQuality)}
                        setChangeValue={(inputVal: any) =>
                          handleNumberChange(
                            index,
                            inputVal?.value,
                            "premisesQuality"
                          )
                        }
                      />
                    </div>
                    {errors[index] && (
                      <span className="text-danger f-14">
                        {errors[index].premisesQuality}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="d-block">Source of Valuation</label>
                      <MaterialSelectField
                        options={valuation}
                        className="bglight-select"
                        changeValue={handleSourceValue(i.valuationSource)}
                        setChangeValue={(inputVal: any) =>
                          handleNumberChange(
                            index,
                            inputVal?.value,
                            "valuationSource"
                          )
                        }
                      />
                    </div>
                    {errors[index] && (
                      <span className="text-danger f-14">
                        {errors[index].valuationSource}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="tooltip-title relative">
                        Weighted Area (sqm)
                      </label>
                      <TextField
                        type="number"
                        sx={{ width: "100%" }}
                        value={i.weightedArea}
                        className="bglight-ip"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          handleNumberChange(
                            index,
                            Number(event.target.value),
                            "weightedArea"
                          );
                        }}
                      />
                    </div>
                    {errors[index] && (
                      <span className="text-danger f-14">
                        {errors[index].weightedArea}
                      </span>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="tooltip-title relative">
                        Price per Square Meter (€)
                      </label>
                      <TextField
                        type="number"
                        sx={{ width: "100%" }}
                        value={i.price}
                        className="bglight-ip"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          handleNumberChange(
                            index,
                            Number(event.target.value),
                            "price"
                          );
                        }}
                      />
                    </div>
                    {errors[index] && (
                      <span className="text-danger f-14">
                        {errors[index].price}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="text-end">
            <Button
              variant="contained"
              size="sm"
              className="client-btn"
              onClick={handleAddPremises}
              disabled={premisesData.length === 3}
            >
              Add another premises
            </Button>
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
                // onClick={() => errHandle()}
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

export default PremisesExpertise;
