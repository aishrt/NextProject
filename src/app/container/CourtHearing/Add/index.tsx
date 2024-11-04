"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../../admin/admin.css";
import Link from "next/link";
import "./style.css";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
import { StaticDatePicker, TimePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

type FormValues = {
  title: string;
  description: string;
  objective: string;
  date: string;
  time: string;
  case_id?: any;
  reminderTime?: any;
  reminderTitle?: any;
  reminderDescription?: any;
  reminderDate?: any;
  address: any;
  document: any;
  role: any;
  reminder: any;
  isWon: boolean;
};

const schema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"),
  role: z
    .string({ required_error: "Role is required" })
    .min(1, "Role is required"),
  address: z
    .string({ required_error: "Address is required" })
    .min(1, "Address is required"),
  objective: z
    .string({ required_error: "Objective is required" })
    .min(1, "Objective is required"),
  date: z
    .string({ required_error: "Date is required" })
    .min(1, "Date is required"),
  time: z
    .string({ required_error: "Valid Till is required" })
    .min(1, "Valid Till is required"),
  case_id: z
    .string({ required_error: "Case is required" })
    .min(1, "Case is required"),
  reminderDate: z.string({ required_error: "Date is required" }),
  document: z.string({ required_error: "Document is required" }),

  reminderTitle: z.string({ required_error: "Title is required" }),
  reminderTime: z.string({ required_error: "Time is required" }),
});

const CourtHearingAdd = ({
  data,
  case_id,
  task_id,
  role,
}: {
  data: any;
  case_id?: any;
  task_id?: any;
  role?: any;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [form, setForm] = useState({
    isDocumentYes: false,
    isDocumentNo: false,
    isWinNo: false,
    isWinYes: false,
  });
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const [cases, setCases] = useState<any[]>([]);
  const [valueArr, setValueArr] = useState(null);

  const search: any = useSearchParams();
  const id = search.get("case_id");
  const { formState, control } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();
  const [location, setLocation] = useState("");
  const caseType = search.get("caseType");
  const theme = useTheme();
  const Roles = [
    { value: "client", label: "Client" },
    { value: "expert", label: "Expert" },
    { value: "all", label: "All" },
  ];
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const fetchCases = async () => {
    const res = await axios.get("/api/cases");
    setCases(res.data);
  };
  useEffect(() => {
    if (!case_id || case_id == "null") {
      fetchCases();
    }
    if (case_id && case_id !== "null") {
      methods.setValue("case_id", case_id);
    }
  }, [case_id]);
  console.log(formState.errors);
  const HandleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      let url = "/api/court-hearing";
      const details = methods.getValues();

      let value: any = {
        case_id: details?.case_id,
        title: details.title,
        description: details.description,
        objective: details.objective,
        date: details.date,
        reminder: details?.reminder,
        time: details.time,
        isWon: details?.isWon,
        reminderTime: details?.reminderTime,
        reminderDate: details?.reminderDate,
        reminderTitle: details?.reminderTitle,
        role: details?.role,
        address: location,
        document: details?.document,
        reminderDescription: details?.reminderDescription,
      };

      axios
        .post(url, value)
        .then((res: any) => {
          if (res.success) {
            setLoading(false);
            openSnackbar({
              message: "Court Hearing created successfully",
              type: "success",
            });
            router.push(`/${role}/court-hearing?id=${case_id || ""}`);
          }
          setLoading(false);
        })
        .catch((err: any) => {
          openSnackbar({ message: err?.message, type: "error" });
          setLoading(false);
        });
    } catch (err) {
    } finally {
    }
  };

  useEffect(() => {
    if (!case_id) {
      setValues({
        title: "",
        description: "",
        date: "",
        time: "",
        objective: "",
      });
    }
  }, [case_id]);
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const handleLocation = async (value: any) => {
    try {
      if (location) {
        // return setErr(false);
      }

      if (!value) {
        //  setLocation('');
        // setValueArr(null);
        //return setErr(true);
      }

      const placeId = value?.value?.place_id;

      setValueArr(value);

      if (value) {
        const getLocation = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?place_id=${placeId}&key=${googleMapsApiKey}`
        );
        const data = await getLocation.json();
        const location = data?.results[0]?.formatted_address;
        const coordinates = data?.results[0]?.geometry?.location;
        console.log(location);

        if (location) {
          setLocation(location);
          methods.setValue("address", location);
          methods.clearErrors("address");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadFile = (e: any) => {
    let file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    axios.post("/api/uploads", formdata).then((res: any) => {
      console.log(res);

      methods.setValue("document", res?.filePath);
      methods.clearErrors("document");
    });
  };
  return (
    <div className="main-content expert-dashboard">
      <Form<FormValues> onSubmit={HandleSubmit} methods={methods}>
        <div className="row indivi-form lawyer-form">
          <div className="col-12 col-md-7">
            <div className="rounded p-4 white-card">
              <h3 className="f-24">Court Hearing</h3>
              <div className="row mt-3">
                {(!case_id || case_id == "null") && (
                  <div className="col-12 col-md-12 mt-3  represent-form">
                    <label>Select Case</label>
                    <SelectField
                      error={formState.errors["case_id"]}
                      label=""
                      name="case_id"
                      className="assigneed-roel"
                      options={cases.map((c) => ({
                        value: c._id,
                        label: `#${c.referenceId?.toString()}`,
                      }))}
                      control={control}
                    />
                  </div>
                )}
                <div>
                  <div className="col-12 mt-3">
                    <InputField
                      error={formState.errors["title"]}
                      label="Title"
                      name="title"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                  <div className="col-12 mt-3">
                    <InputField
                      label="Description"
                      name="description"
                      error={formState.errors["description"]}
                      onChange={(e: any) => {
                        console.log(methods.getValues());
                      }}
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                  <div className="col-12 mt-3">
                    <InputField
                      label="Objective"
                      className="bglight-ip"
                      error={formState.errors["objective"]}
                      name="objective"
                      control={control}
                    />
                  </div>
                  <div className="col-12 address-lawyer mb-3">
                    <label className="d-block">Address</label>
                    <GooglePlacesAutocomplete
                      apiKey={googleMapsApiKey}
                      selectProps={{
                        defaultInputValue: "",
                        value: valueArr,
                        isClearable: true,
                        placeholder: "Search for city/location..",
                        onChange: handleLocation,
                      }}
                    />
                    {formState.errors["address"] && (
                      <p className="text-danger">Address is Required</p>
                    )}
                  </div>
                  <div className="col-12 mt-3 date-input">
                    <label className={"form-label"}>Date</label>
                    <DateField
                      disablePast={true}
                      error={formState.errors["date"]}
                      label=""
                      name="date"
                      variant="filled"
                      className="bglight-ip w-100 p-1 rounded"
                      control={control}
                    />
                  </div>
                  <div className="col-12 mt-3  date-input">
                    {" "}
                    <label className={"form-label"}>Time</label>
                    <TimePicker
                      onChange={(e: any) => {
                        let val: any = moment(e).format("hh:mm A");
                        methods.setValue("time", val);
                        if (e) {
                          methods.clearErrors("time");
                        }
                      }}
                      className={`${
                        formState.errors["time"]
                          ? "border border-danger rounded"
                          : ""
                      } rounded bglight-ip w-100 p-1 `}
                    />
                    {formState.errors["time"] && (
                      <p className="text-danger">Time is Required</p>
                    )}
                  </div>
                  <div className="col-12 mt-3  date-input">
                    {" "}
                    <label className={"form-label"}>Upload Document</label>
                    <input
                      className="form-control"
                      type="file"
                      name=""
                      id=""
                      onChange={uploadFile}
                    />
                    {formState.errors["document"] && (
                      <p className="text-danger">document is Required</p>
                    )}
                  </div>
                </div>

                {caseType == "litigation" && (
                  <div className="col-12 col-md-6 mt-3">
                    <FormLabel className="bold f-14 text-black">
                      Is case settled ?
                    </FormLabel>
                    <label>
                      <input
                        type="checkbox"
                        name="isDocument"
                        className="me-3"
                        checked={form.isWinYes === true}
                        onChange={() => {
                          if (form.isWinYes) {
                            methods.clearErrors("isWon");
                            methods.setValue("isWon", false);
                            setForm({
                              ...form,
                              isWinYes: false,
                            });
                          } else {
                            methods.setValue("isWon", true);
                            methods.clearErrors("isWon");
                            setForm({
                              ...form,
                              isWinNo: false,
                              isWinYes: true,
                            });
                          }
                        }}
                      />
                      <span> Yes</span>
                    </label>
                    {/* <label>
              <input
                onChange={() => {
                  methods.clearErrors("isWon");
                  methods.setValue("isWin", false);
                  setform({ ...form, isWinNo: true, isWinYes: false });
                }}
                checked={form.isWinNo === true}
                type="checkbox"
                name="isDocument"
                className="me-3"
              />
              <span> No</span>
            </label> */}
                  </div>
                )}
                <div className="d-flex justify-content-end">
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    className="mt-3 client-btn"
                    type="submit"
                  >
                    <span className="text-white">Add Request</span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="rounded p-4 white-card">
              <h3 className="f-24">Set Reminder</h3>
              <div className="mt-3">
                <div className="row">
                  <div className=" col-12 date-input">
                    {" "}
                    <label className={"form-label"}>Reminder Date</label>
                    <StaticDatePicker
                      className="rminder-date"
                      disablePast
                      onChange={(e: any) => {
                        let val = moment(e).format("DD/MM/YYYY");
                        let reminder = moment(e).format("YYYY-MM-DD");
                        methods.clearErrors("reminderDate");

                        methods.setValue("reminderDate", val);
                        methods.setValue("reminder", reminder);
                      }}
                    />
                    {/* <InputField
            label="Valid Till"
            error={formState.errors["validTill"]}
            name="validTill"
            type={"date"}
            control={control}
          /> */}
                    {formState.errors["reminderDate"] && (
                      <p className="text-danger">Date is Required</p>
                    )}
                  </div>
                </div>
                <div className="remind-card p-4 mt-4">
                  <div className="row">
                    <div className="col-12 mt-3 date-input">
                      <label className={"form-label"}>Title</label>
                      <InputField
                        error={formState.errors["reminderTitle"]}
                        label=""
                        name="reminderTitle"
                        variant="filled"
                        placeholder="Title"
                        className="bglight-ip w-100"
                        control={control}
                      />
                    </div>
                    <div className="col-12 mt-3 date-input">
                      <label className={"form-label"}>Description</label>
                      <InputField
                        error={formState.errors["reminderDescription"]}
                        label=""
                        name="reminderDescription"
                        variant="filled"
                        placeholder="Description"
                        className="bglight-ip w-100"
                        control={control}
                      />
                    </div>
                    <div className="col-12 mt-3 date-input">
                      <label className={"form-label"}>Time</label>
                      <TimePicker
                        onChange={(e: any) => {
                          let val: any = moment(e).format("hh:mm A");
                          methods.setValue("reminderTime", val);
                          if (e) {
                            methods.clearErrors("reminderTime");
                          }
                        }}
                        className={`${
                          formState.errors["reminderTime"]
                            ? "border border-danger rounded"
                            : ""
                        } rounded bglight-ip w-100 p-1 `}
                      />
                      {formState.errors["reminderTime"] && (
                        <p className="text-danger">Time is Required</p>
                      )}
                    </div>
                    <div className="col-12 mt-3  represent-form">
                      <label>Select Member</label>
                      <SelectField
                        error={formState.errors["role"]}
                        label=""
                        name="role"
                        className="assigneed-roel"
                        options={Roles}
                        control={control}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-start">
                  <LoadingButton
                    loading={loading}
                    variant="contained"
                    className="mt-3 client-btn"
                    type="submit"
                  >
                    <span className="text-white">Set</span>
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Snackbar {...snackProps}>
          <Alert {...alertProps} />
        </Snackbar>
      </Form>
    </div>
  );
};

export default CourtHearingAdd;
