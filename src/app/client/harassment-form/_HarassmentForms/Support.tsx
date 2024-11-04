"use client";

import React, { useEffect } from "react";
import "../../../client/client.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Harassment } from "@/types/Harassment";

const Support = ({
  data,
  hide,
}: {
  data: Harassment | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        {
          caseId: caseId,
          progress: 90,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "90");
      router.push(`/client/harassment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      let payload: any = {
        caseId: caseId,
      };

      if (!hide) {
        payload = { ...payload, progress: 110, nextProgress: 110 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "110");
        router.push(`/client/harassment-form?${searchParam.toString()}`);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
      <h6 className="f-26  fw-400">Support and Contact</h6>
      <div className="row mt-3">
        <h3 className="f-18 fw-500 pb-3">
          Here are some resources that might be helpful for you.
        </h3>

        <p className="f-16 mb-3">
          <div className="fw-500 f-16">• Defender of Rights: </div>{" "}
          <a
            href={`https://www.defenseurdesdroits.fr/`}
            className="fw-500 dark"
            target="_blank"
          >
            {" "}
            https://www.defenseurdesdroits.fr/
          </a>{" "}
          An independent administrative authority responsible for defending
          individual rights and fighting discrimination in various areas,
          including employment. Provides mediation and guidance services.
        </p>

        <p className="f-16 mb-3">
          <div className="fw-500 f-16">
            • European Association against Violence towards Women at Work
            (AVFT):{" "}
          </div>{" "}
          <a
            href={`https://www.avft.org/`}
            className="bold dark"
            target="_blank"
          >
            {" "}
            https://www.avft.org/
          </a>{" "}
          Focuses on supporting victims of sexual harassment and violence in the
          workplace. Offers helplines, legal guidance, and psychological
          support.
        </p>

        <p className="f-16 mb-3">
          <div className="fw-500 f-16">• SOS Amitié France: </div>{" "}
          <a
            href={`https://www.sos-amitie.com/`}
            className="fw-500  dark"
            target="_blank"
          >
            {" "}
            https://www.sos-amitie.com/
          </a>{" "}
          A 24/7 crisis hotline providing emotional support and suicide
          prevention services.
        </p>
      </div>

      <div className="col-12 text-center mt-4">
        <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
          <Button
            variant="outline"
            size="lg"
            className={`next-btn f-16 ${hide ? "d-none" : "block"}`}
            onClick={() => handlePrevious()}
          >
            <span className="f-16">Previous</span>
          </Button>

          <Button
            variant="contained"
            className={`client-btn harassment-submit-btn ${
              hide ? "d-none" : "block"
            }`}
            size="lg"
            onClick={() => handleSubmit()}
          >
            <span className="f-16">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Support;
