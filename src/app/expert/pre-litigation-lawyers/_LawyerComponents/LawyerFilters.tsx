"use client";

import React from "react";
import * as z from "zod";
import "../../../expert/expert.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import DateField from "@/components/Form/DateField";
import { useHookForm } from "@/hooks/useHookForm";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import filter from "@/assets/document-filter.png";
import Link from "next/link";
import Image from "next/image";

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
export const LawyerFilters = () => {
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
                <div className="filter-input date-expert">
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
                <div className="filter-input select">
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
              <div className="col-12 col-md-2 mb-3">
                <div className="filter-input select">
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
              <div className="col-12 col-md-3 mb-3">
                {/* <div className="d-flex gap-2 align-items-center filter-drops"> */}
                {/* <div className="dropdown">
                  <button
                    className="btn bg-white rounded-lg dropdown-toggle"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <Image src={filter} alt="" />
                  </button>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="dropdownMenuButton1"
                  >
                    <li className="border-btm">
                      <Link className="dropdown-item f-14" href="#">
                      Representative
                      </Link>
                    </li>
                    <li className="border-btm">
                      <Link className="dropdown-item f-14" href="#">
                      Status
                      </Link>
                    </li>
                    <li className="">
                      <Link className="dropdown-item f-14" href="#">
                      Last Updated
                      </Link>
                    </li>
                  </ul>
                </div> */}
                <div className="filter-btn">
                  <Button variant="contained" size="lg" className="expert-btn">
                    <span className="f-16">Search</span>
                  </Button>
                  </div>
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};