"use client";

import * as z from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import { useEffect, useRef, useState } from "react";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useSession } from "next-auth/react";
import SelectField from "@/components/Form/SelectField";
import DateField from "@/components/Form/DateField";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSelectFile } from "@/hooks/useSelectFile";

const options = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

type FormValues = {
  name: string;
  email: string;
  gender: string;
  dob: string;
};
const schema = z.object({
  name: z.string().min(1, "This is required"),
  email: z.string().min(1, "This is required"),
  gender: z.string().min(1, "This is required"),
  dob: z.string().min(1, "This is required"),
});

export default function ProfileComp() {
  const { data, update } = useSession();
  const { file, preview, setPicturePreview, handleChange } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const form = new FormData();
      (Object.keys(values) as Array<keyof FormValues>).forEach((key) => {
        form.append(key, values[key]);
      });
      if (file) {
        form.append("image", file);
      }
      await axios.post("/api/user/profile", form);
      update();
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data && data.user) {
      const user = data.user;
      setValues({
        name: user?.name ?? "",
        email: user?.email ?? "",
        gender: user?.gender ?? "",
        dob: user?.dob ?? "",
      });
      setPicturePreview(user?.image ?? "");
    }
  }, [data]);

  const prev = "https://static.thenounproject.com/png/4035887-200.png";

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div>
        <div className="upload-img-box">
          <img
            className="upload-img"
            src={preview ?? prev}
            // src={data?.user.image ?? ''}
            onClick={() => inputRef.current?.click()}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = prev;
            }}
          />
          <input
            onChange={handleChange}
            ref={inputRef}
            type="file"
            name=""
            id="img"
            className="d-none"
          />
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <InputField
            error={formState.errors["name"]}
            label="Name"
            name="name"
            control={control}
          />
        </div>
        <div className="col-6 ">
          <InputField
            error={formState.errors["email"]}
            label="Email Address"
            name="email"
            control={control}
          />
        </div>
        <div className="col-6 mt-4">
          <SelectField
            options={options}
            label="Gender"
            name="gender"
            error={formState.errors["gender"]}
            control={control}
          />
        </div>
        <div className="col-6 mt-4">
          <DateField
            label="Date of birth"
            name="dob"
            error={formState.errors["dob"]}
            control={control}
          />
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-4">
          <LoadingButton
            loading={loading}
            variant="contained"
            size="large"
            type="submit">
            Submit
          </LoadingButton>
        </div>
      </div>
    </Form>
  );
}
