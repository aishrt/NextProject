import AboutEmployer from "@/app/client/vexatious-form/_DismissalForms/AboutEmployer";
import AboutYourself from "@/app/client/vexatious-form/_DismissalForms/AboutYourself";
import DismissalAffected from "@/app/client/vexatious-form/_DismissalForms/DismissalAffected";
import Happened from "@/app/client/vexatious-form/_DismissalForms/Happened";
import Health from "@/app/client/vexatious-form/_DismissalForms/Health";
import SupportingCase from "@/app/client/vexatious-form/_DismissalForms/SupportingCase";
import React from "react";

function VexatiousReview({ formData }: any) {
  return (
    <>
      <AboutYourself data={formData} hide={true} />
      <Health data={formData} hide={true} />
      <AboutEmployer data={formData} hide={true} />
      <Happened data={formData} hide={true} />
      <DismissalAffected data={formData} hide={true} />
      <SupportingCase data={formData} hide={true} />
    </>
  );
}

export default VexatiousReview;
