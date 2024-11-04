"use client";

import React, { useEffect, useState } from "react";
import AddMember from "@/app/container/case-members/AddMember";
import "../../../client/client.css";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Member } from "@/types/Members";
import { CircularProgress } from "@mui/material";

const EditCaseMember: React.FC = () => {
  const [memberData, setData] = useState<Member>();
  const searchParams = useSearchParams();
  const id = searchParams && searchParams.get("id");
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    if (id) {
      const getData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/client/case-member/${id}`);
          setData(response.data);
        } catch (error) {
          console.error("Failed to fetch member data:", error);
        } finally {
          setLoading(false);
        }
      };
      getData();
    }
  }, [id]);

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Edit Case Member</h2>
      </div>
      <div className="res-table-box">
        <div className="mt-4">
          {loading ? (
            <p className="text-center my-5">
              <CircularProgress />
            </p>
          ) : (
            <AddMember data={memberData} caseId={memberData?.caseId}/>

          )}
        </div>
      </div>
    </div>
  );
};

export default EditCaseMember;

