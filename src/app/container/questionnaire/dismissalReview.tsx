"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import { InputField } from "@/components/Form/InputField";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import DateField from "@/components/Form/DateField";

import { Dismissal } from "@/types/Dismissal";
import Understanding from "@/app/client/dismissal-form/_DismissalForms/Understanding";
import AboutYourself from "@/app/client/dismissal-form/_DismissalForms/AboutYourself";
import WorkPlace from "@/app/client/dismissal-form/_DismissalForms/WorkPlace";
import Reasons from "@/app/client/dismissal-form/_DismissalForms/Reasons";
import SideStory from "@/app/client/dismissal-form/_DismissalForms/SideStory";
import Witness from "@/app/client/dismissal-form/_DismissalForms/Witness";

type FormValues = {
  contractDate: string;
  contractDuration: string;
  initialRent: string;
  lastRent: string;
};

const schema = z.object({
  // contractDate: z
  //   .string({ required_error: "Please enter the initial contract date" })
  //   .min(1, "Please enter the initial contract date"),
});

const DismissalReview = ({ data }: { data: Dismissal | undefined }) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");
  const [formData, setData] = useState<Dismissal | null>();

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { formState, control } = methods;

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const [err, setErr] = useState(false);

  useEffect(() => {
    setData(data);
    setChecked(data?.checked ?? false);
    // setValues({
    //   contractDate: data?.contractDate,
    //   contractDuration: data?.contractDuration?.toString(),
    //   initialRent: data?.initialRent?.toString(),
    // });
  }, [data]);

  const clearForm = () => {
    setChecked(false);
    setData(null);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      document
        .querySelectorAll<HTMLElement>(".dismissal-submit-btn")
        .forEach((div: HTMLElement | null) => {
          if (div) {
            div.click();
          }
        });

      if (!checked) {
        return setErr(true);
      }

      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        {
          caseId: caseId,
          checked,
          progress: 90,
          nextProgress: 90,
        }
      );

      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "90");
      router.push(`/client/dismissal-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form mt-5">
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          <Understanding data={formData} hide={true} />
          <AboutYourself data={formData} hide={true} />
          <WorkPlace data={formData} hide={true} />
          <Reasons data={formData} hide={true} />
          <SideStory data={formData} hide={true} />
          <Witness data={formData} hide={true} />
        </>
      )}
    </div>
  );
};

export default DismissalReview;
