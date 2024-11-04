import { upperFirst } from "lodash";
import moment from "moment";
import React from "react";
import EvictionReview from "./EvictionReview";

function EvictionQuest({ data }: any) {
  return (
    <>
      <EvictionReview formData={data} />
    </>
    // <div
    //   className="case-details-pre rounded-lg mt-4"
    //   style={{ background: "#FFF" }}
    // >
    //   <div
    //     className="headr-pre p-3 d-flex justify-content-between al  ign-items-center"
    //     style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
    //   >
    //     <h3 className="f-18 semi-bold mb-0">Questioner</h3>
    //   </div>
    //   <div className="pre-card-details">
    //     <div className="pi-card-inner rounded">
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Duration of your initial lease (in years) ?
    //         </span>
    //         <span className="f-13">Ans -{data?.leaseInitialYear}</span>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Current annual rent (excluding taxes) ?
    //           </span>
    //           <span className="f-13">Ans - {data?.annualRent}.</span>
    //         </div>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Are the premises reserved for your exclusive use?
    //           </span>
    //           <span className="f-13">Ans - {data?.premises}.</span>
    //         </div>
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - Which Sector of your main activity ?
    //           </span>
    //           <span className="f-13">Ans - {data?.activityType}.</span>

    //           <>
    //             <span className="title-questioner f-15  semi-bold d-block">
    //               Q - Which option that best describes your specific activity..
    //             </span>
    //             <span className="f-13">Ans - {data?.activitySector}</span>
    //           </>
    //         </div>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Number of lease renewals ?
    //         </span>
    //         <span className="f-13">Ans - {data?.leaseRenewal}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the Date of termination or non-renewal notice ?
    //           {/* {data?.isIndividual == "individual"
    //             ? "Please provide the individual details"
    //             : "Please provide the company details"} */}
    //         </span>
    //         <span className="f-13">
    //           Ans - {moment(data?.terminationDate).format("DD-MMM-YYYY")}
    //         </span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the Effective date of termination ?
    //         </span>
    //         <span className="f-13">
    //           Ans -{" "}
    //           {moment(data?.effectiveTerminationDate).format("DD-MMM-YYYY")}
    //         </span>{" "}
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Reason for termination or non-renewal ?
    //         </span>
    //         <span className="f-13">Ans - {data?.terminationReason}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Can you explain the reconstruction or demolition project?
    //         </span>
    //         <span className="f-13">Ans - {data?.explainReason}.</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Effect of non-renewal on your business ?
    //         </span>
    //         <span className="f-13">
    //           Ans - {upperFirst(data?.nonRenewalEffect)}
    //         </span>

    //         <span className="title-questioner f-15  semi-bold d-block">Q -  Can you describe the details?</span>

    //         <span className="f-13">Ans - {data?.describeNonRenewal}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Have you sublet the premises?
    //         </span>
    //         <span className="f-13">Ans - {upperFirst(data?.sublet)}</span>
    //       </div>
    //       {data?.dismissalAffected && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - what is the sublet area?{" "}
    //           </span>
    //           <span className="f-13">Ans - {data?.subletArea}</span>
    //         </div>
    //       )}

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Main nature of your premises ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.premisesNature}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Area of your premises in square meters: (Main area)?
    //         </span>
    //         <span className="f-13"> Ans - {data?.premisesArea}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Area of your premises in square meters: (Ground surface)?
    //         </span>
    //         <span className="f-13"> Ans - {data?.groundSurface}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q -Area of your premises in square meters: (Weighted area)?
    //         </span>
    //         <span className="f-13"> Ans - {data?.weightedArea}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - At which floor(s) are your premises located (including
    //           annexes)?
    //         </span>
    //         <span className="f-13"> Ans - {data?.premisesLocated}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Nature of other lots in the building ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.otherLotsNature}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How do your clients access the premises from the street?{" "}
    //         </span>
    //         <span className="f-13"> Ans - {data?.premisesAccess}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Type of Building ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.buildingType}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Age of the Building ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.buildingAge}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How many floors does the building have?
    //         </span>
    //         <span className="f-13"> Ans - {data?.buildingFloor}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the size of the city where your premises are located?
    //         </span>
    //         <span className="f-13"> Ans - {data?.citySize}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Location of the Premises ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.location}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Situation of the Premises ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.citySituation}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Public Transport Connectivity ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.transportConnectivity}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Proximity to a Point of Interest ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.pointOfInterest}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q -Reputed Brands Nearby ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.reputedBrand}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Competing Brands Nearby ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.competingBrand}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Miscellaneous Advantages ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.miscellaneousAdvantages}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q -Market rental value determined by an expert ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.rentalValue}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Rental value in case of lease renewal ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.leaseRental}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Reputation ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.reputation}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Number of employees at the date of termination or non-renewal
    //           notice ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.employeesNumber}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Business Operation Period ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.operationPeriod}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Weekly Opening Range ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.weeklyOpening}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How do you rate your business profitability?
    //         </span>
    //         <span className="f-13"> Ans - {data?.profitability}</span>
    //       </div>

    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Client Traffic ?
    //         </span>
    //         <span className="f-13"> Ans - {data?.clientTraffic}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the nature of your inventory?
    //         </span>
    //         <span className="f-13"> Ans - {data?.inventoryNature}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the total value of your inventory in euros?{" "}
    //         </span>
    //         <span className="f-13"> Ans - {data?.inventoryValue}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What are your business strengths?
    //         </span>
    //         <span className="f-13"> Ans - {data?.businessStrength}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Can you describe these strengths?
    //         </span>
    //         <span className="f-13"> Ans - {data?.describeStrength}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What are your business weaknesses?
    //         </span>
    //         <span className="f-13"> Ans - {data?.businessWeakness}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Can you describe these weaknesses?
    //         </span>
    //         <span className="f-13"> Ans - {data?.describeWeakness}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Does your business retain its clientele?
    //         </span>
    //         <span className="f-13"> Ans - {data?.businessRetain}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Which method do you prefer to evaluate your business value?
    //         </span>
    //         <span className="f-13"> Ans - {data?.businessMethod}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - How many activities does your business conduct?
    //         </span>
    //         <span className="f-13"> Ans - {data?.activities}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What is the average annual revenue of your business over the
    //           last three years?{" "}
    //         </span>
    //         <span className="f-13"> Ans - {data?.annualRevenue}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Is your revenue excluding or including taxes?
    //         </span>
    //         <span className="f-13"> Ans - {data?.revenueTaxes}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What percentage of valuation does the lessor propose for your
    //           business?
    //         </span>
    //         <span className="f-13"> Ans - {data?.lessorPercentage}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What percentage of valuation do you propose for your business?
    //         </span>
    //         <span className="f-13"> Ans - {data?.selfPercentage}</span>
    //       </div>
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - What percentage of valuation does an expert propose for your
    //           business?
    //         </span>
    //         <span className="f-13"> Ans - {data?.expertPercentage}</span>
    //       </div>
    //       {data?.annualEBE && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the annual gross operating surplus (EBE) of your
    //             business?{" "}
    //           </span>
    //           <span className="f-13"> Ans - {data?.annualEBE}</span>
    //         </div>
    //       )}
    //       {data?.lessorEBE && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What EBE valuation coefficient does the lessor propose?{" "}
    //           </span>
    //           <span className="f-13"> Ans - {data?.lessorEBE}</span>
    //         </div>
    //       )}
    //       {data?.proposeEBE && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What EBE valuation coefficient do you propose?{" "}
    //           </span>
    //           <span className="f-13"> Ans - {data?.proposeEBE}</span>
    //         </div>
    //       )}
    //       {data?.expertEBE && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What EBE valuation coefficient does an expert propose?{" "}
    //           </span>
    //           <span className="f-13"> Ans - {data?.expertEBE}</span>
    //         </div>
    //       )}
    //       {data?.businessMargin && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What is the annual gross margin of your business?{" "}
    //           </span>
    //           <span className="f-13"> Ans - {data?.businessMargin}</span>
    //         </div>
    //       )}
    //       {data?.lessorMargin && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What gross margin valuation coefficient does the lessor
    //             propose?{" "}
    //           </span>
    //           <span className="f-13"> Ans - {data?.lessorMargin}</span>
    //         </div>
    //       )}
    //       {data?.proposeMargin && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What gross margin valuation coefficient do you propose?{" "}
    //           </span>
    //           <span className="f-13"> Ans - {data?.proposeMargin}</span>
    //         </div>
    //       )}
    //       {data?.expertMargin && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What gross margin valuation coefficient does an expert
    //             propose?{" "}
    //           </span>
    //           <span className="f-13"> Ans - {data?.expertMargin}</span>
    //         </div>
    //       )}
    //       {data?.dailyReceipts && (
    //         <div className="p-3 border-btm-lgt">
    //           <span className="title-questioner f-15  semi-bold d-block">
    //             Q - What are your business daily receipts?
    //           </span>
    //           <span className="f-13"> Ans - {data?.dailyReceipts}</span>
    //         </div>
    //       )}
    //       <div className="p-3 border-btm-lgt">
    //         <span className="title-questioner f-15  semi-bold d-block">
    //           Q - Are there any ongoing collective procedures for your business?
    //         </span>
    //         <span className="f-13"> Ans - {data?.collectiveProcedures}</span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}

export default EvictionQuest;
