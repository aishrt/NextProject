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
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Eviction } from "@/types/Eviction";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

type FormValues = {
  premisesNature: string;
  premisesArea: string;
  groundSurface: string;
  weightedArea: string;
  premisesLocated: string;
  otherLotsNature: string;
  premisesAccess: string;
};

const options = [
  { label: "Offices", value: "Offices" },
  { label: "Shop", value: "Shop" },
  { label: "Workshop", value: "Workshop" },
  { label: "Restaurant", value: "Restaurant" },
  { label: "Hotel", value: "Hotel" },
  { label: "Warehouse", value: "Warehouse" },
  { label: "Other", value: "Other" },
  { label: "Do not know", value: "Do not know" },
];

const premisesArr = [
  { label: "Basement", value: "Basement" },
  { label: "Ground floor", value: "Ground floor" },
  { label: "Floors", value: "Floors" },
  { label: "Do not know", value: "Do not know" },
];

const subletArr = [
  { label: "Residential", value: "Residential" },
  { label: "Commercial", value: "Commercial" },
  { label: "Offices", value: "Offices" },
  { label: "Do not know", value: "Do not know" },
];

const clientArr = [
  { label: "Indirect access", value: "Indirect access" },
  {
    label: "Direct access without storefront",
    value: "Direct access without storefront",
  },
  {
    label: "Direct access with storefront",
    value: "Direct access with storefront",
  },
  { label: "Do not know", value: "Do not know" },
];

const Premises = ({
  data,
  hide,
}: {
  data: Eviction | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    premisesNature: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the nature of the premises"
    ),

    premisesArea: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Area is required"
    ),

    groundSurface: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Ground surface area is required"
    ),
    weightedArea: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Weighted area is required"
    ),

    premisesLocated: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select premises located"
    ),

    otherLotsNature: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the nature of other lots in the building"
    ),

    premisesAccess: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the premises from the street"
    ),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);

  const { formState, control } = methods;

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      let payload: any = {
        caseId: caseId,
        ...values,
      };

      if (!hide) {
        payload = { ...payload, progress: 60, nextProgress: 60 };
      }
      const { data } = await axios.post(
        "/api/client/category/eviction/createEviction",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");
        router.push(
          `/client/eviction-assessment-form?${searchParam.toString()}`
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
        "/api/client/category/eviction/createEviction",
        {
          caseId: caseId,
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
      router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      premisesNature: data?.premisesNature,
      premisesArea: data?.premisesArea?.toString(),
      groundSurface: data?.groundSurface?.toString(),
      weightedArea: data?.weightedArea?.toString(),
      premisesLocated: data?.premisesLocated,
      otherLotsNature: data?.otherLotsNature,
      premisesAccess: data?.premisesAccess,
    });
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Premises Characteristics</h6>
      <div>
        <h2 className="f-15 fw-500">
          Details about the premises you rent are essential for assessing
          compensation.
        </h2>
      </div>

      {loading ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <>
          <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
            <div className="row mt-5">
              <div className="col-12 col-md-12 mb-3">
                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>Main nature of your premises</label>
                      <SelectField
                        options={options}
                        label=""
                        name="premisesNature"
                        disabled={hide}
                        className="bglight-select"
                        error={formState.errors["premisesNature"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="relative f-18 fw-500">
                        Area of your premises in square meters: (Main area)
                      </label>
                      <InputField
                        type="number"
                        disabled={hide}
                        error={formState.errors["premisesArea"]}
                        label="Main Area"
                        name="premisesArea"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="relative  f-18 fw-500">
                        Area of your premises in square meters: (Ground surface)
                      </label>
                      <InputField
                        type="number"
                        error={formState.errors["groundSurface"]}
                        label="Ground surface"
                        name="groundSurface"
                        disabled={hide}
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className=" f-18 fw-500 relative">
                        Area of your premises in square meters: (Weighted area)
                      </label>
                      <InputField
                        type="number"
                        disabled={hide}
                        error={formState.errors["weightedArea"]}
                        label="Weighted area"
                        name="weightedArea"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="my-3">
                        At which floor(s) are your premises located (including annexes)?
                      </label>
                      <SelectField
                        options={premisesArr}
                        label=""
                        name="premisesLocated"
                        className="bglight-select"
                        error={formState.errors["premisesLocated"]}
                        disabled={hide}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="my-3">
                        Nature of other lots in the building
                      </label>
                      <SelectField
                        options={subletArr}
                        disabled={hide}
                        label=""
                        name="otherLotsNature"
                        className="bglight-select"
                        error={formState.errors["otherLotsNature"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="my-3">
                        How do your clients access the premises from the street?{" "}
                      </label>
                      <SelectField
                        options={clientArr}
                        label=""
                        name="premisesAccess"
                        disabled={hide}
                        className="bglight-select"
                        error={formState.errors["premisesAccess"]}
                        control={control}
                      />
                    </div>
                  </div>
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
                  className={`client-btn eviction-submit-btn ${
                    hide ? "d-none" : "block"
                  }`}
                  size="lg"
                >
                  <span className="f-16">Next</span>
                </Button>
              </div>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default Premises;
