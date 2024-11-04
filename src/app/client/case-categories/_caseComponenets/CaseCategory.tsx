"use client";

import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import React from "react";
import { SelectChangeEvent } from "@mui/material/Select";
import edu from "@/assets/edu.png";
import hand from "@/assets/hand.png";
import law from "@/assets/law.png";
import money from "@/assets/money.png";
import moral from "@/assets/moral.png";
import time from "@/assets/time.png";
import patient from "@/assets/patient.png";
import civil from "@/assets/civil.png";
import piggy from "@/assets/piggy.png";
import box from "@/assets/box.png";
import casei from "@/assets/case.png";
import compen from "@/assets/compen.png";
import error from "@/assets/error.png";
import rent from "@/assets/rent.png";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

const CaseCategory = () => {
  const router = useRouter();
  const [area, setArea] = React.useState("");
  const [loading, setLoading] = React.useState<string>("");

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const handleChange = (event: SelectChangeEvent) => {
    setArea(event.target.value as string);
  };
  return (
    <div className="query-cols cases-cats mt-5">
      <div className="row">
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("child");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Child support",
                });
                router.push(
                  `/client/child-support-calculation-form?caseId=${caseId}`
                );
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg text-center">
                {loading == "child" ? (
                  <CircularProgress />
                ) : (
                  <Image src={edu} alt="" />
                )}
              </div>
              <p className="f-14 mb-0 text-black cat-title">
                Contribution to the maintenance and education of children
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("competition");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Non Competition",
                });
                router.push(`/client/non-compete-form?caseId=${caseId}`);
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg text-center">
                {loading == "competition" ? (
                  <CircularProgress />
                ) : (
                  <Image src={hand} alt="" />
                )}
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Non-competition clause
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("unfair");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Unfair Competition",
                });
                router.push(
                  `/client/unfair-claim-assessment-form?caseId=${caseId}`
                );
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg text-center">
                {loading == "unfair" ? (
                  <CircularProgress />
                ) : (
                  <Image src={law} alt="" />
                )}
              </div>
              <p className="f-14 mb-0 text-black   cat-title">
                Unfair competition
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("eviction");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Eviction Compensation",
                });
                router.push(
                  `/client/eviction-assessment-form?caseId=${caseId}`
                );
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg text-center">
                {loading == "eviction" ? (
                  <CircularProgress />
                ) : (
                  <Image src={money} alt="" />
                )}
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Main eviction compensation at the end of the commercial lease
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("judicial");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Judicial determination of rent",
                });

                router.push(
                  `/client/judicial-determination-of-rent?caseId=${caseId}`
                );
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg text-center">
                {loading == "judicial" ? (
                  <CircularProgress />
                ) : (
                  <Image src={rent} alt="" />
                )}
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Judicial determination of commercial rent
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("harassment");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Harassment",
                });
                router.push(`/client/harassment-form?caseId=${caseId}`);
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg  text-center">
                {loading == "harassment" ? (
                  <CircularProgress />
                ) : (
                  <Image src={moral} alt="" />
                )}
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Moral harassment
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("overtime");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Overtime Pay Claim",
                });
                router.push(`/client/overtime-pay-claim-form?caseId=${caseId}`);
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg text-center">
                {loading == "overtime" ? (
                  <CircularProgress />
                ) : (
                  <Image src={time} alt="" />
                )}
              </div>
              <p className="f-14 mb-0 text-black  cat-title">Overtime</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("dismissal");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Dismissal Assessment",
                });
                router.push(`/client/dismissal-form?caseId=${caseId}`);
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg text-center">
                {loading == "dismissal" ? (
                  <CircularProgress />
                ) : (
                  <Image src={compen} alt="" />
                )}{" "}
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Compensation for dismissal without real and serious cause
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={() => router.push("")}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg  text-center">
                <Image src={compen} alt="" />
              </div>
              <p className="f-14 mb-0 text-black  cat-title">Dismissal null</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={() => router.push("")}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img box-bg text-center">
                <Image src={patient} alt="" />
              </div>
              <p className="f-14 mb-0 text-black  cat-title">Bodily harm</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={() => router.push("")}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img box-bg text-center">
                <Image src={piggy} alt="" />
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Compensatory allowance
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("sudden");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Sudden termination",
                });
                router.push(
                  `/client/sudden-contract-termination?caseId=${caseId}`
                );
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img  box-bg text-center">
                {loading == "sudden" ? (
                  <CircularProgress />
                ) : (
                  <Image src={error} alt="" />
                )}{" "}
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Sudden termination of established commercial relations
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={() => router.push("")}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img box-bg text-center">
                <Image src={civil} alt="" />
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Civil service disciplinary sanctions
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={async () => {
                setLoading("vexatious");
                await axios.post("/api/client/case/add-case", {
                  caseId: caseId,
                  category: "Vexatious",
                });
                router.push(`/client/vexatious-form?caseId=${caseId}`);
                // setLoading(false);
              }}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img box-bg text-center">
                {loading == "vexatious" ? (
                  <CircularProgress />
                ) : (
                  <Image src={box} alt="" />
                )}
              </div>
              <p className="f-14 mb-0 text-black  cat-title">
                Vexatious circumstances
              </p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4 col-xxl-3 mb-3">
          <div className="light-box bg-white rounded case-cat">
            <div
              onClick={() => router.push("")}
              className="cursor  d-flex flex-wrap  align-items-center cat-cursor"
            >
              <div className="light-img box-bg text-center">
                <Image src={casei} alt="" />
              </div>
              <p className="f-14 mb-0 text-black  cat-title">Other</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CaseCategory;
