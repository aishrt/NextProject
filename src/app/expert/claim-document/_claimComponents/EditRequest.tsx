"use client";

import React, { useState } from "react";
import Image from "next/image";
import Table from "@/components/Table/Table";
import "../../../client/client.css";
import Button from "@mui/material/Button";
import eye from "@/assets/eye.png";
import doc from "@/assets/document.svg";
import edit from "@/assets/edit.png";
import Link from "next/link";

export const EditRequest = () => {
  const [page, setPage] = useState(1);
  const staticData = [
    {
      ref_id: 1,
      case_id: "2SWW4",
      uploaded: "24th June 2024",
      doc_name: "23EWQ",
      uploaded_type: "",
      key_issue:"Lorem Ipsum",
      status: "",
      action: "",
    },
    {
        ref_id: 1,
        case_id: "2SWW4",
        uploaded: "24th June 2024",
        doc_name: "23EWQ",
        uploaded_type: "",
        key_issue:"Lorem Ipsum",
        status: "",
        action: "",
      },
  ];
  return (
    <Table<any>
      currentPage={1}
      totalEntries={10}
      data={staticData}
      clientPagination={false}
      columns={[
        { field: "ref_id", title: "Sr. No." },
        {
          field: "case_id",
          title: "Case ID",
        },
        {
          field: "uploaded",
          title: "Uploaded on",
        },
        {
          field: "doc_name",
          title: "Doc Name",
        },
        {
            field: "key_issue",
            title: "Key Issue",
          },
       
        {
          field: "uploaded_type",
          title: "Uploaded Documents",
          Cell({ entry }) {
            return <span><div className="uploaded-docs-btn d-flex align-items-center gap-2">
               <Button className="client-btn" variant="contained" size="small">View</Button>
               <Button className="client-btn" variant="contained" size="small">Update</Button>
            </div>
            </span>;
          },
        },
    
        {
          field: "status",
          title: "Status",
          Cell({ entry }) {
              return <span className="pending-status">Pending</span>;
          },
        },
        {
            field: "actions",
            title: "Actions",
            Cell({ entry }) {
              return (
                <span>
                  <span className="action-btns d-flex align-items-center gap-2">
                    
                    <Link href="/">
                      <span>
                        <Image src={edit} alt="" className="view-icons" />
                      </span>
                    </Link>
                    <Link href="/">
                      <span>
                        <Image src={eye} alt="" className="view-icons" />
                      </span>
                    </Link>
                    <Link href="/">
                      <span>
                        <Image src={doc} alt="" className="view-icons" />
                      </span>
                    </Link>
                   
                  </span>
                </span>
              );
            },
          },
      ]}
    />
  );
};
