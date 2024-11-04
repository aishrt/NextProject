"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
import { Judicial } from "@/types/Judicial";

type FormValues = {
  firstName: string;

  lastName: string;

  rental: number;
  similarity: string;
  premisesQuality: string;
  valuation: string;
  area: number;
  price: number;
};

const schema = z.object({
  firstName: z.string({ invalid_type_error: "" }).optional(),
  lastName: z.string({ invalid_type_error: "" }).optional(),

  rental: z.number().optional(),
  similarity: z.string({ invalid_type_error: "" }).optional(),
  premisesQuality: z.string({ invalid_type_error: "" }).optional(),
  valuation: z.string({ invalid_type_error: "" }).optional(),
  area: z.number().optional(),
  price: z.number().optional(),
});

interface IProps {
  data: Judicial | undefined;
}
const AddForm = (data: IProps) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState([{ firstName: "", lastName: "" }]);

  const handleAddInput = () => {
    setInputs([...inputs, { firstName: "", lastName: "" }]);
  };

  // const handleChange = (event, index) => {
  //   let { name, value } = event.target;
  //   let onChangeValue = [...inputs];
  //   onChangeValue[index][name] = value;
  //   setInputs(onChangeValue);
  // };

  const handleChanged = (value: any, name: any, index: any) => {
    // let { name, value } = event.target;

    let onChangeValue: any = [...inputs];
    onChangeValue[index][name] = value;
    setInputs(onChangeValue);
  };

  const handleDeleteInput = (index: any) => {
    console.log(index);

    const newArray = [...inputs];
    newArray.splice(index, 1);
    setInputs(newArray);
  };

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      console.log({ ...values });

      setLoading(true);
      // if (errHandle()) {
      //   return;
      // }

      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        {
          caseId: caseId,
          ...values,
          nextProgress: 80,
          progress: 80,
        }
      );

      let id = data.data.caseId;

      // const searchParam = new URLSearchParams();
      // searchParam.set("caseId", id);
      // searchParam.set("progress", "80");

      // router.push(
      //   `/client/judicial-determination-of-rent?${searchParam.toString()}`
      // );

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
        "/api/client/category/judicial/createJudicial",
        {
          caseId: caseId,
          progress: 60,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(
        `/client/judicial-determination-of-rent?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      rental: data?.data?.rental,
    });
  }, [data?.data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold my-4 gray">
        Nearby Premises Expertise (Optional)
      </h3>
      <p className="f-15 pb-3">
        {`The following questions help us understand rental trends in your area.
        Your answers here will strengthen our evaluation. However, if you don't
        have this information readily available, you can skip this section.`}
      </p>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          {inputs.map((item, index) => (
            <div className="input_container" key={index}>
              {/* <input
                name="firstName"
                type="text"
                value={item.firstName}
                onChange={(event) => handleChanged(event, index)}
              />
              <input
                name="lastName"
                type="text"
                value={item.lastName}
                onChange={(event) => handleChanged(event, index)}
              /> */}
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">First Name</label>
                  <InputField
                    error={formState.errors["firstName"]}
                    label="First Name"
                    name={`firstName-${index}`}
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                    emitChange={(value) =>
                      handleChanged(value, `firstName`, index)
                    }
                  />
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">Last Name</label>
                  <InputField
                    error={formState.errors["lastName"]}
                    label="Last Name"
                    name={`lastName-${index}`}
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
              {inputs.length > 1 && (
                <button onClick={() => handleDeleteInput(index)}>Delete</button>
              )}
              {index === inputs.length - 1 && (
                <button onClick={() => handleAddInput()}>Add</button>
              )}
            </div>
          ))}
          <div className="body"> {JSON.stringify(inputs)} </div>

          <div className="text-end">
            <Button variant="primary" size="sm" className="green-btn">
              Add another premises
            </Button>
          </div>
          <div className="col-12 text-center mt-4">
            <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
              <Button
                variant="outline"
                size="lg"
                className="green-border f-16"
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="green-btn"
                size="lg"
                // onClick={() => errHandle()}
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

export default AddForm;
