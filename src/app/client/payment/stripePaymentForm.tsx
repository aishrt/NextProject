"use client";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import "../../client/client.css";
import LoadingButton from "@mui/lab/LoadingButton";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

const url = process.env.NEXT_PUBLIC_AUTH_URL;

const StripePaymentForm = ({
  reportId,
  amount,
}: {
  reportId: string;
  amount: number;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState<boolean>(false);

  const [load, setLoad] = useState<boolean>(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handlePaymentSubmit = async () => {
    if (!stripe || !elements) {
      return;
    }

    try {
      setLoading(true);
      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${url}/api/payment/update-payment-status?reportId=${reportId}&amount=${amount}&paymentMethod=${"stripe"}`,
        },
      });
      if (result.error) {
        setErrorMessage(result.error.message ?? "");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-form">
      <div className="mb-4 text-center">
        <h2>Make Payment</h2>
      </div>

      <div className="row w-100 m-auto">
        <div className="col-12 col-md-12">
          <PaymentElement />
        </div>
        {/* <div className="col-12 col-md-6">
            <div className="payment-details-container">
              <p className="payment-details">
                <strong>Payment Details:</strong>
              </p>
              <p className="label">
                Appointment Price($):{" "}
                <span className="amount">${price.toFixed(2)}</span>
                <span className="amount">$25</span>
              </p>
            </div>
          </div> */}
        {errorMessage && <p className="error-card w-100">{errorMessage}</p>}
      </div>

      <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
        <LoadingButton
          className="payment-button"
          variant="contained"
          loading={loading}
          onClick={handlePaymentSubmit}
        >
          Pay ${amount}
        </LoadingButton>

        <LoadingButton
          className=""
          variant="outlined"
          loading={load}
          onClick={() => {
            setLoad(true);
            router.back();
          }}
        >
          Cancel Payment
        </LoadingButton>
      </div>
    </form>
  );
};
export default StripePaymentForm;
