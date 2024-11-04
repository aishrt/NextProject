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
  reputation: string;
  employeesNumber: string;
  operationPeriod: string;
  weeklyOpening: string;
  profitability: string;
  clientTraffic: string;
  inventoryNature: string;
  inventoryValue: string;
  businessStrength: string;
  describeStrength: string;
  businessWeakness: string;
  describeWeakness: string;
  businessRetain: string;
};

const options = [
  { label: "Independent", value: "Independent" },
  { label: "Local Chain", value: "Local Chain" },
  { label: "National Chain", value: "National Chain" },
];

const periodArr = [
  { label: "Year-round activity", value: "Year-round activity" },
  { label: "Seasonal activity", value: "Seasonal activity" },
];

const rangeArr = [
  { label: "1-3 days", value: "1-3 days" },
  { label: "4-5 Days", value: "4-5 days" },
  { label: "6 days", value: "6 days" },
  { label: "7 days", value: "7 days" },
];
const rateArr = [
  { label: "Low", value: "Low" },
  { label: "Average", value: "Average" },
  { label: "High ", value: "High" },
  { label: "Extraordinary", value: "Extraordinary" },
  { label: "Do not know", value: "Do not know" },
];

const trafficArr = [
  { label: "Direct sales and/or service", value: "Direct sales" },
  { label: "Takeaway", value: "Takeaway" },
  { label: "Delivery ", value: "Delivery" },
];

const natureArr = [
  { label: "Perishable", value: "Perishable" },
  { label: "Non-perishable", value: "Non-perishable" },
  { label: "Transformable", value: "Transformable" },
  {
    label: "Possible supplier take-back",
    value: "Possible supplier take-back",
  },
  { label: "Seasonal", value: "Seasonal" },
  { label: "Do not know", value: "Do not know" },
];

const strengthArr = [
  { label: "None", value: "None" },
  { label: "Favorable location", value: "Favorable location" },
  { label: "Tax advantages", value: "Tax advantages" },
  { label: "Do not know", value: "Do not know" },
];

const weaknessArr = [
  { label: "None", value: "None" },
  { label: "Unfavorable location", value: "Unfavorable location" },
  { label: "Tax disadvantages", value: "Tax disadvantages" },
  { label: "Do not know", value: "Do not know" },
];

const retainArr = [
  { label: "Not retained", value: "Not retained" },
  { label: "Partially retained", value: "Partially retained" },
  { label: "Fully retained", value: "Fully retained" },
  { label: "Do not know", value: "Do not know" },
];

const BusinessCharacteristics = ({
  data,
  hide,
}: {
  data: Eviction | undefined | null;
  hide: boolean;
}) => {
  const [strength, setStrength] = useState("");
  const [weakness, setWeakness] = useState("");

  const schema = z.object({
    reputation: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the reputation"
    ),

    employeesNumber: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please enter the number of employees at the date of termination"
    ),

    operationPeriod: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the age of building"
    ),

    weeklyOpening: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the weekly opening range"
    ),
    profitability: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please rate your business profitability"
    ),

    clientTraffic: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the client traffic"
    ),

    inventoryNature: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select  nature of your inventory"
    ),

    inventoryValue: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please enter the total value of inventory in euros"
    ),

    businessStrength: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select your business strength"
    ),

    describeStrength:
      strength == "Favorable location" || strength == "Tax advantages"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please describe the business strength"
          )
        : z.string().optional(),

    businessWeakness: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select your business weakness"
    ),

    describeWeakness:
      weakness == "Unfavorable location" || weakness == "Tax disadvantages"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please describe the business strength"
          )
        : z.string().optional(),

    businessRetain: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select business retain"
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
        payload = { ...payload, progress: 100, nextProgress: 100 };
      }
      const { data } = await axios.post(
        "/api/client/category/eviction/createEviction",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "100");
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
          progress: 80,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "80");
      router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      reputation: data?.reputation,
      employeesNumber: data?.employeesNumber?.toString(),
      operationPeriod: data?.operationPeriod,
      weeklyOpening: data?.weeklyOpening,
      profitability: data?.profitability,
      clientTraffic: data?.clientTraffic,
      inventoryNature: data?.inventoryNature,
      inventoryValue: data?.inventoryValue?.toString(),
      businessStrength: data?.businessStrength,
      describeStrength: data?.describeStrength,
      businessWeakness: data?.businessWeakness,
      describeWeakness: data?.describeWeakness,
      businessRetain: data?.businessRetain,
    });
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Business Characteristics</h6>
      <div>
        <h2 className="f-15 fw-500">
          Let&apos;s now detail your business to understand its operation and
          value.
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
                      <label className="">Reputation</label>
                      <SelectField
                        options={options}
                        label=""
                        disabled={hide}
                        name="reputation"
                        className="bglight-select"
                        error={formState.errors["reputation"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="relative">
                        {" "}
                        Number of employees at the date of termination or
                        non-renewal notice.
                      </label>

                      <InputField
                        type="number"
                        disabled={hide}
                        error={formState.errors["employeesNumber"]}
                        label=""
                        name="employeesNumber"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>Business Operation Period</label>
                      <SelectField
                        options={periodArr}
                        disabled={hide}
                        label=""
                        name="operationPeriod"
                        className="bglight-select"
                        error={formState.errors["operationPeriod"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="tooltip-title relative">
                        Weekly Opening Range
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          Indicate the typical number of days your business is
                          open in a week.
                        </span>
                      </label>

                      <SelectField
                      disabled={hide}
                        options={rangeArr}
                        label=""
                        name="weeklyOpening"
                        className="bglight-select"
                        error={formState.errors["weeklyOpening"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>
                        How do you rate your business profitability?
                      </label>
                      <SelectField
                        options={rateArr}
                        label=""
                        disabled={hide}
                        name="profitability"
                        className="bglight-select"
                        error={formState.errors["profitability"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>Client Traffic</label>
                      <SelectField
                        options={trafficArr}
                        label=""
                        name="clientTraffic"
                        disabled={hide}
                        className="bglight-select"
                        error={formState.errors["clientTraffic"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>What is the nature of your inventory?</label>
                      <SelectField
                        options={natureArr}
                        label=""
                        disabled={hide}
                        name="inventoryNature"
                        className="bglight-select"
                        error={formState.errors["inventoryNature"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="relative">
                        What is the total value of your inventory in euros?{" "}
                      </label>
                      <InputField
                        type="number"
                        error={formState.errors["inventoryValue"]}
                        disabled={hide}
                        label=""
                        name="inventoryValue"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>What are your business strengths?</label>
                      <SelectField
                        options={strengthArr}
                        disabled={hide}
                        label=""
                        name="businessStrength"
                        className="bglight-select"
                        error={formState.errors["businessStrength"]}
                        control={control}
                        emitChange={(val: any) => setStrength(val)}
                      />
                    </div>
                  </div>

                  {(strength == "Favorable location" ||
                    strength == "Tax advantages") && (
                    <div className="col-12 col-md-6 mb-4">
                      <div className="lease-input">
                        <label className="relative">
                          Can you describe these strengths?
                        </label>
                        <InputField
                          error={formState.errors["describeStrength"]}
                          label=""
                          name="describeStrength"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                          disabled={hide}
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>What are your business weaknesses?</label>
                      <SelectField
                        options={weaknessArr}
                        label=""
                        name="businessWeakness"
                        className="bglight-select"
                        disabled={hide}
                        error={formState.errors["businessWeakness"]}
                        control={control}
                        emitChange={(val: any) => setWeakness(val)}
                      />
                    </div>
                  </div>

                  {(weakness == "Unfavorable location" ||
                    weakness == "Tax disadvantages") && (
                    <div className="col-12 col-md-6 mb-4">
                      <div className="lease-input">
                        <label className="relative">
                          Can you describe these weaknesses?
                        </label>
                        <InputField
                          error={formState.errors["describeWeakness"]}
                          label=""
                          name="describeWeakness"
                          disabled={hide}
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    </div>
                  )}

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>Does your business retain its clientele?</label>
                      <SelectField
                        options={retainArr}
                        label=""
                        name="businessRetain"
                        className="bglight-select"
                        disabled={hide}
                        error={formState.errors["businessRetain"]}
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

export default BusinessCharacteristics;
