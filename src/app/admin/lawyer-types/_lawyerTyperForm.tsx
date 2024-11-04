"use client";

import React, { useState } from "react";
import { LawyerType } from "@/types/LawyerTypes";
import { useRouter } from "next/navigation";
import axios from "axios";
import { TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import "../admin.css";
interface LawyerTypeFormProps {
  lawyerType?: LawyerType;
}

const LawyerTypeForm: React.FC<LawyerTypeFormProps> = ({ lawyerType }) => {
  const [name, setName] = useState(lawyerType?.name || "");
  const [loading, setLoading] = useState(false); // Manage loading state
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload = { name };
    setLoading(true);

    try {
      if (lawyerType?._id) {
        await axios.put(`/api/admin/lawyer-types/${lawyerType._id}`, payload);
      } else {
        await axios.post("/api/admin/lawyer-types", payload);
      }
      router.push("/admin/lawyer-types");
    } catch (error) {
      console.error("Failed to save lawyer type:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="white-card p-4 rounded indivi-form mt-4">
      <form onSubmit={handleSubmit} className="lawyer-type-form">
        <div className="form-group mb-4">
          <label htmlFor="name" className="mb-1">Type</label>
          <TextField
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            // variant="outlined"
            className="bglight-ip rounded p-0 "
            margin="normal"
          />
        </div>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={loading}
        >
          {lawyerType ? "Update" : "Add"} Lawyer Type
        </LoadingButton>
      </form>
    </div>
  );
};

export default LawyerTypeForm;
