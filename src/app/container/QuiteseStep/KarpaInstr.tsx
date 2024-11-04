import React, { useEffect, useState } from "react";
import "../../client/client.css";
import {
  Alert,
  CircularProgress,
  Link,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Child } from "@/types/Child";
import { Button } from "@/components/Form/Button";
import SelectField from "@/components/Form/SelectField";
import Form from "@/components/Form/Form";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import { axios } from "@/utils/axios";
import LoadingButton from "@mui/lab/LoadingButton";
import useSnackbar from "@/hooks/useSnackbar";
type FormValues = {
  document: string;
};
const schema = z.object({
  document: z
    .string({ required_error: "Document is required" })
    .min(1, "Document is required"),
});
function KarpaInstruction({
  progress,
  setProgress,
  hide,
  setActiveStep,
  activeStep,
  data,
  role,
  case_id,
  loading,
  session,
}: any) {
  const router = useRouter();
  const [loadingBtn, setLoading] = useState(false);
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, register } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId")!;
  useEffect(() => {
    if (data?.document) {
      methods.setValue("document", data?.Document);
      methods.clearErrors("document");
    }
  }, [data]);

  const handleNext = async () => {
    setActiveStep(1);
    return setProgress(40);
    try {
      setLoading(true);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const HandleSubmit = (values: any) => {
    if (!data?.document) {
      setLoading(true);

      let payload = {
        case_id,
        document: values?.document,
      };

      axios.post("/api/quitense", payload).then((res: any) => {
        if (res?.success) {
          setLoading(false);
          openSnackbar({
            message: "Instruction  added successfully",
            type: "success",
          });
          //   router.back();
        }

        setLoading(false);
      });
    } else {
      //   if (role == "expert") {
      //     setActiveStep(1);
      //   }
      //   if (data?.step > 2) {
      //     setActiveStep(1);
      //   }
    }
  };
  const UploadFile = (e: any) => {
    setLoading(true);
    let file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    axios.post("/api/uploads", formdata).then((res: any) => {
      setLoading(false);
      methods.setValue("document", res?.filePath);
    });
  };
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4  gray">Carpa Instruction</h3>
      <p className="f-14">
        (This step would mirror the previous structure, guiding the user through
        questions specific to spousal support. It would include sections on
        their financial situation, their spouse&apos;s financial situation,
        asset division, etc.)
      </p>
      <div className="assess-link">
        {loading ? (
          <CircularProgress />
        ) : (
          <Form<FormValues> methods={methods} onSubmit={HandleSubmit}>
            <div className="row mt-3">
              {!data?.document ? (
                <div className="col-12 col-md-12 col-xxl-6 mt-3">
                  <input
                    accept="application/pdf"
                    className="form-control"
                    type="file"
                    onChange={UploadFile}
                  />
                  {formState.errors["document"] && (
                    <p className="text-danger">Document is required</p>
                  )}
                </div>
              ) : (
                <>
                  <img
                    style={{ width: "200px" }}
                    src="https://cdn-icons-png.flaticon.com/512/180/180327.png"
                    alt=""
                  />
                </>
              )}
            </div>

            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                {session?.user?.role == "expert" && (
                  <>
                    <Tooltip
                      title={`${
                        data?.step < 2 && role != "expert"
                          ? "Expert has not updated Pricing details yet."
                          : ""
                      }`}
                    >
                      <LoadingButton
                        variant="contained"
                        loading={loadingBtn}
                        type="submit"
                        className="green-btn"

                        // onClick={() => handleNext()}
                      >
                        <span className="f-16">
                          {!data?.document && role == "expert"
                            ? "Submit"
                            : "Done"}
                        </span>
                      </LoadingButton>
                    </Tooltip>
                  </>
                )}
                {data?.document && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      let BASE_URL = process.env.NEXT_PUBLIC_PDF_URL;
                      let a = document.createElement("a");
                      a.href = `${BASE_URL}${data?.document}`;
                      a.target = "__blank";
                      a.click();
                    }}
                    className="green-btn"
                  >
                    View Instruction
                  </Button>
                )}
              </div>
            </div>
          </Form>
        )}
        {/* {hide || data?.method && (
          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Button
                variant="contained"
                size="lg"
                type="submit"
                className="green-btn"
                onClick={() => handleNext()}
              >
                <span className="f-16">Next</span>
              </Button>
            </div>
          </div>
        )} */}
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
}

export default KarpaInstruction;
