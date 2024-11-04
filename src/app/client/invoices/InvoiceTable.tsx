"use client";

import React, { useState } from "react";
import Table from "@/components/Table/Table";
import { useCategories } from "@/queries/category";
import { Invoices } from "@/types/Invoices";
import "../../client/client.css";
import Link from "next/link";
import Image from "next/image";
import down from "@/assets/down.png";
import view from "@/assets/view.png";
import { Button } from "@mui/material";

const InvoiceTable = () => {
  const [page, setPage] = useState(1);
  const { data, refetch, isLoading } = useCategories({ page });
  const staticData = [
    {
      number: "1333",
      date: "20/01/2024",
      due_date: "20/01/2024",
      recepient: "",
      amount: "",
      status: "",
    },
    {
      number: "1333",
      date: "20/01/2024",
      due_date: "20/01/2024",
      recepient: "",
      amount: "",
      status: "",
    },
    {
      number: "1333",
      date: "20/01/2024",
      due_date: "20/01/2024",
      recepient: "",
      amount: "",
      status: "",
    },
  ];
  return (
    <div className="invoice-table bgcolor">
      <Table<any>
        data={staticData}
        columns={[
          { field: "number", title: "Invoice Number" },
          { field: "date", title: "Invoice Date" },
          {
            field: "due_date",
            title: "Due Date",
          },

          {
            field: "recepient",
            title: "Recipient",
            Cell({ entry }) {
              return <span>Mark Wilson</span>;
            },
          },
          {
            field: "amount",
            title: "Amount",
            Cell({ entry }) {
              return (
                <span>
                  <span className="d-block">$500</span>
                </span>
              );
            },
          },
          {
            field: "status",
            title: "Status",
            Cell({ entry }) {
              return <span>Paid</span>;
            },
          },

          {
            field: "actions",
            title: "Actions",
            Cell({ entry }) {
              return (
                <span>
                  <span className="action-btns d-flex align-items-center gap-2">
                    <Button variant="contained">Pay Now</Button>
                    <Link href="/">
                      <span>
                        <Image src={down} alt="" className="" />
                      </span>
                    </Link>
                    <Link href="/">
                      <span>
                        <Image src={view} alt="" className="" />
                      </span>
                    </Link>
                  </span>
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
    </div>
  );
};

export default InvoiceTable;
