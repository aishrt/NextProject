"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axios } from "@/utils/axios";
import "../../../admin/admin.css";
import Image from "next/image";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Button } from "@/components/Form/Button";

export interface Document {
  description: string;
  url?: string;
}

export interface LawyerDocuments {
  experiences: Document[];
  educations: Document[];
  achievements: Document[];
  aboutMe: string;
  docStatus: string;
}

const LawyerDetailPage = () => {
  const [data, setData] = useState<LawyerDocuments | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    const fetchLawyerDocuments = async (id: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/admin/lawyers/${id}`);
        setData(response.data);
      } catch (error) {
        setError("Failed to load lawyer documents.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLawyerDocuments(id);
    }
  }, [id]);

  const handleAccept = async () => {
    try {
      await axios.post(`/api/admin/lawyers/${id}/accept`);
      router.push("/admin/lawyer-docs");
    } catch (error) {
      setError("Failed to accept the documents.");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Rejection reason is mandatory.");
      return;
    }

    try {
      await axios.post(`/api/admin/lawyers/${id}/reject`, {
        reason: rejectionReason,
      });
      router.push("/admin/lawyer-docs");
    } catch (error) {
      setError("Failed to reject the documents.");
    } finally {
      setOpenDialog(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const { experiences, educations, achievements, aboutMe, docStatus } =
    data || {};

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24 pb-3">Lawyer Documents</h2>
      </div>
      <div className="about-us-boxes row">
        <div className="col-12 col-md-12">
          <div className="about-us-card">
            <h2 className="f-20 fw-500">About Me</h2>
            <p className="f-14">{aboutMe || "No information provided"}</p>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4">
          <div className="about-us-card  white-card  text-center p-4 rounded">
            <h2 className="f-20 fw-500  pb-4">Experiences</h2>
            <div className="row justify-content-center">
              {experiences?.length ? (
                experiences.map((experience, index) => (
                  <div className="col-12 col-md-12 col-xxl-6" key={index}>
                    {experience.url && (
                      <Image
                        src={experience.url}
                        alt="Experience Document"
                        width={100}
                        height={100}
                      />
                    )}
                    <p className="f-14">{experience.description}</p>
                  </div>
                ))
              ) : (
                <p className="f-14">No experiences provided.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4">
          <div className="about-us-card  white-card  text-center p-4 rounded">
            <h2 className="f-20 fw-500 pb-4">Educations</h2>
            <div className="row justify-content-center">
              {educations?.length ? (
                educations.map((education, index) => (
                  <div className="col-12 col-md-12 col-xxl-6" key={index}>
                    {education.url && (
                      <Image
                        src={education.url}
                        alt="Education Document"
                        width={100}
                        height={100}
                      />
                    )}
                    <p className="f-14">{education.description}</p>
                  </div>
                ))
              ) : (
                <p className="f-14">No educations provided.</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6 col-xl-4">
          <div className="about-us-card  white-card  text-center p-4 rounded">
            <h2 className="f-20 fw-500 pb-4">Achievements</h2>
            <div className="row justify-content-center">
              {achievements?.length ? (
                achievements.map((achievement, index) => (
                  <div className="col-12 col-md-12 col-xxl-6" key={index}>
                    {achievement.url && (
                      <Image
                        src={achievement.url}
                        alt="Achievement Document"
                        width={150}
                        height={150}
                        className="achieve-docs"
                      />
                    )}
                    <p className="f-14 text-center">
                      {achievement.description}
                    </p>
                  </div>
                ))
              ) : (
                <p className="f-14">No achievements provided.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {docStatus === "submitted" ? (
        <div className="d-flex justify-content-center gap-3 mt-4">
          <Button
            variant="contained"
            size="lg"
            className="client-btn f-14"
            onClick={handleAccept}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            className="next-btn"
            onClick={() => setOpenDialog(true)}
          >
            Reject
          </Button>
        </div>
      ) : (
        <div>
          <br />
          <p>{docStatus === "rejected" && <b>Rejection Reason:</b>}</p>
        </div>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reject Documents</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="reason"
            label="Rejection Reason"
            type="text"
            fullWidth
            variant="standard"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleReject}>Reject</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LawyerDetailPage;
