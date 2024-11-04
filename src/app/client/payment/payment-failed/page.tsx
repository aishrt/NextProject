"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import Image from "next/image";
import failed from "@/assets/failed.png";
import "../../../client/client.css";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";

export default function PaymentFailed() {
  const router = useRouter();
  const param = useSearchParams();
  const payId = param?.get("paymentId");
  const amount = param?.get("amount");
  const role = param?.get("role");
  const [loading, setLoading] = useState(false);

  return (
    <ContentWrapper>
      <div className="main-content client-docs privacy-client">
        <div className="d-flex justify-content-between top-br">
          <h2 className="f-24 pb-3">Payment Failed</h2>
          <LoadingButton
            variant="contained"
            className="client-btn f-14 rounded-lg"
            size="large"
            loading={loading}
            onClick={() => {
              setLoading(true);
              router.push("/client/claim-evaluation-report-list");
            }}
          >
            <span>Back</span>
          </LoadingButton>
        </div>

        <div className="client-payment-failed white-card rounded-lg p-5 mt-3">
          <div className="row text-center">
            <div className="col-12 ">
              <div className="payment-image text-center">
                <Image
                  src={failed}
                  className=""
                  alt="success"
                  width={200}
                  height={200}
                />
              </div>
            </div>

            <div className="col-12 pb-3">
              <h3 className="f-32 text-danger semi-bold">Payment Failed !</h3>
              <h4 className="f-24 mt-4">
                Please check your payment information and try again.
              </h4>

              <p className="payment-flex mb-1 pt-3">
                <span className="pay-l semi-bold">Payment Id : </span>{" "}
                <span className="pay-r">{payId}</span>
              </p>
              <p className="payment-flex">
                <span className="pay-l semi-bold">Amount : </span>{" "}
                <span className="pay-r">${amount}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
