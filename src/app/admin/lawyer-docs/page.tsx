"use client";

import { Metadata } from "next";
import React, { useEffect } from "react";
import "../../admin/admin.css";
import TableLoad from "./_table";

export default function Lawyers() {
 
  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Lawyer Documents</h2>
      </div>
      <div className="res-table-box">
        <div className="table-responsive mt-4">
          <TableLoad />
        </div>
      </div>
    </div>
  );
}
