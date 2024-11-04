import AdditionalDetails from "@/app/client/non-compete-form/_EvaluationForms/AdditionalDetails";
import AllegedViolation from "@/app/client/non-compete-form/_EvaluationForms/AllegedViolation";
import BasicInformation from "@/app/client/non-compete-form/_EvaluationForms/BasicInformation";
import EvidenceViolation from "@/app/client/non-compete-form/_EvaluationForms/EvidenceViolation";
import NonCompetitionClause from "@/app/client/non-compete-form/_EvaluationForms/NonCompetitionClause";
import React from "react";

function NonCompititionClauseReview({ formData }: any) {
  return (
    <>
      <BasicInformation data={formData} hide={true} />
      <NonCompetitionClause data={formData} hide={true} />
      <AllegedViolation data={formData} hide={true} />
      <EvidenceViolation data={formData} hide={true} />
      <AdditionalDetails data={formData} hide={true} />
    </>
  );
}

export default NonCompititionClauseReview;
