import AboutBusiness from "@/app/client/sudden-contract-termination/TerminationForm/AboutBusiness";
import SideStory from "@/app/client/sudden-contract-termination/TerminationForm/SideStory";
import TerminationForm from "@/app/client/sudden-contract-termination/TerminationForm/TerminationForm";
import WhatTheyDid from "@/app/client/sudden-contract-termination/TerminationForm/WhatTheyDid";
import React from "react";

function SuddenTerminationReview({ formData }: any) {
  return (
    <>
      <TerminationForm data={formData} hide={true} />
      <SideStory data={formData} hide={true} />
      <AboutBusiness data={formData} hide={true} />
      <WhatTheyDid data={formData} hide={true} />
    </>
  );
}

export default SuddenTerminationReview;
