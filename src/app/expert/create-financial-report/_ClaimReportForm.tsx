"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../admin/admin.css";
import Link from "next/link";
import "./style.css";
import Image from "next/image";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { User, UserApiResponse } from "@/types/User";
import { z } from "zod";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useHookForm } from "@/hooks/useHookForm";
import TextAreaField from "@/components/Form/TextArea";
import { axios } from "@/utils/axios";
type FormValues = {
  minimum_amount: string;
  minimum_settle_amount_description: string;
  platform_commission: string;
  platform_commission_description: string;
};
const schema = z.object({
  // platform_commission: z
  //   .string({ required_error: "Indemnisez Moi is required" })
  //   .min(1, "Indemnisez Moi is required"),

  minimum_amount: z
    .string({ required_error: "Minimum Amount is required" })
    .min(1, "Minimum Amount is required"),

  platform_commission: z
    .string({
      required_error: "Commission Percentage is required",
    })
    .min(1, "Commission Percentage is required")
    .refine(
      (val) => {
        const percnt = parseInt(val, 10);
        return !isNaN(percnt) && percnt >= 0 && percnt <= 100;
      },
      {
        message: "Percentage should be between 0 and 100",
      }
    )
    .transform((value) => parseInt(value, 10)),

  // minimum_settle_amount_description: z
  //   .string({ required_error: "Required" })
  //   .min(1, "Minimum Amount is required"),
  // platform_commission_description: z       1000 * 10
  //   .string({ required_error: "Required" }) 100
  //   .min(1, "Minimum Amount is required"),
});
const ClaimFinalcialForm = ({
  data,
  case_id,
}: {
  data: UserApiResponse | undefined;
  case_id: any;
}) => {
  const router = useRouter();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [details, setDetails] = useState({
    settlementDescription: "",
    CommissionDescription: "",
  });
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);

  const HandleSubmit = (values: FormValues) => {
    setLoading(true);

    const amount =
      (Number(values?.minimum_amount) * Number(values?.platform_commission)) /
      100;
    const totalAmt = Number(values.minimum_amount) - amount;

    let value = {
      case_id,
      minimum_amount: values?.minimum_amount,
      platform_commission: values?.platform_commission,
      platform_commission_description: details?.CommissionDescription,
      minimum_settle_amount_description: details?.settlementDescription,
      clientAmount: totalAmt,
      platformAmount: amount,
    };
    axios.post("/api/financial-report/add", value).then((res: any) => {      
      if (res?.status == 200) {
        setLoading(false);
        router.push(`/expert/financial-report?id=${case_id}`);
      }
    });
  };

  const getDescriptions = () => {
    setLoad(true);
    axios.get("/api/admin/financial-template").then((res: any) => {
      if (res?.success) {
        setDetails({
          CommissionDescription: res?.data?.CommissionDescription,
          settlementDescription: res?.data?.settlementDescription,
        });
        setLoad(false);
      }
    });
  };
  useEffect(() => {
    getDescriptions();
  }, []);

  return (
    <div className="white-card p-4 bg-white-wrapper">
      {load ? (
        <p className="text-center my-5">
          <CircularProgress />
        </p>
      ) : (
        <Form<FormValues> onSubmit={HandleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mt-3">
              <InputField
                error={formState.errors["minimum_amount"]}
                label="Minimum Settlement Amount"
                name="minimum_amount"
                control={control}
                type="number"
              />
            </div>
            <div className="col-12 col-md-6 mt-3">
              {/* <TextAreaField
              label="Description"
              disabled
              name="minimum_settle_amount_description"
              value={details?.settlementDescription}
              control={control}
            /> */}
              <label>Description </label>
              <p>{details?.settlementDescription}</p>
            </div>
            <div className="col-12 col-md-6 mt-3">
              <InputField
                label="Indemnisez Moi Commission %"
                error={formState.errors["platform_commission"]}
                name="platform_commission"
                control={control}
                type={"number"}
              />
            </div>
            <div className="col-12 col-md-6 mt-3">
              <label>Description </label>

              <p>{details?.CommissionDescription}</p>
            </div>

            <div className="col-12 col-md-6 mt-4 text-left">
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                size="large"
              >
                <span>Submit</span>
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ClaimFinalcialForm;
