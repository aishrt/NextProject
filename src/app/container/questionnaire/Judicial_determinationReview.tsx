import BuildingCharacteristics from "@/app/client/judicial-determination-of-rent/_RequestJudicialForm/BuildingCharacteristics";
import LeaseClauses from "@/app/client/judicial-determination-of-rent/_RequestJudicialForm/LeaseClauses";
import LeaseContractDetails from "@/app/client/judicial-determination-of-rent/_RequestJudicialForm/LeaseContractDetails";
import LocalityInformation from "@/app/client/judicial-determination-of-rent/_RequestJudicialForm/LocalityInformation";
import PremisesCharacteristics from "@/app/client/judicial-determination-of-rent/_RequestJudicialForm/PremisesCharacteristics";
import RentAdjustment from "@/app/client/judicial-determination-of-rent/_RequestJudicialForm/RentAdjustment";
import React from "react";

function Judicial_determinationReview({ formData }: any) {
  return (
    <>
      <LeaseContractDetails data={formData} hide={true} />
      <LeaseClauses data={formData} hide={true} />
      <PremisesCharacteristics data={formData} hide={true} />
      <BuildingCharacteristics data={formData} hide={true} />
      <LocalityInformation data={formData} hide={true} />
      <RentAdjustment data={formData} hide={true} />
    </>
  );
}

export default Judicial_determinationReview;
