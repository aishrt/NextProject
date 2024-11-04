import db from "@/utils/connectDB";
import Case from "@/models/case.model";
import ClaimReportModel from "@/models/cer_Report.model";
import Payment from "@/models/payment.model";
import { NextRequest, NextResponse } from "next/server";

const generateRandomNumber = (digit: number) => {
  const limit = Math.pow(10, digit);
  const randomNumber = Math.floor(Math.random() * limit);
  const sixDigitNumber = randomNumber.toString().padStart(digit, "0");
  return sixDigitNumber;
};

export async function GET(req: NextRequest) {
  const url = process.env?.NEXTAUTH_URL;

  try {
    db.connectDB();

    const payment_intent = req.nextUrl.searchParams.get("payment_intent");
    const redirect_status = req.nextUrl.searchParams.get("redirect_status");
    const reportId = req.nextUrl.searchParams.get("reportId");
    const paymentMethod = req.nextUrl.searchParams.get("paymentMethod");
    const amount: any = req.nextUrl.searchParams.get("amount");

    const price = Number(amount);
    const randompaymentId = `PID${generateRandomNumber(6)}`;
    const newPayment = await Payment.create({
      reportId: reportId,
      amount: amount,
      paymentId: randompaymentId,
      paymentMethod: paymentMethod,
      status: redirect_status,
    });
    const payment = newPayment.paymentId;

    if (redirect_status === "succeeded") {
      let CaseDetails = await ClaimReportModel.findById(reportId);
      if (!CaseDetails) {
        return NextResponse.json(
          { message: "Report not found !!" },
          { status: 400 }
        );
      }
      await ClaimReportModel.updateOne(
        { _id: reportId },
        { status: "reject", isPurchased: true, paymentId: payment_intent },
        { upsert: true }
      );

      let updateCase = await Case.updateOne(
        { _id: CaseDetails?.case_id },
        {
          evalReportStatus: "reject",
          status: "reject",
        },
        { upsert: true }
      );
      if (!updateCase) {
        return NextResponse.json(
          { message: "Case not found !!" },
          { status: 400 }
        );
      }

      return NextResponse.redirect(
        `${url}/client/payment/payment-success?reportId=${reportId}&paymentId=${payment}&amount=${price.toFixed(
          2
        )}`,
        { status: 307 }
      );
    } else {
      return NextResponse.redirect(
        `${url}/client/payment/payment-failed?reportId=${reportId}&paymentId=${payment}&amount=${price.toFixed(
          2
        )}`,
        { status: 307 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
        status: 500,
      },
      { status: 500 }
    );
  }
}
