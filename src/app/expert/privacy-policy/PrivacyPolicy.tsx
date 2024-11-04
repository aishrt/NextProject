"use client";
import React, { useEffect, useState } from "react";
import "../../expert/expert.css";
import { Button } from "@/components/Form/Button";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { CircularProgress, Link } from "@mui/material";
import axios from "axios";
import { Content } from "@/types/Content";

export default function PrivacyPolicy() {
  const [loading, setLoading] = useState<boolean>(false);
  const [privacy, setPrivacy] = useState<Content>();
  useEffect(() => {
    const getPrivacy = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/admin/privacy/getPrivacy?type=expertPrivacyPolicy`
        );
        setPrivacy(data.data);
        setLoading(false);
      } catch (error) {
        console.log("err", error);
        setLoading(false);
      }
    };
    getPrivacy();
  }, []);


  return (
    <ContentWrapper>
      <div className="main-content client-docs privacy-client">
        <div className="top-br">
          <h2 className="f-24 pb-3">Privacy Policy</h2>
        </div>

        <div className="privacy-content white-card rounded-lg p-4">
          {/* <div className="privacy-content"> */}
          {loading ? (
            <div className="text-center my-5">
              <CircularProgress />
            </div>
          ) : (
            <div className="col-12">
              <h2 className="bold f-24">{privacy?.title}</h2>

              <div dangerouslySetInnerHTML={{ __html: privacy?.text || "" }} />
            </div>
          )}
        </div>
      </div>
    </ContentWrapper>
  );
}
