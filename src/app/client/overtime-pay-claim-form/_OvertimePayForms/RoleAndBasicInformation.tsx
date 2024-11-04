"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import { NumberField } from "@/components/Form/NumberField";
import { InputField } from "@/components/Form/InputField";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

type FormValues = {
  role: string;
  department: string;
  age: string;
  salary: string;
  others: string;
  years: string;
  otherStatus: string;
  otherDepartment: string;
};

const RoleAndBasicInformation = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [role, setValue] = React.useState("");
  const [employmentStatus, setStatus] = React.useState("");
  const [workDepartment, setDepartment] = React.useState("");

  const schema = z.object({
    department:
      role == "Employee"
        ? z
            .string({ required_error: "Please enter department number" })
            .min(1, "Please enter department number")
        : z.string().optional(),

    age:
      role == "Employer"
        ? z
            .string({
              required_error: "Please enter a valid age between 15 and 90",
            })
            .min(1, "Please enter a valid age between 15 and 90")
            .refine(
              (age) => {
                const ageInt = parseInt(age);
                console.log(ageInt);

                return ageInt >= 15 || ageInt <= 90;
              },
              {
                message: "Please enter a valid age between 15 and 90",
                path: ["age"],
              }
            )
        : z.string().optional(),

    salary:
      role == "Employer"
        ? z
            .string({
              required_error: "Please enter a valid monthly gross salary",
            })
            .min(1, "Please enter a valid monthly gross salary")
        : z.string().optional(),

    years:
      role == "Employer"
        ? z
            .string({
              required_error:
                "Please enter the number of years you have been with the company",
            })
            .min(
              1,
              "Please enter the number of years you have been with the company"
            )
        : z.string().optional(),

    otherStatus:
      role == "Employer" && employmentStatus == "other"
        ? z
            .string({ required_error: "Please enter the other statement" })
            .min(1, "Please enter the other statement")
        : z.string().optional(),

    otherDepartment:
      role == "Employer" && workDepartment == "other"
        ? z
            .string({ required_error: "Please enter the other statement" })
            .min(1, "Please enter the other statement")
        : z.string().optional(),
  });
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.roleErr = false;
      return newObj;
    });
  };

  const [totalEmployee, setEmployee] = React.useState("");

  const handleEmployee = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.employeeErr = false;
      return newObj;
    });
  };

  const handleStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.statusErr = false;
      return newObj;
    });
  };

  const departmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDepartment((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.workErr = false;
      return newObj;
    });
  };

  const [errors, setErrors] = useState({
    roleErr: false,
    employeeErr: false,
    statusErr: false,
    workErr: false,
  });
  const errHandle = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!role) {
      isError = true;
      errorObj.roleErr = true;
    }
    if (role == "Employee" && !totalEmployee) {
      isError = true;
      errorObj.employeeErr = true;
    }

    if (role == "Employer" && !employmentStatus) {
      isError = true;
      errorObj.statusErr = true;
    }

    if (role == "Employer" && !workDepartment) {
      isError = true;
      errorObj.workErr = true;
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [action, setAction] = useState("");

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }
      const payload = {
        caseId: caseId,
        ...values,
        role,
        totalEmployee,
        employmentStatus,
        workDepartment,
        progress: 30,
      };


      const { data } = await axios.post(
        "/api/client/category/overtime/createOvertime",
        payload
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");

      if (action == "next") {
        router.push(
          `/client/overtime-pay-claim-form?${searchParam.toString()}`
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

  const handleReset = () => {
    setValues({
      role: "",
      department: "",
      age: "",
      salary: "",
      others: "",
      years: "",
      otherStatus: "",
      otherDepartment: "",
    });
     setValue("");
    setStatus("");
    setDepartment("");
    setEmployee('')
  };

  return (
    <div className="lease-form  p-4 rounded white-card mt-4">
      <h3 className="f-22 bold mt-4 pb-3 gray">
        Step 1/6: Your Role and Basic Information
      </h3>
      {loading ? (
        <div className="text-center  mt-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          <p className="f-14 gray">
            First, please indicate your role in this claim:
          </p>
          <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
            <div className="row mt-3">
              <div className="col-12 col-md-12 mb-4">
                <div className="mb-3 radio-end-input">
                  <label className="tooltip-title relative">
                    Are you the employer or the employee filing the claim?
                  </label>
                  <FormControl className="w-100">
                    <RadioGroup
                      className="w-100"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={role}
                      onChange={handleChange}
                    >
                      <FormControlLabel
                        className="radio-light-ip"
                        value="Employer"
                        control={<Radio />}
                        label="Employer"
                      />
                      <FormControlLabel
                        className="radio-light-ip"
                        value="Employee"
                        control={<Radio />}
                        label="Employee"
                      />
                    </RadioGroup>
                  </FormControl>
                  {errors.roleErr && (
                    <span className="text-danger f-14">
                      Please select your role
                    </span>
                  )}
                </div>
              </div>
            </div>

            {role == "Employee" && (
              <>
                <h3 className="f-18 bold">Employee Information:</h3>
                <p className="f-14">
                  {`To assess your claim accurately, we need some information about your employer. Please provide the following: `}{" "}
                </p>
                <div className="row mt-3">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="d-block relative">
                        Department Number (French company headquarters)
                      </label>
                      <InputField
                        type="number"
                        error={formState.errors["department"]}
                        label="Department Number "
                        name="department"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-12 mb-4">
                    <div className="mb-3 radio-end-input">
                      <label className="tooltip-title relative">
                        Total Number of Employees in the Company
                      </label>

                      <FormControl className="w-100">
                        <RadioGroup
                          className="w-100"
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={totalEmployee}
                          onChange={handleEmployee}
                        >
                          <FormControlLabel
                            className="radio-light-ip"
                            value="1-10"
                            control={<Radio />}
                            label="1-10"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="11-50"
                            control={<Radio />}
                            label="11-50"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="51-200"
                            control={<Radio />}
                            label="51-200"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="200+"
                            control={<Radio />}
                            label="200+"
                          />
                        </RadioGroup>
                      </FormControl>

                      {errors.employeeErr && (
                        <span className="text-danger f-14">
                          Please select the number of employees
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {role == "Employer" && (
              <>
                <h3 className="f-18 bold">Employer Information:</h3>
                <p className="f-14">
                  To help us understand your employment situation, please
                  provide the following information:
                </p>
                <div className="row mt-3">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="d-block relative">
                        Age (Must be between 15 and 90)
                      </label>
                      <InputField
                        type="number"
                        error={formState.errors["age"]}
                        label="Enter age"
                        name="age"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="d-block relative">
                        Monthly Gross Salary (in euros)
                      </label>
                      <InputField
                        type="number"
                        error={formState.errors["salary"]}
                        label=" €0.00"
                        name="salary"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="mb-3 radio-end-input">
                      <label className="tooltip-title relative">
                        Employment Status
                      </label>
                      <FormControl className="w-100">
                        <RadioGroup
                          className="w-100"
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={employmentStatus}
                          onChange={handleStatus}
                        >
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Unskilled"
                            control={<Radio />}
                            label="Unskilled"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Skilled worker/technician"
                            control={<Radio />}
                            label="Skilled worker/technician"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Supervisor"
                            control={<Radio />}
                            label="Supervisor"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Executive"
                            control={<Radio />}
                            label="Executive"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Senior executive"
                            control={<Radio />}
                            label="Senior executive"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="other"
                            control={<Radio />}
                            label="Other"
                          />
                        </RadioGroup>
                        {errors.statusErr && (
                          <span className="text-danger f-14">
                            {" "}
                            Please select your employment status
                          </span>
                        )}
                      </FormControl>
                    </div>
                    {employmentStatus == "other" && (
                      <div className="lease-input mb-4">
                        <label className="tooltip-title relative">Other</label>
                        <InputField
                          error={formState.errors["otherStatus"]}
                          label="Others"
                          name="otherStatus"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="mb-3 radio-end-input">
                      <label className="tooltip-title relative">
                        Work Department
                      </label>
                      <FormControl className="w-100">
                        <RadioGroup
                          className="w-100"
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={workDepartment}
                          onChange={departmentChange}
                        >
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Front office"
                            control={<Radio />}
                            label="Front office"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="HR"
                            control={<Radio />}
                            label="HR"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Legal"
                            control={<Radio />}
                            label="Legal"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Finance/accounting"
                            control={<Radio />}
                            label="Finance/accounting"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Production/maintenance "
                            control={<Radio />}
                            label="Production/maintenance (IT; manicurist)"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="R&D"
                            control={<Radio />}
                            label="R&D"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Business (sales/purchasing/communications)"
                            control={<Radio />}
                            label="Business (sales/purchasing/communications)"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="Management"
                            control={<Radio />}
                            label="Management"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="other"
                            control={<Radio />}
                            label="Others"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                    {workDepartment == "other" && (
                      <div className="lease-input mb-4">
                        <label className="tooltip-title relative">Others</label>
                        <InputField
                          error={formState.errors["otherDepartment"]}
                          label="Others"
                          name="otherDepartment"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="d-block relative">
                        Years with the Company
                      </label>
                      <InputField
                        type="number"
                        error={formState.errors["years"]}
                        label="Number of Years"
                        name="years"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                <Button
                  type="submit"
                  variant="contained"
                  size="lg"
                  className="client-btn"
                  onClick={() => {
                    errHandle();
                    setAction("edit");
                  }}
                >
                  <span className="f-16">Edit Section</span>
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="f-16 next-btn "
                  onClick={() => {
                    errHandle();
                    setAction("next");
                  }}
                >
                  <span className="f-16 py-2">Next</span>
                </Button>
                <Button
                  variant="contained"
                  className="client-btn"
                  size="lg"
                  onClick={handleReset}
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default RoleAndBasicInformation;
