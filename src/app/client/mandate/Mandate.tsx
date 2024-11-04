"use client";
import React, { useEffect, useState } from "react";
import "../../client/client.css";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { CircularProgress } from "@mui/material";
import { Content } from "@/types/Content";
import axios from "axios";

export default function Mandate() {
  const [loading, setLoading] = useState<boolean>(false);
  const [mandate, setMandate] = useState<Content>();
  const getMandate = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/admin/mandate/getMandate?type=clientMandate`
      );
      setMandate(data.data);

      setLoading(false);
    } catch (error) {
      console.log("err", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    
    getMandate();
  }, []);

  return (
    <ContentWrapper>
      <div className="main-content client-docs privacy-client">
        <div className="top-br">
          <h2 className="f-24 pb-3">Financing Agreement</h2>
        </div>
        <div className="privacy-content white-card rounded-lg p-4">
          {loading ? (
            <div className="text-center my-5">
              <CircularProgress />
            </div>
          ) : (
            <div className="col-12">
              <h2 className="bold f-22">{mandate?.title}</h2>

              <div dangerouslySetInnerHTML={{ __html: mandate?.text || "" }} />
            </div>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
}
