"use client";

import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import "../../expert/expert.css";
import lock from "@/assets/lockbg.png";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import { Link } from "@mui/material";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Financial } from "@/types/Financial";

export default function FinancialTable({
  report,
  description,
}: {
  report: Financial | undefined;
  description: any;
}) {
  return (
    <div className="financial-tables">
      <div className="white-card p-4 evaluation-report mt-4">
        <table className="w-100">
          <tbody>
            <tr className="bglght rounded">
              <td style={{ borderRadius: "10px 0 0 10px" }}>
                <span className="semi-bold">Minimum Settlement Amount:</span>
              </td>
              {/* <td>
                <span className="semi-bold">Cost:</span>
              </td> */}
              <td style={{ borderRadius: "0px 10px 10px 0" }}>
                <span className="semi-bold">Total:</span>
              </td>
            </tr>
            <tr className=" border-btm rounded">
              <td>
                <span className="semi-bold d-block">
                  Minimum Settlement Amount
                </span>
                <span className="min-amount-set bggray gray f-14 mt-2 p-3 border rounded d-block">
                  {description?.settlementDescription}
                </span>
              </td>
              {/* <td>
                <span className="">
                  <input
                    type="text"
                    className="form-control border p-3"
                    placeholder="$300"
                  />
                </span>
              </td> */}
              <td>
                <span className="">
                  ${report?.minimum_amount}
                  {/* <input
                    type="text"
                    className="form-control border p-3"
                    placeholder="$500"
                  /> */}
                </span>
              </td>
            </tr>
            <tr className="">
              <td>
                <span className="semi-bold d-block">
                  Indemnisez Moi Commission ({report?.platform_commission} %)
                </span>
                <span className="min-amount-set bggray gray f-14 mt-2 p-3 border rounded d-block">
                  {description?.CommissionDescription}
                </span>
              </td>
              <td>
                <span className="d-block">${report?.platformAmount}</span>
                {/* <span className="d-block f-14 gray pb-1">Sub Total</span>
                <span className="d-block f-14 gray pb-1">Discount(0%)</span>
                <span className="d-block f-14 gray pb-1">VAT(5%)</span> */}
              </td>
              {/* <td>
                <span className="d-block text-end pb-1">
                  <Image src={lock} alt="" className="lock-bg" />
                </span>
                <span className="d-block f-14 semi-bold text-end pb-1">
                  $30.00
                </span>
                <span className="d-block f-14 semi-bold text-end pb-1">
                  $0.00
                </span>
                <span className="d-block f-14 semi-bold text-end pb-1">
                  $2.00
                </span>
              </td> */}
            </tr>
            <tr className="total-amount border-top border-bottom">
              <td>
                <h3 className="f-20 semi-bold mb-0">Total Amount</h3>
              </td>
              <td>{report && <span>${report?.clientAmount!}</span>}</td>
            </tr>
            <tr>
              {/* <td colSpan={2}>
                <div className="total-amount border-top border-bottom py-3 d-flex justify-content-between align-items-center">
                  <h3 className="f-20 semi-bold mb-0">Total Amount </h3>
                  <span className="">
                    // <Image src={lock} alt="" className="lock-bg" /> $
                    {report &&
                      report?.minimum_amount + report?.platform_commission}
                  </span>
                </div>
              </td> */}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
