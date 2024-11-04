import { Metadata } from "next";
import React from "react";
import "../../client/client.css";
import Image from "next/image";
import doc from "@/assets/folder-open.png";
import { Button, Link } from "@mui/material";
import { DocFilters } from "./_docComponents/DocFilters";

export const metadata: Metadata = {
  title: "Documents",
  description: "Generated by create next app",
};

export default function Documents() {
  return (
    <div className="main-content client-docs">
      <h2 className="f-24">Documents</h2>
      <DocFilters />
      <h3 className="f-20 mt-4 pb-3">Recent Folder</h3>
      <div className="row document-row">
        <div className="col-12 col-md-3  col-lg-3 col-xl-2  mb-4">
          <Link href="/expert/pre-litigation-claim-document">
            <div className="folder-card rounded recent-folder">
              <Image src={doc} className="doc-icn" alt="doc" />
              <div className="doc-filter-fl">
                <h6 className="f-16 mb-0">ID Proof Folder</h6>
                <p className="f-13 mb-0 gray">50 MB</p>
              </div>
            </div>
          </Link>
        </div>
        <div className="col-12 col-md-3  col-lg-3 col-xl-2   mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3  col-lg-3 col-xl-2   mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <h3 className="f-20 mt-4 pb-3">Recent Folder</h3>
      <div className="row document-row">
        <div className="col-12 col-md-3  col-lg-3 col-xl-2   mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3  col-lg-3 col-xl-2   mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3  col-lg-3 col-xl-2   mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3  col-lg-3 col-xl-2  mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3  col-lg-3 col-xl-2   mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 col-lg-3 col-xl-2  mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3  col-lg-3 col-xl-2   mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3 col-lg-3 col-xl-2  mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-3  col-lg-3 col-xl-2   mb-4">
          <div className="folder-card rounded recent-folder">
            <Image src={doc} className="doc-icn" alt="doc" />
            <div className="doc-filter-fl">
              <h6 className="f-16 mb-0">ID Proof Folder</h6>
              <p className="f-13 mb-0 gray">50 MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
