"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
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
  referenceId: string;
  name: string;
  lawyer: string;
  status: string;
  submissionDate: string;
  updatedDate: string;
};

const options = [
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Resolved", value: "resolved" },

  { label: "Not resolved", value: "notResolved" },
];

export const CaseFilters = () => {
  const schema = z.object({});

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);

  const { formState, control } = methods;

  return (
    <div className="doc-filters-form">
      <Form<FormValues>
        onSubmit={async (values) => {
          console.log(values);
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
                    error={formState.errors["referenceId"]}
                    label=""
                    placeholder="Reference Id"
                    name="referenceId"
                    variant="filled"
                    className="filter-ip"
                    control={control}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <InputField
                    error={formState.errors["name"]}
                    label="Representative Name"
                    name="name"
                    variant="filled"
                    className="filter-ip"
                    control={control}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <InputField
                    error={formState.errors["lawyer"]}
                    label="Lawyer Name"
                    name="lawyer"
                    variant="filled"
                    className="filter-ip"
                    control={control}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <SelectField
                    options={options}
                    label="Status"
                    name="status"
                    className="filter-select"
                    error={formState.errors["status"]}
                    control={control}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <DateField
                    error={formState.errors["submissionDate"]}
                    label="Submission Date"
                    name="submissionDate"
                    variant="filled"
                    className="filter-ip"
                    control={control}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <DateField
                    error={formState.errors["updatedDate"]}
                    label="Last Updated Date"
                    name="updatedDate"
                    variant="filled"
                    className="filter-ip"
                    control={control}
                  />
                </div>
              </div>

              <div className=" col-12 col-md-3 filter-btn mt-2">
                <Button variant="contained" size="sm" className="expert-btn">
                  <span className="f-16">Search</span>
                </Button>
              </div>
              {/* <div className="col-12 col-md-3">
                <div className="d-flex gap-2 align-items-center filter-drops">
                  <div className="dropdown">
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
                  </div>
                  <div className="filter-btn">
                    <Button
                      variant="contained"
                      size="lg"
                      className="expert-btn"
                    >
                      <span className="f-16">Search</span>
                    </Button>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
