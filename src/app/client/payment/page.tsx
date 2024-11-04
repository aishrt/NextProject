"use client";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import StripePaymentForm from "./stripePaymentForm";
import axios from "axios";
import { stripePublish } from "@/config/stripe";
import { useSearchParams } from "next/navigation";
import "../../client/client.css";
import { CircularProgress } from "@mui/material";

const stripeKey = stripePublish;

const PaymentForm = () => {
  const Search = useSearchParams();
  const id = Search?.get("id")!;
  const amount = Search?.get("amount")!;
  const totalamount: number = Number(amount);

  const stripePromise = loadStripe(stripeKey ?? "");
  const [secret, setSecret] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        `/api/payment/create-intent?amount=${totalamount}`
      );
      setSecret(data.clientSecret);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [amount, id]);

  return (
    <>
      {loading ? (
        <p className="text-center my-5">
          <CircularProgress />{" "}
        </p>
      ) : (
        <div className="main-content">
          {stripePromise && secret && (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret: secret,
              }}
            >
              <StripePaymentForm reportId={id} amount={totalamount} />
            </Elements>
          )}
        </div>
      )}
    </>
  );
};

export default PaymentForm;
