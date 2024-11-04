"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SelectField from "@/components/Form/SelectField";
import axios from "axios";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Eviction } from "@/types/Eviction";

type FormValues = {
  activityType: string;
  activitySector: string;
};

const activity = [
  { label: "Automotive Sector", value: "automotiveSector" },
  { label: "Housing Sector", value: "housingSector" },
  { label: "Food Sector", value: "foodSector" },
  { label: "Sales Sector", value: "salesSector" },
  { label: "Services Sector", value: "servicesSector" },
];

const automotive = [
  { label: "Garage", value: "garage" },
  { label: "Parking", value: "parking" },
  { label: "Service Station", value: "serviceStation" },
  { label: "Car Wash", value: "carWash" },
];
const housing = [
  { label: "Hotel", value: "hotel" },
  { label: "Other Residences", value: "otherResidences" },
  { label: "Real Estate Agency", value: "realEstateAgency" },
];
const food = [
  { label: "Supermarkets, Stores, Grocery", value: "grocery" },
  {
    label: "Bakery, Pastry Shop,Tea Room, Confectionery, Ice Cream Shop ",
    value: "bakery",
  },
  { label: "Butchery, Charcuterie, Fish Shop", value: "fishShop" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Café, Bar ", value: "cafe" },
  { label: "Other", value: "other" },
];
const sales = [
  { label: "Textiles", value: "textiles" },
  { label: "Clothing", value: "clothing" },
  { label: "Shoe Accessories", value: "shoeAccessories" },
  { label: "Bookstore", value: "bookstore" },
  { label: "Tobacco", value: "tobacco" },
  { label: "Press", value: "press" },
  { label: "Lottery", value: "lottery" },
  { label: "Jewelry", value: "jewelry" },
  { label: "Watchmaking", value: "watchmaking" },
  { label: "Other Sales", value: "otherSales" },
];

const services = [
  { label: "Hairdressing", value: "hairdressing" },
  { label: "Beauty", value: "beauty" },
  { label: "Dry Cleaning, Laundry", value: "dryCleaning" },
  { label: "Travel Agency", value: "travelAgency" },
  { label: "Storage Activities", value: "storageActivities" },
  { label: "Offices", value: "offices" },
  { label: "Other", value: "otherServices" },
];
const schema = z.object({
  activityType: z
    .string({
      required_error: "Please select the activity",
      invalid_type_error: "Please select the activity",
    })
    .min(1, "Please select the activity"),

  activitySector: z
    .string({ required_error: "Please select the sector of activity" })
    .min(1, "Please select the sector of activity"),
});

const Activity = ({
  data,
  hide,
}: {
  data: Eviction | undefined | null;
  hide: boolean;
}) => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);

  const { formState, control } = methods;

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const [activityType, setActivityType] = useState<string | null>("");
  const [activitySector, setActivitySector] = useState<string | null>("");

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      let payload: any = {
        caseId: caseId,
        ...values,
      };

      if (!hide) {
        payload = { ...payload, progress: 40, nextProgress: 40 };
      }
      const { data } = await axios.post(
        "/api/client/category/eviction/createEviction",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");
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
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      activityType: data?.activityType,
      activitySector: data?.activitySector,
    });
    setActivityType(data?.activityType ?? "");
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Your Activity</h6>
      <div>
        <h6 className="f-15  fw-400">
          Now let&apos;s talk about your professional activity. This will give
          us an idea of the potential impact of the eviction on your business.
        </h6>
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
                      <div className="mb-3 lease-input">
                        <label className="relative">
                          Sector of your main activity{" "}
                        </label>
                        <SelectField
                          options={activity}
                          label=""
                          disabled={hide}
                          name="activityType"
                          className="bglight-select"
                          error={formState.errors["activityType"]}
                          control={control}
                          emitChange={(val) => {
                            setActivityType(val);
                          }}
                        />
                      </div>

                      {activityType == "automotiveSector" && (
                        <div className="mb-3 lease-input">
                          <label className="relative">Automotive Sector</label>
                          <h2 className="f-14 text-secondary">
                            Select the option that best describes your specific
                            activity.
                          </h2>
                          <SelectField
                            options={automotive}
                            label=""
                            disabled={hide}
                            name="activitySector"
                            className="bglight-select"
                            error={formState.errors["activitySector"]}
                            control={control}
                            emitChange={(val) => {
                              setActivitySector(val);
                            }}
                          />
                        </div>
                      )}

                      {activityType == "housingSector" && (
                        <div className="mb-3 lease-input">
                          <label className="relative">Housing Sector</label>
                          <h2 className="f-14 text-secondary">
                            Select the option that best describes your specific
                            activity.
                          </h2>
                          <SelectField
                            options={housing}
                            disabled={hide}
                            label=""
                            name="activitySector"
                            className="bglight-select"
                            error={formState.errors["activitySector"]}
                            control={control}
                            emitChange={(val) => {
                              setActivitySector(val);
                            }}
                          />
                        </div>
                      )}

                      {activityType == "foodSector" && (
                        <div className="mb-3 lease-input">
                          <label className="relative">Food Sector</label>
                          <h2 className="f-14 text-secondary">
                            Select the option that best describes your specific
                            activity.
                          </h2>
                          <SelectField
                            options={food}
                            label=""
                            name="activitySector"
                            className="bglight-select"
                            error={formState.errors["activitySector"]}
                            disabled={hide}
                            control={control}
                            emitChange={(val) => {
                              setActivitySector(val);
                            }}
                          />
                        </div>
                      )}

                      {activityType == "salesSector" && (
                        <div className="mb-3 lease-input">
                          <label className="relative">Sales Sector</label>
                          <h2 className="f-14 text-secondary">
                            Select the option that best describes your specific
                            activity.
                          </h2>
                          <SelectField
                            options={sales}
                            disabled={hide}
                            label=""
                            name="activitySector"
                            className="bglight-select"
                            error={formState.errors["activitySector"]}
                            control={control}
                            emitChange={(val) => {
                              setActivitySector(val);
                            }}
                          />
                        </div>
                      )}

                      {activityType == "servicesSector" && (
                        <div className="mb-3 lease-input">
                          <label className="relative">Services Sector</label>
                          <h2 className="f-14 text-secondary">
                            Select the option that best describes your specific
                            activity.
                          </h2>
                          <SelectField
                            options={services}
                            disabled={hide}
                            label=""
                            name="activitySector"
                            className="bglight-select"
                            error={formState.errors["activitySector"]}
                            control={control}
                            emitChange={(val) => {
                              setActivitySector(val);
                            }}
                          />
                        </div>
                      )}
                      {activityType == "other" && (
                        <div className="mb-3 lease-input">
                          <label>Other</label>
                          <InputField
                            error={formState.errors["activitySector"]}
                            disabled={hide}
                            label="Other"
                            name="activitySector"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      )}
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

export default Activity;
