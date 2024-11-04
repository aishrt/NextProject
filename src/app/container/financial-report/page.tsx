"use client";
import React, { useEffect, useState } from "react";
import "../../expert/expert.css";
import down from "@/assets/down.png";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import { CircularProgress, Link } from "@mui/material";
import FinancialTable from "./_FinancialTable";
import FinancialTerms from "./_FinancialTerms";
import { useSearchParams } from "next/navigation";
import { Financial } from "@/types/Financial";
import { axios } from "@/utils/axios";

interface ClaimReportProps {
  report: {
    [key: string]: any;
    isFinancialReport?: boolean;
  };
  role: string;
}
const FinancialReport: React.FC<ClaimReportProps> = ({
  role,
  report,
}: {
  role: any;
  report: any;
}) => {
  const [details, setDetails] = useState({
    settlementDescription: "",
    CommissionDescription: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const getDescriptions = () => {
    setLoading(true);
    axios.get("/api/admin/financial-template").then((res: any) => {
      if (res?.success) {
        setDetails({
          CommissionDescription: res?.data?.CommissionDescription,
          settlementDescription: res?.data?.settlementDescription,
        });
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    getDescriptions();
  }, []);
  return (
    <div className="main-content expert-cases case-updates claim-finance-report">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24 pb-0 cfr-heading">Claim Financial Report</h2>
        <Button variant="contained" className="bg-transparent p-0">
          {/* <Image src={down} alt="" className="down-icon" /> */}
        </Button>
      </div>
      {loading ? (
        <p className="text-center my-5">
          <CircularProgress />
        </p>
      ) : (
        <>
          <FinancialTable description={details} report={report?.data} />
          <FinancialTerms report={report?.data} role={role} />
        </>
      )}
    </div>
  );
};
export default FinancialReport;
