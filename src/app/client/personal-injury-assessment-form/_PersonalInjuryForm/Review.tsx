import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import {
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import bubble from "@/assets/info.png";
import SelectField from "@/components/Form/SelectField";
import { NumberField } from "@/components/Form/NumberField";
import { Button } from "@/components/Form/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Injury } from "@/types/Injury";
import VictimDetails from "./VictimDetails";
import AccidentDetails from "./AccidentDetails";
import YourInjury from "./YourInjury";
import VictimDamage from "./VictimDamage";
import ProfessionalImpact from "./ProfessionalImpact";
import EconomicSupportDamages from "./EconomicSupportDamages";
import Compensation from "./Compensation";

const schema = z.object({
  // protection: z
  //   .string({ required_error: "Please select the type of protection measure" })
  //   .min(1, "Please select the type of protection measure"),
});

type FormValues = {};

const Review = ({ data }: { data: Injury | undefined | null }) => {
  const alldata = data;
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const router = useRouter();
  const [formData, setData] = useState<Injury | null>();

  const { formState, control } = methods;
  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const [errors, setErrors] = React.useState({
    categoryErr: false,
  });
  const [loading, setLoading] = React.useState<boolean>(false);

  const [checked, setChecked] = React.useState(false);
  const [err, setErr] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        {
          caseId: caseId,
          progress: alldata?.insurance == "yes" ? 90 : 80,
        }
      );

      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", alldata?.insurance == "yes" ? "90" : "80");
      router.push(
        `/client/personal-injury-assessment-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      document
        .querySelectorAll<HTMLElement>(".injury-submit-btn")
        .forEach((div: HTMLElement | null) => {
          if (div) {
            div.click();
          }
        });

      if (!checked) {
        return setErr(true);
      }
      console.log(checked, "checked");

      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        {
          caseId: caseId,
          checked,
          progress: 110,
          nextProgress: 110,
        }
      );

      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "110");

      router.push(
        `/client/personal-injury-assessment-form?${searchParam.toString()}`
      );

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(data);
    setChecked(data?.checked ?? false);
    setValues({
      // contractDate: data?.contractDate,
      // contractDuration: data?.contractDuration?.toString(),
      // initialRent: data?.initialRent?.toString(),
    });
  }, [data]);

  const clearForm = () => {
    setChecked(false);
    setData(null);
    // formData?.damagesCategory = [{ name: "", amount: "" }];
  };
  return (
    <div className="lease-form">
      <hr />
      <h3 className="f-22 bold gray">Review & Submit </h3>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          <div className="row align-items-end mt-3">
            <p> Please review your information carefully before submitting.</p>
          </div>
          <VictimDetails data={formData} hide={true} />
          <AccidentDetails data={formData} hide={true} />
          <YourInjury data={formData} hide={true} />
          <VictimDamage data={formData} hide={true} />
          <ProfessionalImpact data={formData} hide={true} />
          <EconomicSupportDamages data={formData} hide={true} />
          <Compensation data={formData} hide={true} />
          <div>
            <p className="f-14 gray">
              Here is the list of information headings that should be displayed
              in the summary, with a note for items where multiple responses can
              be selected. Information headings should appear depending of the
              answers of the client.
            </p>
          </div>
          <div>
            <p className="f-14 gray">
              All this information should be summarized and displayed in the
              &quot;Review & Submit&quot; section of the form, ensuring that
              each field is properly filled. Fields that are not applicable
              based on the client&apos;s answers should not appear. Please
              double check if I did not miss an information
            </p>
          </div>
          <div className="row mt-4">
            <p className="f-15">
              {`By clicking "Submit," you confirm that the information provided
                is accurate to the best of your knowledge.`}
            </p>
            <div className="checkbox-review consent  mb-4">
              <label className="f-15">Consent :</label>
              <div className="mb-3 radio-end-input f-13">
                <FormGroup>
                  <FormControlLabel
                    className="radio-light-ip"
                    control={
                      <Checkbox checked={checked} onChange={handleChange} />
                    }
                    label="I confirm that the information I have provided is accurate to the best of my knowledge, and I consent to the terms of the [Privacy Policy]."
                  />
                </FormGroup>
              </div>

              {err && (
                <span className="text-danger mt-0">
                  Please confirm your consent before submitting
                </span>
              )}
            </div>

            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                <Button
                  variant="contained"
                  size="lg"
                  className="green-btn"
                  onClick={handleClick}
                >
                  <span className="f-16">Submit</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="green-border f-16"
                  onClick={() => clearForm()}
                >
                  <span className="f-16">Clear Form</span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Review;
