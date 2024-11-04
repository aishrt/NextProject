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
  businessMethod: string;
  activities: string;
  annualRevenue: string;
  revenueTaxes: string;

  lessorPercentage: string;
  selfPercentage: string;
  expertPercentage: string;

  dailyReceipts: string;

  businessMargin: string;
  lessorMargin: string;
  proposeMargin: string;
  expertMargin: string;

  annualEBE: string;
  lessorEBE: string;
  proposeEBE: string;
  expertEBE: string;
};

const options = [
  { label: "Revenue", value: "Revenue" },
  { label: "Gross Operating Surplus (EBE)", value: "Gross Operating Surplus" },
  {
    label: "Average between Revenue and EBE",
    value: "Average between Revenue",
  },

  { label: "Gross Margin", value: "Gross Margin" },

  { label: "Daily Receipts", value: "Daily Receipts" },
];
const taxArr = [
  { label: "€ HT", value: "€ HT" },
  { label: "€ TTC", value: "€ TTC" },
  { label: "Do not know", value: "Do not know" },
];

const BusinessValuation = ({
  data,
  hide,
}: {
  data: Eviction | undefined | null;
  hide: boolean;
}) => {
  const [method, setMethod] = useState("");
  const schema = z.object({
    businessMethod: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the method you prefer to evaluate your business value"
    ),

    activities:
      method == "Revenue" || method == "Average between Revenue"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the number of employees at the date of termination"
          )
        : z.string().optional(),

    annualRevenue:
      method == "Revenue" || method == "Average between Revenue"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the average annual revenue of your business"
          )
        : z.string().optional(),

    revenueTaxes:
      method == "Revenue" || method == "Average between Revenue"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please select the age of building"
          )
        : z.string().optional(),

    lessorPercentage:
      method == "Revenue" || method == "Average between Revenue"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the percentage of valuation"
          )
        : z.string().optional(),
    selfPercentage:
      method == "Revenue" || method == "Average between Revenue"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the percentage of valuation"
          )
        : z.string().optional(),
    expertPercentage:
      method == "Revenue" || method == "Average between Revenue"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the percentage of valuation"
          )
        : z.string().optional(),

    annualEBE:
      method == "Gross Operating Surplus"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the  annual gross operating surplus"
          )
        : z.string().optional(),

    lessorEBE:
      method == "Gross Operating Surplus"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the  EBE valuation coefficient"
          )
        : z.string().optional(),

    proposeEBE:
      method == "Gross Operating Surplus"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the  EBE valuation coefficient"
          )
        : z.string().optional(),
    expertEBE:
      method == "Gross Operating Surplus"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the  EBE valuation coefficient"
          )
        : z.string().optional(),

    businessMargin:
      method == "Gross Margin"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the gross margin of your business"
          )
        : z.string().optional(),
    lessorMargin:
      method == "Gross Margin"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the gross margin of your business"
          )
        : z.string().optional(),
    proposeMargin:
      method == "Gross Margin"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the gross margin of your business"
          )
        : z.string().optional(),
    expertMargin:
      method == "Gross Margin"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter the gross margin of your business"
          )
        : z.string().optional(),

    dailyReceipts:
      method == "Daily Receipts"
        ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
            "Please enter your business daily receipts"
          )
        : z.string().optional(),
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
        payload = { ...payload, progress: 110, nextProgress: 110 };
      }
      const { data } = await axios.post(
        "/api/client/category/eviction/createEviction",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "110");
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
          progress: 90,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "90");
      router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      businessMethod: data?.businessMethod,
      activities: data?.activities?.toString(),
      annualRevenue: data?.annualRevenue?.toString(),
      revenueTaxes: data?.revenueTaxes,
      lessorPercentage: data?.lessorPercentage?.toString(),
      selfPercentage: data?.selfPercentage?.toString(),
      expertPercentage: data?.expertPercentage?.toString(),
      dailyReceipts: data?.dailyReceipts?.toString(),
      businessMargin: data?.businessMargin?.toString(),
      lessorMargin: data?.lessorMargin?.toString(),
      proposeMargin: data?.proposeMargin?.toString(),
      expertMargin: data?.expertMargin?.toString(),
      annualEBE: data?.annualEBE?.toString(),
      lessorEBE: data?.lessorEBE?.toString(),
      proposeEBE: data?.proposeEBE?.toString(),
      expertEBE: data?.expertEBE?.toString(),
    });
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Business Valuation</h6>
      <div>
        <h2 className="f-15 fw-500">
          To conclude, let&apos;s provide details on the financial valuation of
          your business.
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
                      <label className="my-3">
                        Which method do you prefer to evaluate your business
                        value?
                      </label>
                      <SelectField
                        options={options}
                        label=""
                        name="businessMethod"
                        className="bglight-select"
                        disabled={hide}
                        error={formState.errors["businessMethod"]}
                        control={control}
                        emitChange={(val: any) => setMethod(val)}
                      />
                    </div>
                  </div>

                  {(method == "Revenue" ||
                    method == "Average between Revenue") && (
                    <>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input ">
                          <label className="relative my-3">
                            How many activities does your business conduct?
                          </label>

                          <InputField
                            type="number"
                            disabled={hide}
                            error={formState.errors["activities"]}
                            label=""
                            name="activities"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What is the average annual revenue of your business
                            over the last three years?{" "}
                          </label>

                          <InputField
                          disabled={hide}
                            type="number"
                            error={formState.errors["annualRevenue"]}
                            label=""
                            name="annualRevenue"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="">
                            Is your revenue excluding or including taxes?
                          </label>
                          <SelectField
                            options={taxArr}
                            label=""
                            name="revenueTaxes"
                            disabled={hide}
                            className="bglight-select"
                            error={formState.errors["revenueTaxes"]}
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What percentage of valuation does the lessor propose
                            for your business?
                          </label>

                          <InputField
                            type="number"
                            error={formState.errors["lessorPercentage"]}
                            disabled={hide}
                            label=""
                            name="lessorPercentage"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What percentage of valuation do you propose for your
                            business?
                          </label>

                          <InputField
                            type="number"
                            disabled={hide}
                            error={formState.errors["selfPercentage"]}
                            label=""
                            name="selfPercentage"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What percentage of valuation does an expert propose
                            for your business?
                          </label>

                          <InputField
                          disabled={hide}
                            type="number"
                            error={formState.errors["expertPercentage"]}
                            label=""
                            name="expertPercentage"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {method == "Gross Operating Surplus" && (
                    <>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What is the annual gross operating surplus (EBE) of
                            your business?{" "}
                          </label>

                          <InputField
                            type="number"
                            error={formState.errors["annualEBE"]}
                            label=""
                            name="annualEBE"
                            variant="filled"
                            disabled={hide}
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What EBE valuation coefficient does the lessor
                            propose?{" "}
                          </label>

                          <InputField
                            type="number"
                            error={formState.errors["lessorEBE"]}
                            label=""
                            disabled={hide}
                            name="lessorEBE"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What EBE valuation coefficient do you propose?{" "}
                          </label>

                          <InputField
                            type="number"
                            error={formState.errors["proposeEBE"]}
                            label=""
                            name="proposeEBE"
                            variant="filled"
                            className="bglight-ip"
                            disabled={hide}
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What EBE valuation coefficient does an expert
                            propose?{" "}
                          </label>

                          <InputField
                            type="number"
                            error={formState.errors["expertEBE"]}
                            label=""
                            name="expertEBE"
                            variant="filled"
                            disabled={hide}
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {method == "Gross Margin" && (
                    <>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative my-3">
                            What is the annual gross margin of your business?{" "}
                          </label>

                          <InputField
                            type="number"
                            disabled={hide}
                            error={formState.errors["businessMargin"]}
                            label=""
                            name="businessMargin"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What gross margin valuation coefficient does the
                            lessor propose?{" "}
                          </label>

                          <InputField
                          disabled={hide}
                            type="number"
                            error={formState.errors["lessorMargin"]}
                            label=""
                            name="lessorMargin"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative my-3">
                            What gross margin valuation coefficient do you
                            propose?{" "}
                          </label>

                          <InputField
                          disabled={hide}
                            type="number"
                            error={formState.errors["proposeMargin"]}
                            label=""
                            name="proposeMargin"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            What gross margin valuation coefficient does an
                            expert propose?{" "}
                          </label>

                          <InputField
                            type="number"
                            error={formState.errors["expertMargin"]}
                            label=""
                            name="expertMargin"
                            variant="filled"
                            disabled={hide}
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  {method == "Daily Receipts" && (
                    <div className="col-12 col-md-6 mb-4">
                      <div className="lease-input">
                        <label className="relative my-3">
                          What are your business daily receipts?
                        </label>

                        <InputField
                          type="number"
                          error={formState.errors["dailyReceipts"]}
                          label=""
                          name="dailyReceipts"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                          disabled={hide}
                        />
                      </div>
                    </div>
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

export default BusinessValuation;
