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
    leaseRenewal: string;
    terminationDate: string;
    effectiveTerminationDate: string;
    terminationReason: string;
    explainReason: string;
    nonRenewalEffect: string;
    describeNonRenewal: string;
    sublet: string;
    subletArea: string;
  };

  const options = [
    { label: "Simple refusal", value: "simpleRefusal" },
    { label: "Reconstruction", value: "reconstruction" },
    { label: "Demolition", value: "demolition" },
  ];

  const effectArr = [
    { label: "Transfer of business", value: "businessTransfer" },
    { label: "Partial disappearance", value: "partial" },
    { label: "Total disappearance", value: "total" },
  ];

  const subletArr = [
    { label: "No", value: "no" },
    { label: "Yes, without specifying the area", value: "specifyingArea" },
    { label: "Yes, less than half ", value: "lessThanHalf" },
    { label: "Yes, more than half", value: "moreThanHalf" },
    { label: "Yes, the total area", value: "totalArea" },
  ];

  const Renewal = ({
    data,
    hide,
  }: {
    data: Eviction | undefined | null;
    hide: boolean;
  }) => {
    const [reason, setReason] = useState("");
    const [effect, setEffect] = useState("");
    const [sublet, setSublet] = useState("");
    const schema = z.object({
      leaseRenewal: z
        .string({ required_error: "Please enter the number of lease renewals" })
        .min(1, "Please enter the number of lease renewals"),

      terminationDate: z
        .string({ required_error: "Please select the date of termination" })
        .min(1, "Please select the date of termination"),

      effectiveTerminationDate: z
        .string({
          required_error: "Please select the effective date of termination",
        })
        .min(1, "Please select the effective date of termination"),

      terminationReason: z
        .string({
          required_error: "Please select the termination reason",
        })
        .min(1, "Please select the termination reason"),

      explainReason:
        reason == "reconstruction" || reason == "demolition"
          ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
              "Please explain the termination reason"
            )
          : z.string().optional(),

      nonRenewalEffect: z
        .string({
          required_error: "Please select the effect of non-renewal",
        })
        .min(1, "Please select the effect of non-renewal"),

      describeNonRenewal:
        effect == "partial" || effect == "total"
          ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
              "Please describe  non-renewal effect"
            )
          : z.string().optional(),

      sublet: z
        .string({
          required_error: "Please select if you sublet the premises",
        })
        .min(1, "Please select if you sublet the premises"),

      subletArea:
        sublet && sublet !== "no"
          ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
              "Please enter the sublet area"
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
          payload = { ...payload, progress: 50, nextProgress: 50 };
        }
        const { data } = await axios.post(
          "/api/client/category/eviction/createEviction",
          payload
        );

        let id = data.data.caseId;
        if (!hide) {
          const searchParam = new URLSearchParams();
          searchParam.set("caseId", id);
          searchParam.set("progress", "50");
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
            progress: 30,
          }
        );
        let id = data.data.caseId;
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");
        router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    useEffect(() => {
      setValues({
        leaseRenewal: data?.leaseRenewal?.toString(),
        terminationDate: data?.terminationDate,
        effectiveTerminationDate: data?.effectiveTerminationDate,
        terminationReason: data?.terminationReason,
        explainReason: data?.explainReason,
        nonRenewalEffect: data?.nonRenewalEffect,
        describeNonRenewal: data?.describeNonRenewal,
        sublet: data?.sublet,
        subletArea: data?.subletArea?.toString(),
      });

      setReason(data?.terminationReason ?? "");
      setEffect(data?.nonRenewalEffect ?? "");
      setSublet(data?.sublet ?? "");
    }, [data]);

    return (
      <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
        <h6 className="f-26  fw-400 pb-3">Renewal and Termination</h6>
        <div>
          <h2 className="f-15 fw-500">
            We now need information about the renewal history of your lease and
            the reasons for its termination.
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
                        <label className="f-18 fw-500">
                          Number of lease renewals
                        </label>
                        <h2 className="f-14 text-secondary">
                          Refers to renewals before the current termination.
                        </h2>
                        <InputField
                          type="number"
                          disabled={hide}
                          error={formState.errors["leaseRenewal"]}
                          label=""
                          name="leaseRenewal"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6 mb-4 date-input">
                      <div className="lease-input">
                        <label className="my-3">
                          Date of termination or non-renewal notice
                        </label>
                        <DateField
                        disabled={hide}
                          error={formState.errors["terminationDate"]}
                          label=""
                          name="terminationDate"
                          variant="filled"
                          className="bglight-ip w-100 p-1 rounded"
                          control={control}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6 mb-4 date-input">
                      <div className="lease-input">
                        <label className="my-3">
                          Effective date of termination
                        </label>
                        <DateField
                          error={formState.errors["effectiveTerminationDate"]}
                          label=""
                          name="effectiveTerminationDate"
                          variant="filled"
                          className="bglight-ip w-100 p-1 rounded"
                          disabled={hide}
                          control={control}
                        />
                      </div>
                    </div>

                    <div className="col-12 col-md-6 mb-4">
                      <div className="lease-input">
                        <label className="my-3">
                          Reason for termination or non-renewal{" "}
                        </label>
                        <SelectField
                          options={options}
                          label=""
                          name="terminationReason"
                          disabled={hide}
                          className="bglight-select"
                          error={formState.errors["terminationReason"]}
                          control={control}
                          emitChange={(val: any) => {
                            setReason(val);
                          }}
                        />
                      </div>
                    </div>

                    {(reason == "reconstruction" || reason == "demolition") && (
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="my-3">
                            Can you explain the reconstruction or demolition
                            project?
                          </label>
                          <InputField
                          disabled={hide}
                            error={formState.errors["explainReason"]}
                            label=""
                            name="explainReason"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>
                    )}

                    <div className="col-12 col-md-6 mb-4">
                      <div className="lease-input">
                        <label className="my-3">
                          Effect of non-renewal on your business
                        </label>
                        <SelectField
                          options={effectArr}
                          label=""
                          name="nonRenewalEffect"
                          disabled={hide}
                          className="bglight-select"
                          error={formState.errors["nonRenewalEffect"]}
                          control={control}
                          emitChange={(val: any) => {
                            setEffect(val);
                          }}
                        />
                      </div>
                    </div>

                    {(effect == "partial" || effect == "total") && (
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="my-3">
                            Can you describe the details?
                          </label>
                          <InputField
                            error={formState.errors["describeNonRenewal"]}
                            label=""
                            name="describeNonRenewal"
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
                        <label className="my-3">
                          Have you sublet the premises?
                        </label>
                        <SelectField
                          options={subletArr}
                          label=""
                          disabled={hide}
                          name="sublet"
                          className="bglight-select"
                          error={formState.errors["sublet"]}
                          control={control}
                          emitChange={(val: any) => {
                            setSublet(val);
                          }}
                        />
                      </div>
                    </div>

                    {sublet && sublet !== "no" && (
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="my-3">
                            what is the sublet area?{" "}
                          </label>
                          <InputField
                            type="number"
                            error={formState.errors["subletArea"]}
                            label=""
                            name="subletArea"
                            disabled={hide}
                            variant="filled"
                            className="bglight-ip"
                            control={control}
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

  export default Renewal;
