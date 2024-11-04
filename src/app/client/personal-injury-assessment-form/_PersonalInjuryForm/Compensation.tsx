import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import bubble from "@/assets/info.png";
import SelectField from "@/components/Form/SelectField";
import { NumberField } from "@/components/Form/NumberField";
import { Button } from "@/components/Form/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Injury } from "@/types/Injury";

const schema = z.object({
  // protection: z
  //   .string({ required_error: "Please select the type of protection measure" })
  //   .min(1, "Please select the type of protection measure"),
});

type FormValues = {};
type Proposed = {
  name: string;
  amount: string;
};
const insurance = [
  {
    label: "Professional Impact",
    value: "Professional",
  },
  {
    label: "Permanent Functional Deficit",
    value: "Permanent",
  },
  {
    label: "Loss of Enjoyment of Life",
    value: "Enjoyment",
  },
  {
    label: "Permanent Aesthetic Damage",
    value: "Aesthetic",
  },
  {
    label: "Sexual Harm",
    value: "Sexual",
  },
  {
    label: "Loss of Establishment ",
    value: "Establishment ",
  },

  {
    label: "Economic and Support Damages",
    value: "Economic",
  },
  {
    label: "Indirect Victims' Damages",
    value: "Indirect",
  },
];

const Compensation = ({
  data,
  hide,
}: {
  data: Injury | undefined | null;
  hide: boolean;
}) => {
  const alldata = data;

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const router = useRouter();
  const { formState, control } = methods;
  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const [errors, setErrors] = React.useState({
    categoryErr: false,
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [compensation, setCompensation] = useState<Proposed[]>([
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
  ]);
  const checkError = () => {
    let isError = false;
    let errorObj = { ...errors };

    const checkErr = compensation.every((val) => {
      if (val && val.name) {
        let data = Object.values(val.name);
        console.log(data);
        return data.every((value) => {
          return value === "" || value === null || value === undefined;
        });
      }
      return true;
    });

   

    if (checkErr) {
      isError = true;
      errorObj.categoryErr = true;
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleCheckChange = (index: number, label: string) => {
    let arr = Array.isArray(compensation) ? [...compensation] : [];
    if (!arr[index]) {
      arr[index] = { name: "", amount: "" };
    }
    arr[index].name = arr[index]?.name ? "" : label;

    setCompensation(arr);

    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.categoryErr = false;
      return newErr;
    });
  };

  const handleAmountChange = (index: number, value: string) => {
    let arr = Array.isArray(compensation) ? [...compensation] : [];
    arr[index].amount = value;
    setCompensation(arr);
  };
  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (checkError()) {
        return;
      }
      let payload: any = {
        caseId: caseId,
        damagesCategory: compensation,
        // progress: 100,
        // nextProgress: 100,
      };
      if (!hide) {
        payload = { ...payload, progress: 100, nextProgress: 100 };
      }
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        payload
      );

      let id = data?.data?.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "100");
        router.push(
          `/client/personal-injury-assessment-form?${searchParam.toString()}`
        );
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        {
          caseId: caseId,
          progress: alldata?.victims == "yes" ? 80 : 70,
        }
      );

      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", alldata?.victims == "yes" ? "80" : "70");
      router.push(
        `/client/personal-injury-assessment-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && data.damagesCategory.length > 0) {
      setCompensation(data?.damagesCategory ?? []);
    } else {
      setCompensation([]);
    }
  }, [data]);
  console.log(compensation);

  return (
    <div className="lease-form">
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div>
          <hr />
          <h3 className="f-22 bold gray mb-5">
            Compensation Proposal Categories
          </h3>
          <div className="row align-items-end">
            <div className="col-12 col-md-12 mb-4">
              <div className="radio-end-input mb-3">
                <label className="d-block">
                  Click on each category of damages for which the insurance
                  company has proposed compensation:
                </label>
                <FormGroup>
                  {insurance.map((i, index) => {
                    return (
                      <>
                        <FormControlLabel
                          key={index}
                          className="radio-light-ip"
                          value={i.value}
                          control={<Checkbox />}
                          label={i.label}
                          onChange={() => {
                            handleCheckChange(index, i.value);
                          }}
                          checked={
                            compensation.some(
                              (comp) => comp?.name === i?.value
                            ) ?? false
                          }
                        />

                        {compensation[index]?.name == i.value && (
                          <>
                            <label className="tooltip-title relative">
                              What is the proposed amount?{" "}
                            </label>
                            <TextField
                              type="number"
                              className="bglight-ip"
                              sx={{ width: "100%" }}
                              placeholder="$"
                              value={compensation[index]?.amount}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                handleAmountChange(index, event.target.value);
                              }}
                            />
                          </>
                        )}
                      </>
                    );
                  })}
                </FormGroup>
                {errors.categoryErr && (
                  <span className="text-danger">
                    Please select the category of damages
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 text-center mt-4">
          <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
            <Button
              isLoading={loading}
              variant="outline"
              size="lg"
              className={`green-border f-16 ${hide ? "d-none" : "block"}`}
              onClick={() => handlePrevious()}
            >
              <span className="f-16">Previous</span>
            </Button>
            <Button
              type="submit"
              variant="primary"
              className={`green-btn injury-submit-btn ${
                hide ? "d-none" : "block"
              }`}
              size="lg"
              onClick={() => checkError()}
            >
              <span className="f-16"> Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Compensation;
