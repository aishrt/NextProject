"use client";
import { useHookForm } from "@/hooks/useHookForm";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { useSelectFile } from "@/hooks/useSelectFile";
import "../../expert/expert.css";

export const ExpertImage = () => {
  const { file, preview, setPicturePreview, handleChange } = useSelectFile();
  const inputRef = useRef<HTMLInputElement>(null);
  const prev = "https://static.thenounproject.com/png/4035887-200.png";
  return (
    <div className="documnet-upload p-2">
      <div className="client-profile-foto d-flex align-items-center gap-3 mb-4">
        <div className="upload-img-box mb-0">
          <img
            className="upload-img"
            src={preview ?? prev}
            // src={data?.user.image ?? ''}
            onClick={() => inputRef.current?.click()}
            onError={({ currentTarget }) => {
              currentTarget.onerror = null;
              currentTarget.src = prev;
            }}
          />
          <input
            onChange={handleChange}
            ref={inputRef}
            type="file"
            name=""
            id="img"
            className="d-none"
          />
        </div>
        <h6 className="f-16">Edit Profile Photo</h6>
      </div>
    </div>
  );
};
