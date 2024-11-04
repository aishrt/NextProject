"use client";
import React, { useEffect, useState } from "react";

import Table from "@/components/Table/Table";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../admin/admin.css";
import Link from "next/link";
import "./style.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { useSession } from "next-auth/react";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import { z } from "zod";
import Form from "@/components/Form/Form";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import { Alert, FormLabel, Snackbar } from "@mui/material";
import useSnackbar from "@/hooks/useSnackbar";
import { axios } from "@/utils/axios";
import DateField from "@/components/Form/DateField";
import { LineAxisSharp } from "@mui/icons-material";
type FormValues = {
  price: string;
};

const schema = z.object({
  price: z.string({ required_error: "required" }).min(1, "Price is required"),
});
function GeneralSetting() {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({ file: "" });
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [file, setFile] = useState("");
  const { formState, control } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const HandleSubmit = async (values: FormValues) => {
    console.log(values);
    setLoading(true);
    axios
      .post("/api/admin/general/update", {
        price: values.price,
        file: form?.file,
      })
      .then((res: any) => {
        if (res.success) {
          openSnackbar({
            message: "Settings updated Successfully",
            type: "success",
          });
          setLoading(false);
          router.back();
        }
      });
  };
  const UploadFile = (e: any) => {
    setLoading(true);
    let file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    axios.post("/api/uploads", formdata).then((res: any) => {
      console.log(res);

      setLoading(false);

      setForm({ ...form, file: res?.filePath });
    });
  };

  const GetSettings = () => {
    axios.get("/api/admin/general").then((res: any) => {
      console.log(res);
      if (res?.success) {
        setValues({ price: res?.data?.price });
        setForm({ file: res?.data?.file });
        setFile(res?.data?.file);
      }
    });
  };
  useEffect(() => {
    GetSettings();
  }, []);

  return (
    <div className="main-content expert-dashboard">
      <div className="pass-settings">
        <div className="row">
          <div className="col-12 col-md-7">
            <div className="white-card rounded-lg profile-exp-docs p-4">
              <h2 className="f-24 semi-bold">General Setting</h2>
              <p className="f-14 pb-3">
                Please enter your current Password to change your passsword
              </p>
              <div
                className="change-upload p-4 rounded-lg"
                style={{ background: " rgb(224, 237, 250" }}
              >
                <Form<FormValues> onSubmit={HandleSubmit} methods={methods}>
                  <div className="row mt-3 ">
                    <div className="col-12 col-md-12 mt-3">
                      <InputField
                        type="number"
                        error={formState.errors["price"]}
                        label="Report Price"
                        name="price"
                        className="border-0 p-3"
                        control={control}
                      />
                    </div>
                    {file && (
                      <div className="col-12 col-md-12 mt-3">
                        <label>Uploaded PDF</label>
                        <iframe
                          onError={(e: any) => {
                            e.target.src =
                              "https://img.freepik.com/premium-vector/copy-file-icon-dublicate-document-illustration-symbol-app-button-vector_744955-337.jpg";
                          }}
                          src={`${process.env.NEXT_PUBLIC_PDF_URL}/uploads/${file}`}
                        ></iframe>
                      </div>
                    )}
                    <div className="col-12 col-md-12 mt-3">
                      <label>Upload PDF</label>
                      <input
                        type="file"
                        accept="application/pdf"
                        className="form-control border-0 p-3"
                        onChange={UploadFile}
                      />
                    </div>

                    <div className="d-flex justify-content-end">
                      <LoadingButton
                        loading={loading}
                        className="mt-3 client-btn text-white"
                        type="submit"
                      >
                        Submit
                      </LoadingButton>
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

export default GeneralSetting;
