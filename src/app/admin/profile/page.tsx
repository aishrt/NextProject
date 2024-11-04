import { Metadata } from "next";
import React from "react";
import "../../client/client.css";
import Link from "next/link";
import Image from "next/image";
import doc from "@/assets/approve.png";
import { Button } from "@/components/Form/Button";
import idcard from "@/assets/id-card.png";
import passport from "@/assets/passport.png";
import { AdminProfile } from "./_AdminProfile";

export const metadata: Metadata = {
  title: "Admin/Profile",
  description: "Generated by create next app",
};

export default function Profile() {
  return (  
    <div className="main-content expert-cases admin-prf">
      <>
        <div className="client-profil">
          <h2 className="f-26 bold py-3">Profile Settings</h2>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="prf-card-client mb-4">
                <AdminProfile />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="white-card rounded-lg  p-4">
                <div className="light-card doc-card doc-light-bg mb-4">
                  <h3 className="f-18 bold pb-3">Contractual Documents</h3>
                  <div className="uploaded-docs d-flex justify-content-between align-items-center">
                    <div className="uploaded-icon d-flex gap-2 align-items-center">
                      <div className="document-icons">
                        <Image src={doc} alt="" />
                      </div>
                      <p className="f-14 doc-name mb-0 semi-bold">
                        Terms & Conditions
                      </p>
                    </div>
                    <div className="view-docs">
                      <Link
                        href="/client/terms"
                        className="dark f-14 semi-bold"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="uploaded-docs d-flex justify-content-between align-items-center">
                    <div className="uploaded-icon d-flex gap-2 align-items-center">
                      <div className="document-icons">
                        <Image src={doc} alt="" />
                      </div>
                      <p className="f-14 doc-name mb-0 semi-bold">
                        Financing Agreement
                      </p>
                    </div>
                    <div className="view-docs">
                      <Link href="/" className="dark f-14 semi-bold">
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="uploaded-docs d-flex justify-content-between align-items-center">
                    <div className="uploaded-icon d-flex gap-2 align-items-center">
                      <div className="document-icons">
                        <Image src={doc} alt="" />
                      </div>
                      <p className="f-14 doc-name mb-0 semi-bold">Mandate</p>
                    </div>
                    <div className="view-docs">
                      <Link href="/" className="dark f-14 semi-bold">
                        View
                      </Link>
                    </div>
                  </div>
                  <div className="uploaded-docs d-flex justify-content-between align-items-center">
                    <div className="uploaded-icon d-flex gap-2 align-items-center">
                      <div className="document-icons">
                        <Image src={doc} alt="" />
                      </div>
                      <p className="f-14 doc-name mb-0 semi-bold">
                        Attorney Engagement Letter
                      </p>
                    </div>
                    <div className="view-docs">
                      <Link href="/" className="dark f-14 semi-bold">
                        View
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="doc-pink-bg doc-card mb-4">
                  <h3 className="f-18 bold pb-3">Identification Details</h3>
                  <div className="uploaded-docs d-flex justify-content-between align-items-center">
                    <div className="uploaded-icon d-flex gap-2 align-items-center">
                      <div className="document-icons">
                        <Image src={idcard} alt="" />
                      </div>
                      <p className="f-14 doc-name mb-0 semi-bold">
                        ID Card Document
                      </p>
                    </div>
                    <div className="view-docs">
                      <Link href="/" className="dark f-14 semi-bold">
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="uploaded-docs d-flex justify-content-between align-items-center">
                    <div className="uploaded-icon d-flex gap-2 align-items-center">
                      <div className="document-icons">
                        <Image src={passport} alt="" />
                      </div>
                      <p className="f-14 doc-name mb-0 semi-bold">
                        Passport Information
                      </p>
                    </div>
                    <div className="view-docs">
                      <Link href="/" className="dark f-14 semi-bold">
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="uploaded-docs d-flex justify-content-between align-items-center">
                    <div className="uploaded-icon d-flex gap-2 align-items-center">
                      <div className="document-icons">
                        <Image src={doc} alt="" />
                      </div>
                      <p className="f-14 doc-name mb-0 semi-bold">
                        Residence Permit Details
                      </p>
                    </div>
                    <div className="view-docs">
                      <Link href="/" className="dark f-14 semi-bold">
                        Edit
                      </Link>
                    </div>
                  </div>
                  <div className="uploaded-btn mt-3 text-center">
                    <Button variant="contained" className="client-btn">
                      Upload New Document
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
