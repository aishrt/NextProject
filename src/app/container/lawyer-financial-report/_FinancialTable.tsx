"use client";

import React from "react";
import "../../expert/expert.css";

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

              <td style={{ borderRadius: "0px 10px 10px 0" }}>
                <span className="semi-bold">Total:</span>
              </td>
            </tr>
            <tr className=" border-btm rounded">
              <td>
                <span className="semi-bold d-block">
                  Total Amount
                  {/* ({report?.platform_commission} %) */}
                </span>
                <span className="min-amount-set bggray gray f-14 mt-2 p-3 border rounded d-block">
                  {description?.lawyerDescription}
                </span>
              </td>

              <td>
                <span className="">${report?.platformAmount}</span>
              </td>
            </tr>
            <tr className="">
              <td>
                <span className="semi-bold d-block">
                Indemnisez Moi Amount 
                </span>
                <span className="min-amount-set bggray gray f-14 mt-2 p-3 border rounded d-block">
                  {description?.CommissionDescription}
                </span>
              </td>
              <td>
                <span className="d-block">${report?.lawyerAmount}</span>
              </td>
            </tr>
            <tr className="total-amount border-top border-bottom">
              <td>
                <h3 className="f-20 semi-bold mb-0">Total Lawyer Amount ({report?.lawyerCommission}%)</h3>
              </td>
              <td>
                {report && (
                  <span>
                    ${report?.remainingPlatformAmount!}
                  </span>
                )}
              </td>
            </tr>
            <tr></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
