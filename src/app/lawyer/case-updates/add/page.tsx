import React from "react";
import "../../../admin/admin.css";
import UpdatesForm from "./form";

function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let case_id: string | string[] | undefined | number = searchParams?.case_id;

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Add Updates</h2>
      </div>
      <div className="res-table-box">
        <div className=" mt-4">
          <UpdatesForm case_id={case_id} />
        </div>
      </div>
    </div>
  );
}

export default Page;
