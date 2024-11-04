import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
const stripeSecretKey = process.env.NEXT_STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error("NEXT_STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const amount = req.nextUrl.searchParams.get("amount");
    const totalAmount: number = amount ? parseInt(amount) * 100 : 1;
    const createPayment = await stripe.paymentIntents.create({
      currency: "usd",
      amount: totalAmount,
    });

    return NextResponse.json(
      {
        message: "Client Secret created successfuly",
        status: 200,
        clientSecret: createPayment.client_secret,
        pId: createPayment.id,
      },
      { status: 200 }
    );
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
