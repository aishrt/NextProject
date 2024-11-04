"use client";
import React, { useState } from "react";
import "../../expert/expert.css";
import { Button } from "@/components/Form/Button";
import Table from "@/components/Table/Table";
import Link from "@mui/material/Link";
import { useCategories } from "@/queries/category";

export default function FinancialTable() {
  const [page, setPage] = useState(1);
  const { data, refetch, isLoading } = useCategories({ page });
  const staticData = [
    {
      ref_id: "#223333",
      cost: "",
      totol: "",
    },
    {
      ref_id: "#223333",
      cost: "",
      totol: "",
    },
    {
      ref_id: "#223333",
      cost: "",
      totol: "",
    },
  ];
  return (
    <div className="finance-cases">
      <Table<any>
        clientPagination={false}
        data={staticData}
        columns={[
          {
            field: "ref_id",
            title: "Case Id",

            Cell({ entry }) {
              return (
                <span>
                  <h4 className="f-18 semi-bold">Case Description</h4>
                  <p className="f-14">
                    Indicate the minimum amount you are willing to accept for a
                    quick settlement of the dispute. Any offer below this will
                    be communicated toyou for your opinion.
                  </p>
                </span>
              );
            },
          },
          {
            field: "cost",
            title: "Cost",
            Cell({ entry }) {
              return (
                <span>
                  <input className="form-control case-amt" placeholder="$500" />
                </span>
              );
            },
          },
          {
            field: "total",
            title: "Total",
            Cell({ entry }) {
              return (
                <span>
                  <input className="form-control case-amt" placeholder="$500" />
                </span>
              );
            },
          },
        ]}
        currentPage={data?.currentPage ?? 1}
        totalEntries={data?.totalEntries ?? 10}
        handlePageChange={(e, page) => {
          setPage(page);
          refetch();
        }}
      />
      <div className="row w-100 m-auto total-case-amt-rw mt-5">
        <div className="col-12 col-md-6 col-lg-8">
          <h6 className="f-18 semi-bold">Total Case Amount Charged</h6>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <div className="subtotal-amount">
            <div className="subotal-cols py-1 d-flex justify-content-between">
              <span className="gray">Sub Total</span>
              <span className="semi-bold">$5000</span>
            </div>
            <div className="subotal-cols py-1 d-flex justify-content-between">
              <span className="gray">Discount(0%)</span>
              <span className="semi-bold">0</span>
            </div>
            <div className="subotal-cols py-1 d-flex justify-content-between">
              <span className="gray">VAT(5%)</span>
              <span className="semi-bold">275</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row w-100 m-auto total-case-amt-rw mt-5">
        <div className="col-12 col-md-6 col-lg-8">
          <h6 className="f-18 semi-bold">Total Case Amount on Win</h6>
        </div>
        <div className="col-12 col-md-6 col-lg-4">
          <div className="subtotal-amount border-top border-bottom py-2">
            <div className="subotal-cols py-1 d-flex justify-content-between">
              <span className="f-18 semi-bold"> Total Amount</span>
              <span className="semi-bold f-18">$5000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
