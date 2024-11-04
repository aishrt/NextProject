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
import DateField from "@/components/Form/DateField";
import axios from "axios";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Judicial } from "@/types/Judicial";

type FormValues = {
  primaryNature: string;
  typeOfSurface: string;
  mainArea: string;
  floorArea: string;
  weightedArea: string;
  floorsOccupied: string;
  buildingNature: string;
  otherBuilding: string;
  accessibility: string;
  facade: string;
  currentState: string;
  specificEquipment: string;
};

const options = [
  { label: "Office", value: "Office" },
  { label: "Retail Store", value: "Retail Store" },
  { label: "Workshop", value: "Workshop" },
  { label: "Warehouse ", value: "Warehouse" },
  { label: "Other", value: "other" },
];
const surfaceArr = [
  { label: "Sales area", value: "Sales area" },
  { label: "Restaurant", value: "Restaurant" },
  { label: "Reception", value: "Reception" },
  { label: "Stock ", value: "Stock" },
  { label: "Storage", value: "Storage" },
  { label: "Offices", value: "Offices" },
  { label: "Annexes", value: "Annexes" },
  { label: "Other", value: "other" },
];
const floors = [
  { label: "Basement levels", value: "Basement levels" },
  { label: "Ground", value: "Ground" },
  { label: "Mezzanine ", value: "Mezzanine" },
  { label: "Upper floors", value: "Upper floors" },
];
const frontage = [
  { label: "Modest ", value: "Modest" },
  { label: "Average ", value: "Average" },
  { label: "Extended ", value: "Extended" },
];
const state = [
  { label: "Loss of Object ", value: "Loss of Object" },
  { label: "To Renovate  ", value: "To Renovate" },
  { label: "Dilapidated  ", value: "Dilapidated" },
  { label: "Normal", value: "Normal" },
  { label: "Recent", value: "Recent" },
  { label: "New", value: "New" },
];
const street = [
  { label: "Indirect", value: "Indirect" },
  { label: "Direct (no storefront)", value: "Direct (no storefront)" },
  { label: "Direct (with storefront) ", value: "Direct (with storefront)" },
];
const equipment = [
  { label: "None", value: "none" },
  { label: "Non-Movable", value: "Non-Movable" },
  { label: "Movable", value: "Movable" },
];
const buildingArr = [
  { label: "None", value: "None" },
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Offices", value: "Offices" },
  { label: "Other", value: "other" },
];

const schema = z.object({
  primaryNature: z
    .string({
      required_error: "Please select the primary nature",
      invalid_type_error: "Please select the primary nature",
    })
    .min(1, "Please select the primary nature"),
  typeOfSurface: z
    .string({
      required_error: "Please select the type of surface",
      invalid_type_error: "Please select the type of surface",
    })
    .min(1, "Please select the type of surface"),

  mainArea: z.string().optional(),
  floorArea: z.string().optional(),
  weightedArea: z.string().optional(),
  floorsOccupied: z.string().optional(),
  buildingNature: z.string({ invalid_type_error: "" }).optional(),
  otherBuilding: z.string().optional(),
  accessibility: z.string().optional(),
  facade: z.string().optional(),
  currentState: z.string().optional(),
  specificEquipment: z.string().optional(),
});

const PremisesCharacteristics = ({
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
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();
  const [primary, setPrimary] = useState("");
  const [building, setBuilding] = useState("");
  const [surface, setSurface] = useState("");
  const [otherNature, setOtherNature] = useState("");
  const [otherSurface, setOtherSurface] = useState("");

  const [errors, setErrors] = useState({
    otherErr: false,
    surfaceErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (primary == "other" && !otherNature) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }
    if (surface == "other" && !otherSurface) {
      isError = true;
      errorObj = { ...errorObj, surfaceErr: true };
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
          otherNature,
          otherSurface,
        }
      } else {
        payload = {
          caseId: caseId,
          ...values,
          otherNature,
          otherSurface,
          progress: 50,
          nextProgress: 50,
        }
      }

      const { data } = await axios.post("/api/client/category/judicial/createJudicial", payload);

      if (!hide) {
        let id = data.data.caseId;
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "50");
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
    setValues({
      primaryNature: "",
      typeOfSurface: "",
      mainArea: "",
      floorArea: "",
      weightedArea: "",
      floorsOccupied: "",
      buildingNature: "",
      otherBuilding: "",
      accessibility: "",
      facade: "",
      currentState: "",
      specificEquipment: "",
    });
    setOtherNature("");
    setOtherSurface("");
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        {
          caseId: caseId,
          progress: 30,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
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
      primaryNature: data?.primaryNature ?? "",
      typeOfSurface: data?.typeOfSurface ?? "",
      mainArea: data?.mainArea?.toString() ?? "",
      floorArea: data?.floorArea?.toString() ?? "",
      weightedArea: data?.weightedArea?.toString() ?? "",
      floorsOccupied: data?.floorsOccupied ?? "",
      buildingNature: data?.buildingNature ?? "",
      otherBuilding: data?.otherBuilding ?? "",
      accessibility: data?.accessibility ?? "",
      facade: data?.facade ?? "",
      currentState: data?.currentState ?? "",
      specificEquipment: data?.specificEquipment ?? "",
    });
    setPrimary(data?.primaryNature ?? "");
    setBuilding(data?.buildingNature ?? "");
    setSurface(data?.typeOfSurface ?? "");
    setOtherNature(data?.otherNature ?? "");
    setOtherSurface(data?.otherSurface ?? "");
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
       <h6 className="f-26  fw-400 pb-3"> Premises Characteristics</h6>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Primary Nature</label>
                <SelectField
                  options={options}
                  label=""
                  name="primaryNature"
                  className="bglight-select"
                  error={formState.errors["primaryNature"]}
                  control={control}
                  disabled={hide}
                  emitChange={(val: any) => setPrimary(val)}
                />
              </div>
              {primary == "other" && (
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    disabled={hide}
                    label="Other"
                    variant="filled"
                    value={otherNature}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOtherNature(event.target.value);
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
                <label className="d-block">Type of Surface</label>
                <SelectField
                disabled={hide}
                  options={surfaceArr}
                  label=""
                  name="typeOfSurface"
                  className="bglight-select"
                  error={formState.errors["typeOfSurface"]}
                  control={control}
                  emitChange={(val: any) => setSurface(val)}
                />
              </div>
              {surface == "other" && (
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Other"
                    variant="filled"
                    disabled={hide}
                    value={otherSurface}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOtherSurface(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.surfaceErr = false;
                        return newErrorObj;
                      });
                    }}
                  />
                  {errors.surfaceErr && (
                    <div>
                      <span className="text-danger">
                        Please describe the other statement
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <h3 className="f-18 fw-500 my-4 ">
            Optional Details (Provide if known):
          </h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Main Area (sqm)
                </label>
                <InputField
                  type="number"
                  error={formState.errors["mainArea"]}
                  label=""
                  name="mainArea"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                  disabled={hide}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Ground Floor Area (sqm)
                </label>
                <InputField
                  type="number"
                  error={formState.errors["floorArea"]}
                  label=""
                  name="floorArea"
                  variant="filled"
                  disabled={hide}
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Weighted Area (sqm)
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This is the area of the premises adjusted for factors like
                    floor level and visibility.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["weightedArea"]}
                  disabled={hide}
                  label=""
                  name="weightedArea"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Floors Occupied</label>
                <SelectField
                  options={floors}
                  disabled={hide}
                  label=""
                  name="floorsOccupied"
                  className="bglight-select"
                  error={formState.errors["floorsOccupied"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">
                  Nature of Other Lots in Building
                </label>
                <SelectField
                  options={buildingArr}
                  label=""
                  name="buildingNature"
                  className="bglight-select"
                  disabled={hide}
                  error={formState.errors["buildingNature"]}
                  control={control}
                  emitChange={(val: any) => setBuilding(val)}
                />
              </div>
              {building == "other" && (
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">Other</label>
                  <InputField
                    error={formState.errors["otherBuilding"]}
                    label="Others"
                    name="otherBuilding"
                    disabled={hide}
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              )}
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Accessibility from Street</label>
                <SelectField
                disabled={hide}
                  options={street}
                  label=""
                  name="accessibility"
                  className="bglight-select"
                  error={formState.errors["accessibility"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Facade Frontage</label>
                <SelectField
                  options={frontage}
                  label=""
                  disabled={hide}
                  name="facade"
                  className="bglight-select"
                  error={formState.errors["facade"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Current State</label>
                <SelectField
                  options={state}
                  disabled={hide}
                  label=""
                  name="currentState"
                  className="bglight-select"
                  error={formState.errors["currentState"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Specific Equipment</label>
                <SelectField
                  options={equipment}
                  label=""
                  name="specificEquipment"
                  className="bglight-select"
                  error={formState.errors["specificEquipment"]}
                  disabled={hide}
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

export default PremisesCharacteristics;
