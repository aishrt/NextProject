"use client";
import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../../client/client.css";
import Link from "next/link";
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import "./style.css";
import Image from "next/image";
import { Alert, Button, FormLabel, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { User, UserApiResponse } from "@/types/User";
import axios from "axios";
import { useSession } from "next-auth/react";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { z } from "zod";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from "@mui/lab/LoadingButton";
import useSnackbar from "@/hooks/useSnackbar";
import { FieldWrapper } from "@/components/Form/FieldWrapper";
import { error } from "console";

const schema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, "Title is required"),
  price: z.string({ required_error: "Settlement Amount is required" }),

  discussionPoint: z
    .array(
      z.object({
        name: z
          .string({ required_error: "Discussion Point is required" })
          .min(1, "Discussion Point is required"),
      })
    )
    .nonempty("At least "),

  attendees: z.array(
    z.object({
      name: z
        .string({ required_error: "Attendees is required" })
        .min(2, "Attendees is required"),
    })
  ),
  discussionDate: z
    .string({ required_error: "Discussion Date is required" })
    .min(1, "Date of Discussion is required"),
  isWon: z.boolean({ required_error: "Winning status is required" }),
});

interface discussionPointType {
  name: string;
}
interface discussionPointArry {
  name: discussionPointType[];
}

interface AttendeesType {
  name: string;
}
interface AttendeesArray {
  name: AttendeesType[];
}
type FormValues = {
  title: string;
  description: string;
  attendees: AttendeesArray[];
  discussionPoint: discussionPointType[];
  discussionDate: string;
  isWon: boolean;
  price: number;
};

const UpdatesForm = ({ case_id }: { case_id: any }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, register } = methods;
  const [QuestionData, setQustionData] = useState([{ answer: "", _id: "" }]);
  const [form, setform] = useState({
    description: "",
    exchangedDocument: "",
    document: "",
    isWinYes: false,
    isWinNo: false,
  });
  type PersonErrors = {
    name: string;
  };
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const [MUltiplePoint, setMultiplePoint] = useState([{ name: "" }]);
  const [loading, setLoading] = useState(false);
  const [MUltipleAttendess, setMultipleAttendess] = useState([{ name: "" }]);
  const [personErrors, setPersonErrors] = useState<PersonErrors[]>([
    {
      name: "",
    },
  ]);

  const HandleSubmit = (values: any) => {
    setLoading(true);
    let payload = {
      description: form?.description,
      exchangedDocument: form?.exchangedDocument,
      document: form?.document,
      ...values,
      case_id,
    };
    axios.post("/api/case-updates/add", payload).then((res: any) => {
      if (res?.status == 200) {
        openSnackbar({
          message: "Updates added successully",
          type: "success",
        });
        setLoading(false);
        router.push(`/lawyer/case-updates?case_id=${case_id}`);
      }
    });
  };
  const UploadFile = (e: any, type: any) => {
    setLoading(true);
    let arr: any = [];

    let FileArray = e.target.files;
    if (FileArray?.length > 1) {
      Array.from(FileArray)?.map((itm: any) => {
        let formdata = new FormData();
        formdata.append("file", itm);
        axios.post("/api/uploads", formdata).then((res: any) => {
          if (res.status == 200) {
            setLoading(false);
            arr.push(res?.data?.data?.filePath);
            setform({ ...form, [type]: arr });
          }
          setLoading(false);
        });
      });
      return;
    }

    let file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    axios.post("/api/uploads", formdata).then((res: any) => {
      if (res.status == 200) {
        setLoading(false);

        setform({ ...form, [type]: res?.data?.data?.filePath });
      }
      setLoading(false);
    });
  };
  const AddMoreFields = (key: any) => {
    if (key == "point") {
      let arr: any = [...MUltiplePoint];
      arr.push({ name: "" });
      setMultiplePoint(arr);
    }
    if (key == "attendees") {
      let arr: any = [...MUltipleAttendess];
      arr.push({ name: "" });
      setMultipleAttendess(arr);
    }
  };

  const UpdateFormValues = (key: any, i: any, value: any) => {
    let data = methods.getValues();

    if (key == "point") {
      let arr: any = [...MUltiplePoint];
      arr[i]["name"] = value;
      setValues({ ...data, discussionPoint: arr });
      setMultiplePoint(arr);
    }
    if (key == "attendees") {
      let arr: any = [...MUltipleAttendess];
      arr[i]["name"] = value;
      setValues({ ...data, attendees: arr });

      setMultipleAttendess(arr);
    }
  };

  const RemoveField = (key: any, index: any, itm: any) => {
    let data: any = methods.getValues();
    if (key == "point") {
      let arr: any = [...MUltiplePoint];
      let filter: any = arr.filter(
        (item: any, i: any) => item?.name !== itm?.name
      );
      console.log(filter, arr, itm);

      if (filter?.length == 0) {
        filter = [{ name: "" }];
      }
      setValues({ ...data, discussionPoint: filter });

      setMultiplePoint(filter);
    }
    if (key == "attendees") {
      let arr: any = [...MUltipleAttendess];
      let filter = arr.filter((item: any, i: any) => item?.name !== itm?.name);
      console.log(filter, arr, itm);
      if (filter?.length == 0) {
        filter = [{ name: "" }];
      }
      setValues({ ...data, attendees: filter });
      setMultipleAttendess(filter);
    }
  };

  useEffect(() => {
    if (!form?.isWinYes) {
      methods.clearErrors("price");
    } else {
      methods.setError("price");
    }
    console.log(formState.errors);
  }, [form?.isWinYes]);

  return (
    <div className="cases-list-table expert-table white-card p-4 indivi-form rounded">
      <Form<FormValues> onSubmit={HandleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 col-xxl-6 mt-3">
            <InputField
              error={formState.errors["title"]}
              label="Title of Discussion"
              name="title"
              className="bglight-ip rounded w-100"
              control={control}
            />
          </div>
          {MUltiplePoint?.map((itm: DiscussionPointType, i: number) => {
            return (
              <div className="col-12 col-md-12 col-xl-6 col-xxl-6 mt-3" key={i}>
                <div className="flex-input d-flex align-items-center gap-3">
                  <InputField
                    error={formState.errors?.discussionPoint?.[i]?.name}
                    className="bglight-ip rounded w-100"
                    label="Point of Discussion"
                    onChange={(e: any) => {
                      UpdateFormValues("point", i, e.target.value);
                      if (e.target.value == "") {
                        methods.setError(`discussionPoint.[${i}].name`);
                      } else {
                        methods.clearErrors(`discussionPoint.[${i}].name`);
                      }
                    }}
                    registration={register(
                      `discussionPoint.[${i}].name` as const
                    )}
                    type="text"
                    control={control}
                  />
                  <IoMdAdd
                    onClick={() => {
                      AddMoreFields("point");
                    }}
                  />
                  {i >= 1 && (
                    <MdDelete
                      className="red"
                      onClick={() => {
                        RemoveField("point", i, itm);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          {MUltipleAttendess?.map((itm: AttendeesArray, i: number) => {
            return (
              <div className="col-12 col-md-12 col-xl-6 col-xxl-6 mt-3" key={i}>
                <div className="flex-input d-flex align-items-center gap-3">
                  <InputField
                    error={formState.errors?.attendees?.[i]?.name}
                    className="bglight-ip rounded w-100"
                    label="Attendees Name"
                    onChange={(e: any) => {
                      if (e.target.value == "") {
                        methods.setError(`attendees.[${i}].name`);
                      } else {
                        methods.clearErrors(`attendees.[${i}].name`);
                      }
                      UpdateFormValues("attendees", i, e.target.value);
                    }}
                    registration={register(`attendees.[${i}].name` as const)}
                    type="text"
                    control={control}
                  />
                  {/* <FieldWrapper
                  floating={false}
                  key={`fieldWrap2_${i}`}
                  // label={"Attendees Name"}
                  error={formState.errors[`attendees.${i}.name`]}
                  blueLabel={false}
                >
                  <div className="update-lawyer-in field">
                    <input
                      type="text"
                      onChange={(e: any) => {
                        methods.clearErrors(`attendees`);

                        UpdateFormValues("attendees", i, e.target.value);
                      }}
                      className={`form-control ${
                        formState.errors[`attendees`]?.message == "Required"
                          ? "is-invalid"
                          : ""
                      } `}
                    />

                  {formState.errors[`attendees`]?.message == "Required" && (
                    <label className="text-danger text-error">
                      Attendees is Required
                    </label>
                  )}
                </FieldWrapper> */}
                  <IoMdAdd
                    onClick={() => {
                      AddMoreFields("attendees");
                    }}
                  />
                  {i >= 1 && (
                    <MdDelete
                      className="red"
                      onClick={() => {
                        RemoveField("attendees", i, itm);
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}

          <div className="col-12 col-md-6 mt-3">
            <InputField
              error={formState.errors["discussionDate"]}
              label="Date of Discussion"
              name="discussionDate"
              type="date"
              className="bglight-ip rounded w-100"
              control={control}
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <label>Document</label>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls,image/*,.doc,.docx,.txt,.pdf"
              className="bglight-ip rounded w-100 form-control"
              onChange={(e) => {
                UploadFile(e, "document");
              }}
            />
          </div>
          <div className="col-12 col-md-6 mt-3">
            <label>Exchanged Documents</label>
            <input
              type="file"
              multiple
              accept=".xlsx,.xls,image/*,.doc,.docx,.txt,.pdf"
              className="bglight-ip rounded w-100 form-control"
              onChange={(e) => {
                UploadFile(e, "exchangedDocument");
              }}
            />
          </div>
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
                    setform({
                      ...form,
                      isWinYes: false,
                    });
                  } else {
                    methods.setValue("isWon", true);
                    methods.clearErrors("isWon");
                    setform({
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
          {methods.getValues("isWon") && (
            <div className="col-6 col-md-6 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["price"]}
                label="Settlement Amount"
                name="price"
                type="number"
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
          )}
          <div className="col-12 col-md-8 mt-3 mb-4">
            <label>Description</label>
            <ReactQuill
              theme="snow"
              style={{ height: "100px" }}
              onChange={(e) => setform({ ...form, description: e })}
            />
          </div>

          <div className="col-12 col-md-6 mt-4 text-right mt-5">
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
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
};

export default UpdatesForm;
