"use client"

import React, { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation'
import LawyerTypeForm from "../_lawyerTyperForm"; 
import axios from "axios";
import { LawyerType } from "@/types/LawyerTypes";

const EditLawyerType: React.FC = () => {
  const [lawyerType, setLawyerType] = useState<LawyerType | null>(null);
  const searchParams = useSearchParams()
  const id = searchParams?.get('id');

  useEffect(() => {
    if (id) {
      const fetchLawyerType = async () => {
        try {
          const response = await axios.get(`/api/admin/lawyer-types/${id}`);
          // console.log({response},"response data")
          setLawyerType(response.data);
        } catch (error) {
          console.error("Failed to fetch lawyer type:", error);
        }
      };
      fetchLawyerType();
    }
  }, [id]);

  return (
    <div className="main-content">
      <h2>Edit Lawyer Type</h2>
      {lawyerType ? (
        <LawyerTypeForm lawyerType={lawyerType} /> 
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EditLawyerType;
