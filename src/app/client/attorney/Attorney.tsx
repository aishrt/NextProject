"use client";
import React, { useEffect, useState } from "react";
import "../../client/client.css";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { CircularProgress } from "@mui/material";
import { Content } from "@/types/Content";
import axios from "axios";

export default function Attorney() {
  const [loading, setLoading] = useState<boolean>(false);
  const [attorney, setAttorney] = useState<Content>();
  const getAttorney = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `/api/admin/attorney/getAttorney?type=clientAttorney`
      );
      setAttorney(data.data);
      setLoading(false);
    } catch (error) {
      console.log("err", error);
      setLoading(false);
    }
  };
  useEffect(() => {    
    getAttorney();
  }, []);

  return (
    <ContentWrapper>
      <div className="main-content client-docs privacy-client">
        <div className="top-br">
          <h2 className="f-24 pb-3">Attorney Engagement Letter</h2>
        </div>
        <div className="privacy-content white-card rounded-lg p-4">
          {loading ? (
            <div className="text-center my-5">
              <CircularProgress />
            </div>
          ) : (
            <div className="col-12">
              <h2 className="bold f-22">{attorney?.title}</h2>

              <div dangerouslySetInnerHTML={{ __html: attorney?.text || "" }} />
            </div>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
}
