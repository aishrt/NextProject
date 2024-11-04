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
} from "@mui/material";
import axios from "axios";
import { Judicial } from "@/types/Judicial";

type FormValues = {
  rental: number;
  similarity: string;
  premisesQuality: string;
  valuation: string;
  area: number;
  price: number;
};

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
const PremisesExpertise = ({
  data,
  hide,
  setData
}: {
  data: Judicial | undefined | null;
  hide: boolean;
  setData?: any
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const [interest, setInterest] = React.useState("yes");
  const interestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInterest((event.target as HTMLInputElement).value);
  };

  const [errors, setErrors] = useState({});

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

      setLoading(true);
      // if (errHandle()) {
      //   return;
      // }

      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        {
          caseId: caseId,
          ...values,
          nextProgress: hide ? 90 : 80,
          progress: hide ? 90 : 80,
        }
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

  useEffect(() => {
    setValues({
      rental: data?.rental,
      //   contractDuration: data?.data?.contractDuration?.toString(),
      //   initialRent: data?.data?.initialRent?.toString(),
      //   lastRent: data?.data?.lastRent?.toString(),
    });
    // setValue(data?.data?.silentRenewal ?? "");
    // setRenewalNumber(data?.data?.renewalNumber?.toString() ?? "");
    // setRenewalDate(dayjs(data?.data?.renewalDate));
    // setlastRent(data?.data?.lastRentNature ?? "");
  }, [data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold my-4 gray">
        Nearby Premises Expertise (Optional)
      </h3>
      <p className="f-15 pb-3">
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
                <NumberField
                  error={formState.errors["rental"]}
                  label="Number of Premises Assessed"
                  name="rental"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
          </div>
          <h3 className="f-18 bold mt-4 gray">
            Details for Nearby Premises (If Applicable):
          </h3>
          <p className="f-15">
            You can provide details for up to 3 comparable premises.
          </p>

          {
            <>
              <h3 className="f-18 bold mt-4 gray">Premises 1</h3>
              <div className="row mt-3">
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="d-block">Similarity of Activity</label>
                    <SelectField
                      options={options}
                      label=""
                      name="similarity"
                      className="bglight-select"
                      error={formState.errors["similarity"]}
                      control={control}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="d-block">Quality of Premises</label>
                    <SelectField
                      options={quality}
                      label=""
                      name="premisesQuality"
                      className="bglight-select"
                      error={formState.errors["premisesQuality"]}
                      control={control}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="d-block">Source of Valuation</label>
                    <SelectField
                      options={valuation}
                      label=""
                      name="valuation"
                      className="bglight-select"
                      error={formState.errors["valuation"]}
                      control={control}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      Weighted Area (sqm)
                    </label>
                    <NumberField
                      error={formState.errors["area"]}
                      label="Weighted Area (sqm)"
                      name="area"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      Price per Square Meter (€)
                    </label>
                    <NumberField
                      error={formState.errors["price"]}
                      label="Price per Square Meter (€)"
                      name="price"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
              </div>
            </>
          }
          {/* <h3 className="f-18 bold my-4 gray">Premises 2</h3>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="d-block">Similarity of Activity</label>
              <SelectField
                options={options}
                label=""
                name="similarity"
                className="bglight-select"
                error={formState.errors["similarity"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="d-block">Quality of Premises</label>
              <SelectField
                options={quality}
                label=""
                name="premisesQuality"
                className="bglight-select"
                error={formState.errors["premisesQuality"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="d-block">Source of Valuation</label>
              <SelectField
                options={valuation}
                label=""
                name="valuation"
                className="bglight-select"
                error={formState.errors["valuation"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="tooltip-title relative">
                Weighted Area (sqm)
              </label>
              <NumberField
                error={formState.errors["area"]}
                label="Weighted Area (sqm)"
                name="area"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="tooltip-title relative">
                Price per Square Meter (€)
              </label>
              <NumberField
                error={formState.errors["price"]}
                label="Price per Square Meter (€)"
                name="price"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
        </div>
        <h3 className="f-18 bold my-4 gray">Premises 3</h3>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="d-block">Similarity of Activity</label>
              <SelectField
                options={options}
                label=""
                name="premisesQuality"
                className="bglight-select"
                error={formState.errors["premisesQuality"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="d-block">Quality of Premises</label>
              <SelectField
                options={quality}
                label=""
                name="premisesQuality"
                className="bglight-select"
                error={formState.errors["premisesQuality"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="d-block">Source of Valuation</label>
              <SelectField
                options={valuation}
                label=""
                name="valuation"
                className="bglight-select"
                error={formState.errors["valuation"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="tooltip-title relative">
                Weighted Area (sqm)
              </label>
              <NumberField
                error={formState.errors["area"]}
                label="Weighted Area (sqm)"
                name="area"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-4">
              <label className="tooltip-title relative">
                Price per Square Meter (€)
              </label>
              <NumberField
                error={formState.errors["price"]}
                label="Price per Square Meter (€)"
                name="price"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
        </div> */}
          <div className="text-end">
            <Button variant="primary" size="sm" className="green-btn">
              Add another premises
            </Button>
          </div>

          <div className="col-12 text-center mt-4">
            <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
              <Button
                variant="outline"
                size="lg"
                className={`green-border f-16 ${hide ? "d-none" : "block"}`}
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                className={`green-btn submit-btn ${hide ? "d-none" : "block"}`}
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
