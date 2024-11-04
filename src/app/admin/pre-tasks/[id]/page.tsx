"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "../../admin.css";
import { Spinner } from "@/components/Form/Spinner";

const TaskDetailPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const id = params.id;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskData = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/admin/pre-tasks/${id}`);
          setData(response?.data?.data);
          setLoading(false);
        } catch (error) {
          setError("Failed to load task details");
          setLoading(false);
        }
      }
    };

    fetchTaskData();
  }, [id]);

  if (loading) {
    return <center>Loading...</center>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!data) {
    return <div>No task found</div>;
  }

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Task Details</h2>
      </div>
      <div className="task-detail-page white-card rounded mt-4 p-5">
        <div className="row">
          <div className="col-12 col-md-4 col-xxl-3 mb-3">
            <p>
              <strong className="d-block">Title:</strong>{" "}
              <span>{data.title}</span>
            </p>
          </div>
          <div className="col-12 col-md-4 col-xxl-3  mb-3">
            <p>
              <strong className="d-block">Description:</strong>{" "}
              <span>{data.description}</span>
            </p>
          </div>
          <div className="col-12 col-md-4 col-xxl-3  mb-3">
            <p>
              <strong className="d-block">Category:</strong>{" "}
              <span>{data.category}</span>
            </p>
          </div>
          <div className="col-12 col-md-4 col-xxl-3  mb-3">
            <p>
              <strong className="d-block">caseType:</strong>{" "}
              <span>{data.caseType}</span>
            </p>
          </div>
          <div className="col-12 col-md-4 col-xxl-3  mb-3">
            <p>
              <strong className="d-block">Created On:</strong>{" "}
              <span> {new Date(data.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
          <div className="col-12 col-md-4 col-xxl-3  mb-3">
            <p>
              <strong className="d-block">Valid For (days):</strong>{" "}
              <span> {data.validFor}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
