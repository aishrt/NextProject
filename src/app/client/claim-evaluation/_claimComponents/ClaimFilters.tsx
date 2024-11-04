"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import DateField from "@/components/Form/DateField";
import { useHookForm } from "@/hooks/useHookForm";

import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import TextAreaField from "@/components/Form/TextArea";
import euro from "@/assets/euro.png";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";

type FormValues = {
  referId: string;
  date: string;
  name: string;
  lawyer: string;
};

const options = [
  { label: "Name", value: "Name" },
  { label: "Name", value: "Name" },
];

const lawyer = [
  { label: "Lawyer", value: "Lawyer" },
  { label: "Lawyer", value: "Lawyer" },
];
export const ClaimFilters = () => {
  const schema = z.object({
    referId: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please enter Reference ID"
    ),

    date: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please enter date"
    ),

    name: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the name"
    ),
    lawyer: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please select the lawyer"
    ),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);

  const { formState, control } = methods;

  return (
    <div className="doc-filters-form">
      <Form<FormValues>
        onSubmit={async (values) => {
          alert("Abc");
        }}
        methods={methods}
      >
        <div className="row mt-4">
          <div className="col-12 col-md-12">
            <div className="row filter-docs">
              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <InputField
                    type="number"
                    error={formState.errors["referId"]}
                    label=""
                    placeholder="Reference Id"
                    name="referId"
                    variant="filled"
                    className="filter-ip"
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-2 mb-3">
                <div className="filter-input">
                  <DateField
                    error={formState.errors["date"]}
                    label="Date"
                    name="date"
                    variant="filled"
                    className="filter-ip"
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-2 mb-3">
                <div className="filter-input">
                  <SelectField
                    options={options}
                    label="Name"
                    name="name"
                    className="filter-select"
                    error={formState.errors["name"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <SelectField
                    options={options}
                    label="Assigned Lawyer"
                    name="lawyer"
                    className="filter-select"
                    error={formState.errors["lawyer"]}
                    control={control}
                  />
                </div>
              </div>
              <div className="col-12 col-md-2 mb-3">
                <div className="filter-btn">
                  <Button variant="contained" size="lg" className="client-btn">
                    <span className="f-16">Search</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
