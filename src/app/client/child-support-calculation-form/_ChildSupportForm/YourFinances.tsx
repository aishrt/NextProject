"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Form/Button";
import { NumberField } from "@/components/Form/NumberField";
import bubble from "@/assets/info.png";
import Image from "next/image";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { Child } from "@/types/Child";
import { InputField } from "@/components/Form/InputField";

type FormValues = {
  monthlyIncome: string;
  monthlyExpenses: string;
  children: string;
};

const schema = z.object({
  monthlyIncome: z
    .string({ required_error: "Please enter monthly income" })
    .min(1, "Please enter monthly income"),
  monthlyExpenses: z
    .string({ required_error: "Please enter monthly expenses" })
    .min(1, "Please enter monthly expenses"),

  children: z
    .string({ required_error: "Please enter children number" })
    .min(1, "Please enter children number"),
});

const YourFinances = ({ data }: { data: Child | undefined }) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "20");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const [childData, setChildData] = useState<any>({});

  const [children, setChildren] = useState([]);

  //   const handleInputChange = (index: number, field: string, value: any) => {
  //     console.log(index);
  //     console.log(field);
  //     console.log(value);
  // // setName(value)
  //     const updatedChildren = [...children];
  //     updatedChildren[index][field] = value;
  //     setChildren(updatedChildren);
  //     // Reset errors for the specific field
  //     setErrors((prev: any) => {
  //       let newErrorObj = { ...prev };
  //       newErrorObj[`${field}Err`] = false;
  //       return newErrorObj;
  //     });
  //   };

  useEffect(() => {
    setValues({
      monthlyIncome: data?.monthlyIncome?.toString(),
      monthlyExpenses: data?.monthlyExpenses?.toString(),
      children: data?.children?.toString(),
    });
  }, [data]);

  const [errors, setErrors] = useState({
    nameErr: false,
    ageErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!name) {
      isError = true;
      errorObj = { ...errorObj, nameErr: true };
    }

    if (!age) {
      isError = true;
      errorObj = { ...errorObj, ageErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      // if (errHandle()) {
      //   return;
      // }
      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          ...values,
          progress: 40,
          nextProgress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const { formState, control } = methods;

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="lease-form white-card p-4 rounded mt-4  indivi-form">
      <h3 className="f-22 bold mt-4 pb-4 gray">Your Finances</h3>
      <h4 className="f-16 mb-4 gray">
        Now, let&apos;s talk about your finances. Your income and essential
        expenses paint a picture of your financial capacity. By understanding
        your financial situation, we can accurately determine what you can
        contribute or what you need to support your child.{" "}
      </h4>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <h3 className="f-18 bold">Let&apos;s talk about your finances:</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Your total monthly income:
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Include all sources of income, such as salary, bonuses,
                    rental income, investments, alimony, pensions, retirement
                    benefits, family allowances, social assistance, and any
                    other regular income.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["monthlyIncome"]}
                  label="Monthly Income (€)"
                  name="monthlyIncome"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Your essential monthly expenses
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Include housing expenses (rent, mortgage payments, property
                    taxes, homeowners insurance), utilities (electricity, gas,
                    water, trash), food, transportation, childcare, healthcare
                    (health insurance premiums, co-pays, prescriptions), other
                    insurance (life, car, etc.), and any other necessary
                    expenses. If you have other children, include their expenses
                    as well. Exclude any consumer debt payments (credit cards,
                    personal loans).
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["monthlyExpenses"]}
                  label="Monthly Expenses (€)"
                  name="monthlyExpenses"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  How many other children are you financially responsible for?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This includes children from other relationships, whether or
                    not they live with you. This information is important for
                    determining your financial capacity and needs.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["children"]}
                  label="Number of Children"
                  name="children"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
          </div>

          {/* {[...Array(methods.getValues("children"))].map((child, index) => {
            return (
              <div key={index}>
                <input type="text" name={`inputField${index + 1}`} />
                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="tooltip-title relative">
                        Enter child name
                      </label>
                      <TextField
                        fullWidth
                        id={`name-${index}`}
                        label="Name"
                        sx={{ backgroundColor: "#d6eadf" }}
                        variant="filled"
                        value={children[index]?.name}
                        onChange={(event) =>
                          handleInputChange(index, "name", event.target.value)
                        }

                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setName(event.target.value);
                          setErrors((prev) => {
                            let newErrorObj = { ...prev };
                            newErrorObj.nameErr = false;
                            return newErrorObj;
                          });
                        }}
                      />
                      {errors.nameErr && (
                        <div>
                          <span className="text-danger">
                            Please enter the name
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mb-4">
                      <label className="tooltip-title relative">
                        Enter child age
                      </label>
                      <TextField
                        type="number"
                        fullWidth
                        id={`age-${index}`}
                        label="Age"
                        sx={{ backgroundColor: "#d6eadf" }}
                        variant="filled"
                        value={children[index]?.age}
                        onChange={(event) =>
                          handleInputChange(index, "age", event.target.value)
                        }
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setAge(event.target.value);
                          setErrors((prev) => {
                            let newErrorObj = { ...prev };
                            newErrorObj.ageErr = false;
                            return newErrorObj;
                          });
                        }}
                      />
                      {errors.ageErr && (
                        <div>
                          <span className="text-danger">
                            Please enter the age
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })} */}

          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Button
                variant="contained"
                size="lg"
                className="client-btn"
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="next-btn"
                onClick={() => {
                  // errHandle();
                }}
              >
                <span className="f-16">Next</span>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default YourFinances;
