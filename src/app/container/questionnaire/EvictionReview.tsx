import Activity from "@/app/client/eviction-assessment-form/_EvictionForms/Activity";
import Building from "@/app/client/eviction-assessment-form/_EvictionForms/Building";
import BusinessCharacteristics from "@/app/client/eviction-assessment-form/_EvictionForms/BusinessCharacteristics";
import BusinessValuation from "@/app/client/eviction-assessment-form/_EvictionForms/BusinessValuation";
import Lease from "@/app/client/eviction-assessment-form/_EvictionForms/Lease";
import LeaseForm from "@/app/client/eviction-assessment-form/_EvictionForms/LeaseForm";
import LegalAspects from "@/app/client/eviction-assessment-form/_EvictionForms/LegalAspects";
import LocalFactors from "@/app/client/eviction-assessment-form/_EvictionForms/LocalFactors";
import Premises from "@/app/client/eviction-assessment-form/_EvictionForms/Premises";
import Renewal from "@/app/client/eviction-assessment-form/_EvictionForms/Renewal";
import React from "react";

function EvictionReview({ formData }: any) {
  return (
    <>
      <LeaseForm data={formData} hide={true} />
      <Activity data={formData} hide={true} />
      <Renewal data={formData} hide={true} />
      <Premises data={formData} hide={true} />
      <Building data={formData} hide={true} />
      <LocalFactors data={formData} hide={true} />
      <Lease data={formData} hide={true} />
      <BusinessCharacteristics data={formData} hide={true} />
      <BusinessValuation data={formData} hide={true} />
      <LegalAspects data={formData} hide={true} />
    </>
  );
}

export default EvictionReview;
