"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { LocalizationProvider as MuiLocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import ReactQueryProvider from "./ReactQueryProvider";

const PageSessionProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MuiLocalizationProvider dateAdapter={AdapterMoment}>
      <ReactQueryProvider>
        <SessionProvider>{children}</SessionProvider>
      </ReactQueryProvider>
    </MuiLocalizationProvider>
  );
};

export default PageSessionProvider;
