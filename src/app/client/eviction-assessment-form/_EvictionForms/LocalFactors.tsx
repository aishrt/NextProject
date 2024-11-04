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
  citySize: string;
  location: string;
  citySituation: string;
  transportConnectivity: string;
  reputedBrand: string;
  competingBrand: string;
  miscellaneousAdvantages: string;
};

const options = [
  {
    label: "Less than 10,000 inhabitants",
    value: "Less than 10,000 inhabitants",
  },
  {
    label: "10,000 to 50,000 inhabitants",
    value: "10,000 to 50,000 inhabitants",
  },
  {
    label: "50,000 to 200,000 inhabitants",
    value: "50,000 to 200,000 inhabitants",
  },
  {
    label: "200,000 to 400,000 inhabitants",
    value: "200,000 to 400,000 inhabitants",
  },
  {
    label: "More than 400,000 inhabitants",
    value: "More than 400,000 inhabitants",
  },
  { label: "Do not know", value: "Do not know" },
];

const locationArr = [
  { label: "Downtown retail", value: "Downtown retail" },
  {
    label: "Retail in the vicinity of a city",
    value: "Retail in the vicinity of a city",
  },
  {
    label: "Retail in a shopping center",
    value: "Retail in a shopping center",
  },
  {
    label: "Retail in a business district",
    value: "Retail in a business district",
  },

  {
    label: "Retail in an industrial area",
    value: "Retail in an industrial area",
  },
  { label: "Retail on the outskirts", value: "Retail on the outskirts" },
  {
    label: "Retail in a residential area",
    value: "Retail in a residential area",
  },
  {
    label: "Retail in a specialized neighborhood",
    value: "Retail in a specialized neighborhood",
  },
  {
    label: "Retail in a resort or mountain station",
    value: "Retail in a resort or mountain station",
  },
];

const situationArr = [
  {
    label: "Tertiary artery",
    value: "Tertiary artery",
  },
  {
    label: "Secondary artery",
    value: "Secondary artery",
  },
  {
    label: "Main artery",
    value: "Main artery",
  },
];

const transportArr = [
  {
    label: "Poor",
    value: "Poor",
  },
  {
    label: "Moderate",
    value: "Moderate",
  },
  {
    label: "Good",
    value: "Good",
  },
];

const brandArr = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "A few reputed brands nearby",
    value: "A few reputed brands nearby",
  },
  {
    label: "Several reputed brands nearby",
    value: "Several reputed brands nearby",
  },
  {
    label: "Exclusively reputed brands nearby",
    value: "Exclusively reputed brands nearby",
  },
];

const competingArr = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "A few competing brands nearby",
    value: "A few competing brands nearby",
  },
  {
    label: "Several competing brands nearby",
    value: "Several competing brands nearby",
  },
];

const advantagesArr = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "Right to display",
    value: "Right to display",
  },
  {
    label: "Terrace",
    value: "Terrace",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const LocalFactors = ({
  data,
  hide,
}: {
  data: Eviction | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    citySize: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the size of the city"
    ),

    location: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the location of the premises"
    ),

    citySituation: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the situtaion of the premises"
    ),

    transportConnectivity: ((msg) =>
      z.string({ required_error: msg }).min(1, msg))(
      "Please select the public transport connectivity"
    ),

    reputedBrand: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the reputed brands"
    ),

    competingBrand: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the competing brands"
    ),

    miscellaneousAdvantages: ((msg) =>
      z.string({ required_error: msg }).min(1, msg))(
      "Please select the miscellaneous advantages"
    ),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);

  const { formState, control } = methods;

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    err: false,
  });

  const [pointOfInterest, setInterest] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInterest((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.err = false;
      return newErrorObj;
    });
  };

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!pointOfInterest) {
      isError = true;
      errorObj = { ...errorObj, err: true };
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
      let payload: any = {
        caseId: caseId,
        ...values,
        pointOfInterest,
      };

      if (!hide) {
        payload = { ...payload, progress: 80, nextProgress: 80 };
      }
      const { data } = await axios.post(
        "/api/client/category/eviction/createEviction",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "80");
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
          progress: 60,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      citySize: data?.citySize,
      location: data?.location,
      citySituation: data?.citySituation,
      transportConnectivity: data?.transportConnectivity,
      reputedBrand: data?.reputedBrand,
      competingBrand: data?.competingBrand,
      miscellaneousAdvantages: data?.miscellaneousAdvantages,
    });
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Local Factors</h6>
      <div>
        <h2 className="f-15 fw-500">
          Local factors play a crucial role in assessing compensation. Provide
          details about the location of the premises.
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
                      <label>
                        What is the size of the city where your premises are
                        located?
                      </label>
                      <SelectField
                        disabled={hide}
                        options={options}
                        label=""
                        name="citySize"
                        className="bglight-select"
                        error={formState.errors["citySize"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>Location of the Premises</label>
                      <SelectField
                        disabled={hide}
                        options={locationArr}
                        label=""
                        name="location"
                        className="bglight-select"
                        error={formState.errors["location"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label>Situation of the Premises</label>
                      <SelectField
                        options={situationArr}
                        label=""
                        name="citySituation"
                        className="bglight-select"
                        error={formState.errors["citySituation"]}
                        disabled={hide}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="tooltip-title relative">
                        Public Transport Connectivity
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          Assess the overall ease of access to your location
                          using public transportation options.
                        </span>
                      </label>

                      <SelectField
                        options={transportArr}
                        disabled={hide}
                        label=""
                        name="transportConnectivity"
                        className="bglight-select"
                        error={formState.errors["transportConnectivity"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="business-radio">
                      <FormControl className="w-100">
                        <label>Proximity to a Point of Interest </label>
                        <RadioGroup
                          className="w-100"
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={pointOfInterest}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            className=""
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                            disabled={hide}
                          />
                          <FormControlLabel
                            className=""
                            disabled={hide}
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>

                        {errors.err && (
                          <span
                            className="text-danger"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Please select premises reserved
                          </span>
                        )}
                      </FormControl>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="tooltip-title relative">
                        Reputed Brands Nearby{" "}
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          Indicate the presence of well-known or high-end
                          businesses in the area.
                        </span>
                      </label>

                      <SelectField
                        disabled={hide}
                        options={brandArr}
                        label=""
                        name="reputedBrand"
                        className="bglight-select"
                        error={formState.errors["reputedBrand"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="tooltip-title relative">
                        Competing Brands Nearby
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          Indicate the level of competition from businesses
                          offering similar products or services in the vicinity.
                        </span>
                      </label>

                      <SelectField
                        options={competingArr}
                        label=""
                        name="competingBrand"
                        disabled={hide}
                        className="bglight-select"
                        error={formState.errors["competingBrand"]}
                        control={control}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="tooltip-title relative">
                        Miscellaneous Advantages
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          Select any special benefits or features that enhance
                          the value or appeal of your premises.
                        </span>
                      </label>

                      <SelectField
                        options={advantagesArr}
                        disabled={hide}
                        label=""
                        name="miscellaneousAdvantages"
                        className="bglight-select"
                        error={formState.errors["miscellaneousAdvantages"]}
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
                  className={`next-btn eviction-submit-btn ${
                    hide ? "d-none" : "block"
                  }`}
                  size="lg"
                  onClick={() => errHandle()}
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

export default LocalFactors;
