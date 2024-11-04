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
import { Financial } from "@/types/Financial";
import { Alert, FormLabel, Snackbar } from "@mui/material";
import useSnackbar from "@/hooks/useSnackbar";

type FormValues = {
  lawyerCommission: string;
  lawyer_description: string;
  platform_commission_description: string;
};
const schema = z.object({
  lawyerCommission: z
    .string({
      required_error: "Lawyer Percentage is required",
    })
    .min(1, "Lawyer Percentage is required")
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
});
const LawyerFinancialForm = ({
  data,
  case_id,
}: {
  data: Financial | undefined;
  case_id: any;
}) => {
  const router = useRouter();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [details, setDetails] = useState({
    CommissionDescription: "",
    lawyerDescription: "",
  });
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const HandleSubmit = (values: FormValues) => {
    setLoading(true);
    const amount =
      (Number(data?.platformAmount) * Number(values?.lawyerCommission)) / 100;
    const totalAmt = Number(data?.platformAmount) - amount;

    let value = {
      case_id,
      lawyerCommission: values.lawyerCommission,
      lawyerAmount: amount,
      remainingPlatformAmount: totalAmt,
      platform_commission_description: details?.CommissionDescription,
      lawyer_description: details?.lawyerDescription,
    };

    axios.post("/api/financial-report/add", value).then((res: any) => {
      if (res?.status == 200) {
        setLoading(false);
        openSnackbar({
          message: "Report created successfuly",
          type: "success",
        });
        router.replace(`/expert/lawyer-financial-report?id=${case_id}`);
      }
    });
  };

  const getDescriptions = () => {
    setLoad(true);
    axios.get("/api/admin/financial-template").then((res: any) => {
      if (res?.success) {
        setDetails({
          CommissionDescription: res?.data?.CommissionDescription,
          lawyerDescription: res?.data?.lawyerDescription,
        });
        setLoad(false);
      }
    });
  };
  useEffect(() => {
    setValues({ lawyerCommission: data?.lawyerCommission?.toString() });
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
                label="Indemnisez Moi Amount"
                name="platform_commission"
                value={data?.platformAmount?.toString()}
                disabled={true}
              />
            </div>
            <div className="col-12 col-md-6 mt-3">
              <label>Description </label>
              <p>{details?.CommissionDescription}</p>
            </div>

            <div className="col-12 col-md-6 mt-3">
              <InputField
                error={formState.errors["lawyerCommission"]}
                label="Lawyer Settlement %"
                name="lawyerCommission"
                control={control}
                type="number"
              />
            </div>
            <div className="col-12 col-md-6 mt-3">
              <label>Description </label>
              <p>{details?.lawyerDescription}</p>
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

      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
};

export default LawyerFinancialForm;
