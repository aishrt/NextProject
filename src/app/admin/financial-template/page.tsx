"use client";
import React, { useEffect, useState } from "react";

import "../../admin/admin.css";
import "./style.css";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import { useSession } from "next-auth/react";
import { useHookForm } from "@/hooks/useHookForm";
import { z } from "zod";
import Form from "@/components/Form/Form";
import { Button } from "@/components/Form/Button";
import { Alert, FormLabel, Snackbar } from "@mui/material";
import useSnackbar from "@/hooks/useSnackbar";
import { axios } from "@/utils/axios";
import TextAreaField from "@/components/Form/TextArea";
import { CircularProgress } from "@mui/material";

type FormValues = {
  settlementDescription: string;
  CommissionDescription: string;
  lawyerDescription: string;
};

const schema = z.object({
  settlementDescription: z
    .string({ required_error: "required" })
    .min(1, " Settlement Description is required"),
  CommissionDescription: z
    .string({ required_error: "required" })
    .min(1, "Commission Description is required"),

  lawyerDescription: z
    .string({ required_error: "Lawyer Description is required" })
    .min(1, "Lawyer Description is required"),
});
function FinancialTemplate() {
  const router = useRouter();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { formState, control } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    setLoading(true);
    axios
      .post("/api/admin/financial-template/update", {
        settlementDescription: values.settlementDescription,
        CommissionDescription: values?.CommissionDescription,
        lawyerDescription: values?.lawyerDescription,
      })
      .then((res: any) => {
        if (res.success) {
          openSnackbar({
            message: "Template updated Successfully",
            type: "success",
          });
          setLoading(false);
          router.push("/admin/dashboard");
        }
      });
  };

  const getSettings = () => {
    axios.get("/api/admin/financial-template").then((res: any) => {
      if (res?.success) {
        setValues({
          settlementDescription: res?.data?.settlementDescription,
          CommissionDescription: res?.data?.CommissionDescription,
          lawyerDescription: res?.data?.lawyerDescription,
        });
        setLoaded(true);
      }
    });
  };
  useEffect(() => {
    getSettings();
  }, []);

  if (!loaded) {
    return (
      <div className="">
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div className="main-content expert-dashboard">
      <div className="pass-settings">
        <div className="row">
          <div className="col-12 col-md-7">
            <div className="white-card rounded-lg profile-exp-docs p-4">
              <h2 className="f-24 semi-bold">Financial Template</h2>
              <div
                className="change-upload p-4 rounded-lg"
                style={{ background: " rgb(224, 237, 250" }}
              >
                <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
                  <div className="row mt-3">
                    <div className="col-12 col-md-12 mt-3">
                      <TextAreaField
                        error={formState.errors["settlementDescription"]}
                        label="Minimum Settlement Amount Description"
                        name="settlementDescription"
                        control={control}
                        cols={8}
                        rows={5}
                      />
                    </div>
                    <div className="col-12 col-md-12 mt-3">
                      <TextAreaField
                        rows={5}
                        error={formState.errors["CommissionDescription"]}
                        label="Indemnisez Moi Commission Description  "
                        name="CommissionDescription"
                        control={control}
                      />
                    </div>

                    <div className="col-12 col-md-12 mt-3">
                      <TextAreaField
                        rows={5}
                        error={formState.errors["lawyerDescription"]}
                        label="Lawyer Settlement Amount Description  "
                        name="lawyerDescription"
                        control={control}
                      />
                    </div>

                    <div className="d-flex justify-content-end">
                      <Button
                        isLoading={loading}
                        className="client-btn mt-3"
                        type="submit"
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                  <Snackbar {...snackProps}>
                    <Alert {...alertProps} />
                  </Snackbar>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialTemplate;
