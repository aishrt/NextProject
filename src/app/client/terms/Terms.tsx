"use client";
import React, { useEffect, useState } from "react";
import "../../client/client.css";
import { Button } from "@/components/Form/Button";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { Link, CircularProgress } from "@mui/material";
import { Content } from "@/types/Content";
import axios from "axios";

export default function Terms() {
  const [loading, setLoading] = useState<boolean>(false);
  const [terms, setTerms] = useState<Content>();
  const getTerms = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/admin/terms/getTerms?type=clientTerms`
      );
      setTerms(data.data);

      setLoading(false);
    } catch (error) {
      console.log("err", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    
    getTerms();
  }, []);

  return (
    <ContentWrapper>
      <div className="main-content client-docs privacy-client">
        <div className="top-br">
          <h2 className="f-24 pb-3">Terms and Conditions</h2>
        </div>
        <div className="privacy-content white-card rounded-lg p-4">
          {loading ? (
            <div className="text-center my-5">
              <CircularProgress />
            </div>
          ) : (
            <div className="col-12">
              <h2 className="bold f-22">{terms?.title}</h2>

              <div dangerouslySetInnerHTML={{ __html: terms?.text || "" }} />
            </div>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
}
