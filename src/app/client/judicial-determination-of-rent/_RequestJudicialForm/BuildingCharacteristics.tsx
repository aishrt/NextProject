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
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Judicial } from "@/types/Judicial";
import { CircularProgress } from "@mui/material";

type FormValues = {
  buildingType: string;
  buildingAge: string;
  floorNumber: string;
};

const options = [
  { label: "Standalone ", value: "Standalone " },
  { label: "Shopping Center", value: "Shopping Center" },
  { label: "Office Complex", value: "Office Complex" },
  { label: "Other (specify)", value: "other" },
];
const age = [
  { label: "New", value: "New" },
  { label: "Recent", value: "Recent" },
  { label: "Normal ", value: "Normal" },
  { label: "To Renovate", value: "To Renovate" },
  { label: "Dilapidated", value: "Dilapidated" },
];

const schema = z.object({
  buildingType: z
    .string({
      required_error: "Please select the building type",
      invalid_type_error: "Please selcet the building type",
    })
    .min(1, "Please selcet the building type"),
  buildingAge: z
    .string({ required_error: "Please selcet the building age" })
    .min(1, "Please select the building age"),
  floorNumber: z.string().optional(),
});

interface IProps {
  data: Judicial | undefined | null;
}

const BuildingCharacteristics = ({
  data,
  hide
}: {
  data: Judicial | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");
  const [building, setBuildingType] = useState("");
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [otherType, setOther] = useState("");

  const [errors, setErrors] = useState({
    otherErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (building == "other" && !otherType) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
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

      let payload = {}
      if (hide) {
        payload = {
          caseId: caseId,
          ...values,
          otherType,
        }
      }
      else {
        payload = {
          caseId: caseId,
          ...values,
          otherType,
          progress: 60,
          nextProgress: 60,
        }
      }

      const { data } = await axios.post("/api/client/category/judicial/createJudicial", payload);

      if (!hide) {
        let id = data.data.caseId;
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");
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
          progress: 40,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
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
      buildingType: data?.buildingType,
      buildingAge: data?.buildingAge,
      floorNumber: data?.floorNumber?.toString(),
    });
    setBuildingType(data?.buildingType ?? "");
    setOther(data?.otherType ?? "");
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Building Characteristics</h6>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Building Type</label>
                <SelectField
                  options={options}
                  label=""
                  name="buildingType"
                  className="bglight-select"
                  disabled={hide}
                  error={formState.errors["buildingType"]}
                  control={control}
                  emitChange={(val: any) => {
                    setBuildingType(val);
                  }}
                />
              </div>
              {building == "other" && (
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    disabled={hide}
                    label="Other"
                    variant="filled"
                    value={otherType}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOther(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.otherErr = false;
                        return newErrorObj;
                      });
                    }}
                  />
                  {errors.otherErr && (
                    <div>
                      <span className="text-danger">
                        Please describe the other statement
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Building Age</label>
                <SelectField
                  options={age}
                  label=""
                  name="buildingAge"
                  disabled={hide}
                  className="bglight-select"
                  error={formState.errors["buildingAge"]}
                  control={control}
                />
              </div>
            </div>
          </div>
          <h3 className="f-18 fw-500 my-4 ">Optional Details</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Number of Floors (if applicable)
                </label>
                <InputField
                  type="number"
                  error={formState.errors["floorNumber"]}
                  label=""
                  name="floorNumber"
                  disabled={hide}
                  variant="filled"
                  className="bglight-ip"
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

export default BuildingCharacteristics;
